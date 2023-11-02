import ProjectTextProcessor from "../../../ProjectTextProcessor.js";
import { expect } from "chai";

describe("given text", () => {
	describe("with_a_paragraph_summary", () => {
		describe("when processing the project", () => {
			const heading = "    My *Fake* Project";

			const summary = " Wow this library **is** fantastic!";

			const body =
`Here's the **body** copy

* Here's a bulleted list
* With another bullet item

## And here's a subsection

### Another

#### 4

##### 5

###### 6

And some more text, *la-di-da-dEndi-da*`;

			const projectTestProcessor = new ProjectTextProcessor();
			const portfolio = projectTestProcessor.processProjectText(
				`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

${summary}

${body}


# Contributing

# And another headline

Here's some more text, hey hey!`);

			it("then it should have the right body", () => expect(portfolio.body.trim()).to.equal(`# ${heading.trim()}

${summary.trim()}

${body.trim()}`));
		});
	});
});
