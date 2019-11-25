import ProjectTextProcessor from "../../ProjectTextProcessor";

require('chai').should();

describe("given text", () => {
    describe("when processing the project", async () => {
        const projectTestProcessor = new ProjectTextProcessor();
        const project = await projectTestProcessor.promiseProjectText(
            "#    My Fake Project" +
            "\n" +
            "\n" +
            "Here's the body copy" +
            "\n");

        it("should have the right headline", () => project.headline.should.be("My Fake Project"));

        it("should have the right body", () => project.body.should.be("Here's the body copy"));
    });
});