import {unified} from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import {find as findNode} from "unist-util-find";
import {remove as removeNode} from "unist-util-remove";
import {squeezeParagraphs} from "mdast-squeeze-paragraphs";
import Image from "../Image";

import IProcessProjectText from "./IProcessProjectText";
import Portfolio from "../Portfolio";
import {VFile} from "vfile";
import { Node, Parent } from "unist";
import {Root} from "remark-parse/lib";
import {Heading, Paragraph, RootContent} from "mdast";
import remarkGfm from "remark-gfm";

const markdownProcessor = unified()
	.use(markdown, {gfm: true})
	.use(remarkGfm)
	.use(stringify, { listItemIndent: "mixed" });

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

function firstOrDefault<T>(items: Iterable<T>, predicate?: ITest<T>) {
	if (predicate)
		items = skipUntil(items, predicate);
	const results = Array.from(take(items, 1));
	return results.length > 0 ? results[0] : null;
}

function isLevelOneHeading(node: Node) {
	return node.type === "heading" && (<any>node).depth === 1;
}

function isValidSubheading(node: Node) {
	return node && (node.type === "paragraph" || (node.type === "heading" && (<any>node).depth > 1)) && !findNode(node, n => n.type === "image");
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
		const markdown = markdownProcessor.parse(new VFile(text));

		let remainingElements = skipUntil(markdown.children, isLevelOneHeading);
		const headlineParent = firstOrDefault(remainingElements) as Heading;
		const headline: Root = {
			type: "root",
			children: [{
				type: "paragraph",
				children: headlineParent.children
			}]
		};

		remainingElements = skip(remainingElements, 1);

		const subheadingCandidate = firstOrDefault(remainingElements) as Paragraph;

		const subheading: Root = isValidSubheading(subheadingCandidate)
			? {
				type: "root",
				children: [{
					type: "paragraph",
					children: subheadingCandidate.children
				}]
			}
			: null;

		if (subheading)
			remainingElements = skip(remainingElements, 1);

		const bodyContent = Array.from(takeUntil(remainingElements, isLevelOneHeading));

		const bodyNode: Root = {
			type: "root",
			children: bodyContent as RootContent[]
		};

		const headlineImage = peelOffImage(bodyNode);

		const examples = new Map<string, Image>();
		let image: Image = null;
		while ((image = peelOffImage(bodyNode)) != null) {
			examples.set(image.url, image);
		}

		squeezeParagraphs(bodyNode);

		return {
			headline: markdownProcessor.stringify(headline).trimEnd(),
			body: markdownProcessor.stringify(bodyNode),
			summary: subheading !== null ? markdownProcessor.stringify(subheading).trimEnd() : null,
			image: headlineImage,
			examples: [...examples.values()],
		};
	}
}
