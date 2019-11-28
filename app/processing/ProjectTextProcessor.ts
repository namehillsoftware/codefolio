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
    let skipped = 0;
    return skipUntil(items, () => skipped++ >= count);
}

function skipUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
    return {
        [Symbol.iterator]: function* () {
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
    let taken = 0;
    return takeUntil(items, () => taken++ >= count);
}

function takeUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
    return {
        [Symbol.iterator]: function* () {
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
        
        const subheadingCandidate = take(remainingElements, 1);

        const subheadingParent = [...subheadingCandidate].filter(c => ["heading"].includes(c.type))[0] as Parent;
        const subheading: Parent = subheadingParent
            ? { type: "paragraph", children: subheadingParent.children }
            : null;

        if (subheadingParent)
            remainingElements = skip(remainingElements, 2);

        const bodyContent = takeUntil(remainingElements, isLevelOneHeading);

        const bodyNode: Parent = {
            type: "root", 
            children: [...bodyContent]
        };

        return {
            headline: markdownProcessor.stringify(headline),
            body: markdownProcessor.stringify(bodyNode),
            summary: markdownProcessor.stringify(subheading),
            imageLocation: ""
        }
    }
}