import unified from 'unified';
import createStream from 'unified-stream';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import markdown from 'remark-parse';

import Portfolio from "./Portfolio";
import ISupplyProjects from "./ISupplyProjects";
import Project from "./Project";

export default class {
    constructor(private readonly projectSupplier: ISupplyProjects) {}

    async promisePortfolios(): Promise<Portfolio[]> {
        var projects = await this.projectSupplier.promiseProjects();

        return await Promise.all(projects.map(async project => {
            const parsedMarkdown = await unified()
                .use(markdown, {commonmark: true})
                .use(remark2rehype)
                .use(html)
                .process(project.location);

            return {
                headline: "something",
                body: "hi",
                imageLocation: "img.jpg"
            };
        }));
    }
}