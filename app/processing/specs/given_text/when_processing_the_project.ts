import ProjectTextProcessor from "../../ProjectTextProcessor";
import 'chai/register-should';

describe("given text", () => {
    describe("when processing the project", () => {
        const heading = `    My _Fake_ Project`

        const summary = `Some **great** stuff here`;

        const body =
`Here's the **body** copy

- Here's a bulleted list
- With another bullet item

## And here's a subsection

### Another

#### 4

##### 5

###### 6

And some more text, _la-di-da-di-da_`

        const projectTestProcessor = new ProjectTextProcessor();
        const portfolio = projectTestProcessor.processProjectText(
`
## A sub-heading first, what?

Some more random **text**.

# ${heading}

## ${summary}


${body}


# Contributing

# And another headline 

Here's some more text, hey hey!`);

        it("should have the right headline", () => portfolio.headline.trim().should.equal(heading.trim()));
        
        it("should have the right summary", () => portfolio.summary.trim().should.equal(summary.trim()));

        it("should have the right body", () => portfolio.body.trim().should.equal(body.trim()));
    });
});