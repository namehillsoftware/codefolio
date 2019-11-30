import unified from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import findNode from 'unist-util-find';
import removeNode from 'unist-util-remove';
import Image from "../Image";

import IProcessProjectText from "./IProcessProjectText";
import Portfolio from "../Portfolio";
import vfile from 'vfile';
import { Node, Parent } from 'unist';

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

function firstOrDefault<T>(items: Iterable<T>, predicate?: ITest<T>) {
    if (predicate)
        items = skipUntil(items, predicate);
    let results = Array.from(take(items, 1));
    return results.length > 0 ? results[0] : null;
}

function isLevelOneHeading(node: Node) {
    return node.type === "heading" && (<any>node).depth === 1;
}

function isValidSubheading(node: Node) {
    return node && (node.type === "paragraph" || (node.type === "heading" && (<any>node).depth > 1));
}

export default class ProjectTextProcessor implements IProcessProjectText {
    processProjectText(text: string): Portfolio {
        const markdown = markdownProcessor.parse(vfile(text)) as Parent;

        let remainingElements = skipUntil(markdown.children, isLevelOneHeading);
        const headlineParent = firstOrDefault(remainingElements) as Parent;
        const headline: Parent = {
            type: "paragraph",
            children: headlineParent.children
        };

        remainingElements = skip(remainingElements, 1);

        let subheadingCandidate = firstOrDefault(remainingElements) as Parent;

        const subheading: Parent = isValidSubheading(subheadingCandidate) 
            ? { type: "paragraph", children: subheadingCandidate.children }
            : null;

        if (subheading)
            remainingElements = skip(remainingElements, 1);

        const bodyContent = Array.from(takeUntil(remainingElements, isLevelOneHeading));

        const bodyNode: Parent = {
            type: "root", 
            children: bodyContent
        };

        const imageNode = findNode(bodyNode, node => node.type === "image") as any;
        let image: Image = null;
        if (imageNode) {
            image = {
                url: imageNode.url,
                title: imageNode.title,
                alt: imageNode.alt
            };

            removeNode(bodyNode, imageNode);
        }
        
        return {
            headline: markdownProcessor.stringify(headline),
            body: markdownProcessor.stringify(bodyNode),
            summary: subheading !== null ? markdownProcessor.stringify(subheading) : null,
            image: image
        };
    }
}