import Portfolio from "./Portfolio";
import ISupplyProjectText from "./supply/ISupplyProjectText";
import IProcessProjectText from "./processing/IProcessProjectText";
import Project from "./Project";

export default class {
	constructor(
		private readonly projectSupplier: ISupplyProjectText,
		private readonly projectTextProcessor: IProcessProjectText) {}

	async promisePortfolios(repositories: (string | Project)[]): Promise<Portfolio[]> {
		const projects = await this.projectSupplier.promiseProjectTexts(
			repositories
				.filter(r => r instanceof String)
				.map(r => r as string));
		return projects.map(this.projectTextProcessor.processProjectText);
	}
}
