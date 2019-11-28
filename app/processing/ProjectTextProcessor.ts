import unified from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify'

import IProcessProjectText from "./IProcessProjectText";
import Portfolio from "../Portfolio";
import vfile from 'vfile';
import { Parent } from 'unist';

const markdownProcessor = unified().use(markdown, {gfm: true}).use(stringify, { listItemIndent: "mixed" });

interface ITest<T> {
    (item: T): boolean;
}

function* skip<T>(items: Iterable<T>, count: number) {
    let skipped = 0;
    for (let item of items) {
        if (skipped >= count) {
            yield item;
            continue;
        }
        
        ++skipped;
    }
}

function* skipUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
    let firstHit = false;
    for (let item of items) {
        if (!firstHit) {
            if (!predicate(item)) continue;

            firstHit = true;
        }
        
        yield item;
    }
}

function* take<T>(items: Iterable<T>, count: number) {
    let taken = 0;
    for (let item of items) {
        if (taken >= count) break;
        
        ++taken;
        yield item;
    }
}

function* takeUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
    for (let item of items) {
        if (predicate(item)) break;
        yield item;
    }
}

export default class ProjectTextProcessor implements IProcessProjectText {
    processProjectText(text: string): Portfolio {
        const markdown = markdownProcessor.parse(vfile(text)) as Parent;

        const headings = markdown.children.filter(k => k.type === "heading" && (<any>k).depth === 1);
        const headlineParent = headings.length > 0 ? <Parent>headings[0] : null
        const headline: Parent = {
            type: "paragraph",
            children: headlineParent.children
        };

        const subheadingCandidates = 
            take(
                skip(
                    skipUntil(markdown.children, (item) => item === headlineParent), 1), 1);

        const subheadingParent = [...subheadingCandidates].filter(c => ["heading", "paragraph"].includes(c.type))[0] as Parent;
        const subheading: Parent = {
            type: "paragraph",
            children: subheadingParent.children
        };

        const bodyContent = 
            takeUntil(
                skip(skipUntil(markdown.children, (item) => item === (subheadingParent || headlineParent)), 1),
                (item) => item.type === "heading" && (<any>item).depth === 1);

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