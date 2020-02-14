import Portfolio from "./Portfolio";
import ISupplyProjectText from "./supply/ISupplyProjectText";
import IProcessProjectText from "./processing/IProcessProjectText";
import Project from "./Project";
import path from "path";
import Image from "./Image";

function isString(str: any): boolean {
	return typeof(str) === "string" || str instanceof String;
}

export default class {
	constructor(
		private readonly projectSupplier: ISupplyProjectText,
		private readonly projectTextProcessor: IProcessProjectText) {}

	async promisePortfolios(repositories: (string | Project)[]): Promise<Portfolio[]> {
		const unconventionalProjects = repositories
			.filter(r => r && !isString(r))
			.map(r => r as Project);

		const promisedPortfolios = repositories
			.filter(r => isString(r))
			.map(r => r as string)
			.map(async l => {
				const text = await this.projectSupplier.promiseProjectText(l);
				return this.projectTextProcessor.processProjectText(text);
			})
			.concat(unconventionalProjects.map(p => this.handleUnconventionalProject(p)));

		return await Promise.all(promisedPortfolios);
	}

	private async handleUnconventionalProject(project: Project): Promise<Portfolio> {
		const location = project.bodyCopy
			? path.join(project.location, project.bodyCopy)
			: project.location;
		const text = await this.projectSupplier.promiseProjectText(location);
		const portfolio = this.projectTextProcessor.processProjectText(text);

		if (isString(project.logo)) {
			portfolio.image = {
				url: path.join(project.location, project.logo as string)
			};
		}

		const logo = project.logo as Image;
		if (logo.url) {
			portfolio.image = {
				url: path.join(project.location, logo.url),
				alt: logo.alt,
				title: logo.title
			};
		}

		return portfolio;
	}
}
