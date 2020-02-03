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
		const unconventionalProjects = repositories
			.filter(r => !(r instanceof String) && r)
			.map(r => r as Project);

		const promisedPortfolios = repositories
			.filter(r => r instanceof String)
			.map(r => r as string)
			.map(async l => {
				const text = await this.projectSupplier.promiseProjectText(l);
				return this.projectTextProcessor.processProjectText(text);
			})
			.concat(unconventionalProjects.map(async p => {
				const location = p.bodyCopy
					? path.join(p.location, p.bodyCopy)
					: p.location;
				const text = await this.projectSupplier.promiseProjectText(location);
				const portfolio = this.projectTextProcessor.processProjectText(text);

				if (p.logo instanceof String) {
					portfolio.image = {
						url: path.join(p.location, p.logo as string)
					};
				}

				return portfolio;
			}));

		return await Promise.all(promisedPortfolios);
	}
}
