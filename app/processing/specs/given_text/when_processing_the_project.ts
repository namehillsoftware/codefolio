import ProjectTextProcessor from "../../ProjectTextProcessor";

require('chai').should();

describe("given text", () => {
    describe("when processing the project", () => {
        const heading = `    My *Fake* Project`

        const body =
`Here's the **body** copy

- Here's a bulleted list
- With another bullet item

## And here's a subsection

### Another

#### 4
##### 5
###### 6

And some more text, *la-di-da-di-da*`

        const projectTestProcessor = new ProjectTextProcessor();
        const projectTask = projectTestProcessor.promiseProjectText(
`
## A sub-heading first, what?

# ${heading}


${body}


# Contributing`);

        it("should have the right headline", async () => {
            const project = await projectTask;

            project.headline.should.equal(heading);
        });

        it("should have the right body", async () => {
            const project = await projectTask;
            
            project.body.should.equal(body);
        });
    });
});