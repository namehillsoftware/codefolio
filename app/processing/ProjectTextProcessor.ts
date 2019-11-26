import unified from 'unified';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import markdown from 'remark-parse';
import toString from 'mdast-util-to-string';

import IProcessProjectText from "./IProcessProjectText";
import vfile from 'vfile';
import { Parent } from 'unist';

const markdownParser = unified()
                .use(markdown, {commonmark: true})
                .use(remark2rehype)
                .use(html)

export default class ProjectTextProcessor implements IProcessProjectText {
    async promiseProjectText(text: string): Promise<import("../Portfolio").default> {
        const markdown = markdownParser.parse(vfile(text)) as Parent;

        const headings = markdown.children.filter(k => k.type == "heading");
        const headline = headings.length > 0 ? toString(headings[0]) : null;

        const paragraphs = markdown.children.filter(c => c.type == "paragraph");
        const body = paragraphs.length > 0 ? toString(paragraphs[0]) : null;

        return {
            headline: headline,
            body: body,
            imageLocation: ""
        }
    }
}