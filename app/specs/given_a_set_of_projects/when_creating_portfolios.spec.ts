import ISupplyProjectText from "../../supply/ISupplyProjectText";
import PortfolioCreator from "../../PortfolioCreator";
import { expect } from "chai";
import ProjectTextProcessor from "../../processing/ProjectTextProcessor";
import path from "path";

describe("Given a set of projects", () => {
	const specialProjectLocation = path.join("AVery", "Special", "Project");
	const logoProject = path.join("MyLogo", "Project");
	const labelledLogoProject = path.join("Labelled", "Logos");
	const labelledLogoLocation = path.join("resources", "jpg.jpg");

	const projects = [
		"",
		{
			location: specialProjectLocation,
			bodyCopy: "Description.markdown"
		},
		{
			location: logoProject,
			logo: "logo.png",
			examples: [
				"example.png",
				{
					url: "working.gif",
					alt: "It works!",
					title: "Animated Working GIF"
				}
			]
		},
		{
			location:  labelledLogoProject,
			logo: {
				url: labelledLogoLocation,
				alt: "Alternate",
				title: "Titillating"
			}
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
			case labelledLogoProject:
				return Promise.resolve(`# The Labelled Logos!!

Here's some wild text my friend

What a great project this is, with the labelled logos and everything.

![Some stuff](this-is-a-great-logo.png)`);
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
			image: { alt: "Happy", title: null, url: "happy.png" },
			examples: []
		}, {
			headline: "A Very Special Project!",
			summary: "This repo is even happier than the one above!",
			body: "\n",
			image: { alt: "Happier", title: null, url: "happier.png" },
			examples: []
		}, {
			headline: "This Project Has Its Own Logo",
			summary: "This repo is very unique",
			body: "\n",
			image: { url: "MyLogo/Project/logo.png" },
			examples: [{
				url: "MyLogo/Project/example.png"
			}, {
				url: "MyLogo/Project/working.gif",
				alt: "It works!",
				title: "Animated Working GIF"
			}]
		}, {
			headline: "The Labelled Logos!!",
			summary: "Here's some wild text my friend",
			body: "What a great project this is, with the labelled logos and everything.\n",
			image: {
				url: path.join(labelledLogoProject, labelledLogoLocation),
				alt: "Alternate",
				title: "Titillating"
			},
			examples: []
		}]));
	});
});
