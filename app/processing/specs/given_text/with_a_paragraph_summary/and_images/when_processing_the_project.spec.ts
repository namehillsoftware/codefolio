import ProjectTextProcessor from "../../../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("with a paragraph summary", () => {
		describe("and images", () => {
			describe("when processing the project", () => {
				const heading = "    My _Fake_ Project";

				const summary = " Wow this library **is** fantastic!";

				const headlineImages = "![Image](image.png)";

				const fancyExample = "![Fancy Example](fancy.png)";
				const boringExample = "![Boring Example](boring.png)";

				const projectTestProcessor = new ProjectTextProcessor();
				const portfolio = projectTestProcessor.processProjectText(
					`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

${summary}

${headlineImages}

${boringExample}

${fancyExample}

# Contributing

# And another headline

Here's some more text, hey hey!`);

				it("then it should have the right headline", () => expect(portfolio.headline.trim()).to.equal(heading.trim()));

				it("then it should have the right summary", () => expect(portfolio.summary.trim()).to.equal(summary.trim()));

				it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(""));

				it("then it should have the right headline image", () => expect(portfolio.image).to.deep.equal({
					url: "image.png",
					alt: "Image",
					title: null
				}));

				it("then it should have the boring example", () => expect(portfolio.examples[0]).to.deep.equal({
					url: "boring.png",
					alt: "Boring Example",
					title: null
				}));

				it("then it should have the fancy example", () => expect(portfolio.examples[1]).to.deep.equal({
					url: "fancy.png",
					alt: "Fancy Example",
					title: null
				}));
			});
		});
	});
});
