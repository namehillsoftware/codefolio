import { suite, test, slow, timeout } from "mocha-typescript";
import ISupplyProjects from "../../ISupplyProjects";
import Project from "../../Project";

describe('Given a set of projects', () => {
    const projects: Project[] = [{
        location: "../test-repos/happy-repo"
    }, {
        location: "../test-repos/happier-repo"
    }];

    const projectSupplier : ISupplyProjects = {
        promiseProjects: () => Promise.resolve(projects)
    };

    describe('When creating portfolios', () => {
        it('returns an array of portfolios', () => )
    })
});