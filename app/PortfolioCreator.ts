import Portfolio from "./Portfolio";
import ISupplyProjectText from "./supply/ISupplyProjectText";
import IProcessProjectText from "./processing/IProcessProjectText";
import Project from "./Project";
import path from "path";

export default class {
	constructor(
		private readonly projectSupplier: ISupplyProjectText,
		private readonly projectTextProcessor: IProcessProjectText) {}

	async promisePortfolios(repositories: (string | Project)[]): Promise<Portfolio[]> {
		const projectLocations = repositories
			.filter(r => r instanceof String)
			.map(r => r as string)
			.concat(repositories
				.filter(r => r instanceof Project)
				.map(r => r as Project)
				.map(p => path.join(p.location, p.bodyCopy)));

		const projects = await this.projectSupplier.promiseProjectTexts(projectLocations);

		const portfolios = projects.map(p => this.projectTextProcessor.processProjectText(p));

		return portfolios;
	}
}
