import ProjectTextProcessor from "../../../ProjectTextProcessor";
import { expect } from "chai";

describe("given text", () => {
	describe("with_an_immediate_level_one_heading", () => {
		describe("when processing the project", () => {
			const heading = "    My *Fake* Project";

			const nextHeading = "Another heading!!";

			const body =
`
- A list begins right away

Here's the **body** copy

- Here's a bulleted list
- With another bullet item

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

# ${nextHeading}

${body}


# Contributing

# And another headline

Here's some more text, hey hey!`);

			it("then it should have the right headline", () => expect(portfolio.headline.trim()).to.equal(heading.trim()));

			it("then it should not have a summary", () => expect(portfolio.summary).to.be.null);

			it("then it should not have a body", () => expect(portfolio.body.trim()).to.be.equal(""));
		});
	});
});
