import ProjectTextProcessor from "../../ProjectTextProcessor";

require('chai').should();

describe("given text", () => {
    describe("when processing the project", () => {
        const projectTestProcessor = new ProjectTextProcessor();
        const projectTask = projectTestProcessor.promiseProjectText(
            "#    My Fake Project" +
            "\n" +
            "\n" +
            "Here's the body copy" +
            "\n");

        it("should have the right headline", async () => {
            const project = await projectTask;

            project.headline.should.equal("My Fake Project");
        });

        it("should have the right body", async () => {
            const project = await projectTask;
            
            project.body.should.equal("Here's the body copy");
        });
    });
});