import ProjectTextProcessor from "../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("when processing the project", () => {
		const heading = "    My *Fake* Project";

		const summary = "Some **great** stuff here";

		const image = "![Check out the image](./image.png \"A sweet title\")";

		const firstBodyHalf =
`Here's the **body** copy

* Here's a bulleted list
* With another bullet item`;

		const secondBodyHalf =
`## And here's a subsection

### Another

#### 4

##### 5

###### 6

And some more text, *la-di-da-di-da*`;

		const body =
`${firstBodyHalf}

![Here's another image](./contributing.png)

${secondBodyHalf}`;

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

		it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(
			`${firstBodyHalf.trim()}

${secondBodyHalf.trim()}`));

		it("then it should have the right image", () => expect(portfolio.image).to.deep.equal({
			url: "./image.png",
			alt: "Check out the image",
			title: "A sweet title"
		}));
	});
});
