import ProjectTextProcessor from "../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("when processing the project", () => {
		const heading = "    My _Fake_ Project";

		const summary = "Some **great** stuff here";

		const image = "![Check out the image](./image.png \"A sweet title\")";

		const body =
`Here's the **body** copy

- Here's a bulleted list
- With another bullet item

![Here's another image](./contributing.png)

## And here's a subsection

### Another

#### 4

##### 5

###### 6

And some more text, _la-di-da-di-da_`;

		const projectTestProcessor = new ProjectTextProcessor();
		const portfolio = projectTestProcessor.processProjectText(
			`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

## ${summary}

${image}

${body}

# Contributing

![Here's another image](./contributing.png)

# And another headline

Here's some more text, hey hey!`);

		it("then it should have the right headline", () => expect(portfolio.headline.trim()).to.equal(heading.trim()));

		it("then it should have the right summary", () => expect(portfolio.summary.trim()).to.equal(summary.trim()));

		it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(body.trim()));

		it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
			url: "./image.png",
			alt: "Check out the image",
			title: "A sweet title"
		}));
	});
});
