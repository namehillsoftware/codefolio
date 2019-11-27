import ProjectTextProcessor from "../../ProjectTextProcessor";

require('chai').should();

describe("given text", () => {
    describe("when processing the project", () => {
        const heading = `    My _Fake_ Project`

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
        const projectTask = projectTestProcessor.promiseProjectText(
`
## A sub-heading first, what?

Some more random **text**.

# ${heading}


${body}


# Contributing

# And another headline 

Here's some more text, hey hey!`);

        it("should have the right headline", async () => {
            const project = await projectTask;

            project.headline.trim().should.equal(heading.trim());
        });

        it("should have the right body", async () => {
            const project = await projectTask;
            
            project.body.trim().should.equal(body.trim());
        });
    });
});