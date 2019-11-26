import unified from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify'

import IProcessProjectText from "./IProcessProjectText";
import vfile from 'vfile';
import { Parent } from 'unist';

const markdownProcessor = unified().use(markdown, {gfm: true}).use(stringify);

export default class ProjectTextProcessor implements IProcessProjectText {
    async promiseProjectText(text: string): Promise<import("../Portfolio").default> {
        const markdown = markdownProcessor.parse(vfile(text)) as Parent;

        const headings = markdown.children.filter(k => k.type == "heading" && (<any>k).depth == 1);
        const headline = headings.length > 0 ? markdownProcessor.stringify(headings[0]) : null;

        const paragraphs = markdown.children.filter(c => c.type == "paragraph");
        const body = paragraphs.length > 0 ? markdownProcessor.stringify(paragraphs[0]) : null;

        return {
            headline: headline,
            body: body,
            imageLocation: ""
        }
    }
}