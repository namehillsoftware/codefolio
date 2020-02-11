import ISupplyProjectText from "../../supply/ISupplyProjectText";
import PortfolioCreator from "../../PortfolioCreator";
import { expect } from "chai";
import ProjectTextProcessor from "../../processing/ProjectTextProcessor";
import path from "path";

describe("Given a set of projects", () => {
	const specialProjectLocation = path.join("AVery", "Special", "Project");
	const logoProject = path.join("MyLogo", "Project");

	const projects = [
		"",
		{
			location: specialProjectLocation,
			bodyCopy: "Description.markdown"
		},
		{
			location: logoProject,
			image: "logo.png"
		}
	];

	const projectSupplier : ISupplyProjectText = {
		promiseProjectText: (location) => {
			switch (location) {
			case "":
				return Promise.resolve(`# A happy repo

This is a happy repo

In here, everyone is happier

![Happy](happy.png)`);
			case path.join(specialProjectLocation, "Description.markdown"):
				return Promise.resolve(`# A Very Special Project!

This repo is even happier than the one above!

![Happier](happier.png)`);
			case logoProject:
				return Promise.resolve(`# This Project Has Its Own Logo

This repo is very unique

![Happier](the-best-logo.png)`);
			}
		}
	};

	const portfolioCreator = new PortfolioCreator(projectSupplier, new ProjectTextProcessor());

	describe("When creating portfolios", async () => {
		const promisedPortfolios = portfolioCreator.promisePortfolios(projects);
		it("it returns an array of portfolios", async () => expect(await promisedPortfolios).to.deep.equal([{
			headline: "A happy repo",
			summary: "This is a happy repo",
			body: "In here, everyone is happier\n",
			image: { alt: "Happy", title: null, url: "happy.png" }
		}, {
			headline: "A Very Special Project!",
			summary: "This repo is even happier than the one above!",
			body: "\n",
			image: { alt: "Happier", title: null, url: "happier.png" }
		}, {
			headline: "This Project Has Its Own Logo",
			summary: "This repo is very unique",
			body: "\n",
			image: { alt: null, title: null, url: "logo.png" }
		}]));
	});
});
