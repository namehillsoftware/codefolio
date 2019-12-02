import Portfolio from "./Portfolio";
import ISupplyProjectText from "./ISupplyProjectText";
import IProcessProjectText from "./processing/IProcessProjectText";

export default class {
	constructor(private readonly projectSupplier: ISupplyProjectText, private readonly projectTextProcessor: IProcessProjectText) {}

	async promisePortfolios(): Promise<Portfolio[]> {
		const projects = await this.projectSupplier.promiseProjectText();
		return projects.map(this.projectTextProcessor.processProjectText);
	}
}
