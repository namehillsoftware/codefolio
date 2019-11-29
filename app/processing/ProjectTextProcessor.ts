import unified from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify'

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
    }
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
    }
}

function isLevelOneHeading(node: Node) {
    return node.type === "heading" && (<any>node).depth === 1;
}

export default class ProjectTextProcessor implements IProcessProjectText {
    processProjectText(text: string): Portfolio {
        const markdown = markdownProcessor.parse(vfile(text)) as Parent;

        const headings = markdown.children.filter(isLevelOneHeading);
        const headlineParent = headings.length > 0 ? <Parent>headings[0] : null
        const headline: Parent = {
            type: "paragraph",
            children: headlineParent.children
        };

        let remainingElements = skip(skipUntil(markdown.children, (item) => item === headlineParent), 1);

        const subheadingCandidate = Array.from(take(remainingElements, 1))
            .filter(c => {
                switch (c.type) {
                    case "paragraph": return true;
                    case "heading":
                        return (<any>c).depth > 1;
                    default: return false;
                }
            });

        const subheadingParent = subheadingCandidate.length > 0 ? <Parent>subheadingCandidate[0] : null;
        const subheading: Parent = subheadingParent
            ? { type: "paragraph", children: subheadingParent.children }
            : null;

        if (subheadingParent)
            remainingElements = skip(remainingElements, 1);

        const bodyContent = takeUntil(remainingElements, isLevelOneHeading);

        const bodyNode: Parent = {
            type: "root", 
            children: [...bodyContent]
        };

        return {
            headline: markdownProcessor.stringify(headline),
            body: markdownProcessor.stringify(bodyNode),
            summary: subheading != null ? markdownProcessor.stringify(subheading) : null,
            imageLocation: ""
        }
    }
}