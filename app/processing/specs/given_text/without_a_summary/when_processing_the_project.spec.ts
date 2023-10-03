import ProjectTextProcessor from "../../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("without a summary", () => {
		describe("when processing the project", () => {
			const heading = "    My ***Fake*** Project";

			const body =
`
* A list begins right away

Here's the **body** copy

* Here's a bulleted list
* With another bullet item

## And here's a subsection

### Another

#### 4

##### 5

###### 6

And some more text, *la-di-da-di-da*`;

			const image = "![Headline](./headline.png \"Headline\")";

			const projectTestProcessor = new ProjectTextProcessor();
			const portfolio = projectTestProcessor.processProjectText(
				`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

${image}

${body}


# Contributing

# And another headline

Here's some more text, hey hey!`);

			it("then it should have the right headline", () => expect(portfolio.headline.trim()).to.equal(heading.trim()));

			it("then it should not have a summary", () => expect(portfolio.summary).to.be.null);

			it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(body.trim()));

			it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
				url: "./headline.png",
				alt: "Headline",
				title: "Headline"
			}));
		});
	});
});
