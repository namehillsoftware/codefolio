import ProjectTextProcessor from "../../../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("with_a_paragraph_summary", () => {
		describe("when processing the project", () => {
			const heading = "    My _Fake_ Project";

			const summary = " Wow this library **is** fantastic!";

			const image = "![Image](image.png)";

			const projectTestProcessor = new ProjectTextProcessor();
			const portfolio = projectTestProcessor.processProjectText(
				`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

${summary}

${image}


# Contributing

# And another headline

Here's some more text, hey hey!`);

			it("then it should have the right headline", () => expect(portfolio.headline.trim()).to.equal(heading.trim()));

			it("then it should have the right summary", () => expect(portfolio.summary.trim()).to.equal(summary.trim()));

			it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(""));

			it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
				url: "image.png",
				alt: "Image",
				title: null
			}));
		});
	});
});
