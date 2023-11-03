import ProjectTextProcessor from "../../../ProjectTextProcessor.js";
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

			it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(`# ${heading.trim()}` + "\n\n" + body.trim()));

			it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
				url: "./headline.png",
				alt: "Headline",
				title: "Headline"
			}));

			it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
				url: "./headline.png",
				alt: "Headline",
				title: "Headline"
			}));
		});
	});
});
