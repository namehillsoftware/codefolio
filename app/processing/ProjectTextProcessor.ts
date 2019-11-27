import unified from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify'

import IProcessProjectText from "./IProcessProjectText";
import vfile from 'vfile';
import { Parent } from 'unist';

const markdownProcessor = unified().use(markdown, {gfm: true}).use(stringify, { listItemIndent: "mixed" });

interface ITest<T> {
    (item: T): boolean;
}

function* skip<T>(items: Iterable<T>, count: number) {
    let skipped = 0;
    for (let item of items) {
        if (skipped++ < count) continue;
        yield item;
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

function* takeUntil<T>(items: Iterable<T>, predicate: ITest<T>) {
    for (let item of items) {
        if (predicate(item)) break;
        yield item;
    }
}

export default class ProjectTextProcessor implements IProcessProjectText {
    async promiseProjectText(text: string): Promise<import("../Portfolio").default> {
        const markdown = markdownProcessor.parse(vfile(text)) as Parent;

        const headings = markdown.children.filter(k => k.type === "heading" && (<any>k).depth === 1);
        const headlineParent = headings.length > 0 ? <Parent>headings[0] : null
        const headline: Parent = {
            type: "root",
            children: headlineParent.children
        };

        const bodyContent = 
            takeUntil(
                skip(skipUntil(markdown.children, (item) => item === headlineParent), 1),
                (item) => item.type === "heading" && (<any>item).depth === 1);
        const bodyNode: Parent = {
            type: "root", 
            children: [...bodyContent]
        };

        console.log(bodyNode);
        
        return {
            headline: markdownProcessor.stringify(headline),
            body: markdownProcessor.stringify(bodyNode),
            imageLocation: ""
        }
    }
}