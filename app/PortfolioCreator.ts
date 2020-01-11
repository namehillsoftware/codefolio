import Portfolio from "./Portfolio";
import ISupplyProjectText from "./supply/ISupplyProjectText";
import IProcessProjectText from "./processing/IProcessProjectText";

export default class {
	constructor(
		private readonly projectSupplier: ISupplyProjectText,
		private readonly projectTextProcessor: IProcessProjectText) {}

	async promisePortfolios(repositories: string[]): Promise<Portfolio[]> {
		const projects = await this.projectSupplier.promiseProjectTexts(repositories);
		return projects.map(this.projectTextProcessor.processProjectText);
	}
}
