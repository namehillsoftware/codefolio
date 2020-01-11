import ISupplyProjectText from "../../supply/ISupplyProjectText";
import PortfolioCreator from "../../PortfolioCreator";
import { expect } from "chai";
import ProjectTextProcessor from "../../processing/ProjectTextProcessor";

describe("Given a set of projects", () => {
	const projectSupplier : ISupplyProjectText = {
		promiseProjectTexts: () => Promise.resolve([
			`# A happy repo

This is a happy repo

In here, everyone is happier

![Happy](happy.png)`,
			`# A happier repo

This repo is even happier than the one above!

![Happier](happier.png)`
		])
	};

	const portfolioCreator = new PortfolioCreator(projectSupplier, new ProjectTextProcessor());

	describe("When creating portfolios", async () => {
		const promisedPortfolios = portfolioCreator.promisePortfolios([]);
		it("it returns an array of portfolios", async () => expect(await promisedPortfolios).to.deep.equal([{
			headline: "A happy repo",
			summary: "This is a happy repo",
			body: "In here, everyone is happier\n",
			image: { alt: "Happy", title: null, url: "happy.png" }
		}, {
			headline: "A happier repo",
			summary: "This repo is even happier than the one above!",
			body: "\n",
			image: { alt: "Happier", title: null, url: "happier.png" }
		}]));
	});
});
