import Portfolio from "./Portfolio";
import ISupplyProjects from "./ISupplyProjects";

export default class {
	constructor(private readonly projectSupplier: ISupplyProjects) {}

	async promisePortfolios(): Promise<Portfolio[]> {
		return [{
			headline: "something",
			body: "hi",
			image: { url: "img.jpg" }
		}];
	}
}
