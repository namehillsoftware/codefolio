import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import findNode from "unist-util-find";
import removeNode from "unist-util-remove";
import squeezeParagraphs from "mdast-squeeze-paragraphs";
import Image from "../Image";

import IProcessProjectText from "./IProcessProjectText";
import Portfolio from "../Portfolio";
import vfile from "vfile";
import { Node, Parent } from "unist";

const markdownProcessor = unified().use(markdown, {gfm: true}).use(stringify, { listItemIndent: "mixed" });

interface ITest<T> {
    (item: T): boolean;
}

function skip<T>(items: Iterable<T>, count: number) {
	return {
		*[Symbol.iterator]() {
			let skipped = 0;
			yield* skipUntil(items, () => skipped++ >= count);
		}
	};
}

function skipUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
	return {
		*[Symbol.iterator]() {
			let firstHit = false;
			for (const item of items) {
				if (!firstHit) {
					if (!predicate(item)) continue;

					firstHit = true;
				}

				yield item;
			}
		}
	};
}

function take<T>(items: Iterable<T>, count: number) {
	return {
		*[Symbol.iterator]() {
			let taken = 0;
			yield* takeUntil(items, () => taken++ >= count);
		}
	};
}

function takeUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
	return {
		*[Symbol.iterator]() {
			for (const item of items) {
				if (predicate(item)) return;
				yield item;
			}
		}
	};
}

function isLevelOneHeading(node: Node) {
	return node.type === "heading" && (<any>node).depth === 1;
}

function peelOffImage(bodyNode: Parent): Image {
	const imageNode = findNode(bodyNode, node => node.type === "image") as any;
	if (!imageNode) return null;

	const image = {
		url: imageNode.url,
		title: imageNode.title,
		alt: imageNode.alt
	};

	removeNode(bodyNode, { cascade: false }, imageNode);

	return image;
}

export default class ProjectTextProcessor implements IProcessProjectText {
	processProjectText(text: string): Portfolio {
		const markdown = markdownProcessor.parse(vfile(text)) as Parent;

		const remainingElements = skipUntil(markdown.children, isLevelOneHeading);

		const bodyContent = [...take(remainingElements, 1), ...takeUntil(skip(remainingElements, 1), isLevelOneHeading)];

		const bodyNode: Parent = {
			type: "root",
			children: bodyContent
		};

		const headlineImage = peelOffImage(bodyNode);

		const examples = [];
		let image: Image = null;
		while ((image = peelOffImage(bodyNode)) != null) {
			examples.push(image);
		}

		squeezeParagraphs(bodyNode);

		return {
			body: markdownProcessor.stringify(bodyNode),
			image: headlineImage,
			examples: examples,
		};
	}
}
