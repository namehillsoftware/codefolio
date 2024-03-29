import Portfolio from "./Portfolio.js";
import ISupplyProjectText from "./supply/ISupplyProjectText.js";
import IProcessProjectText from "./processing/IProcessProjectText.js";
import Project from "./Project.js";
import path from "path";
import Image from "./Image.js";

function isString(str: any): boolean {
	return typeof(str) === "string" || str instanceof String;
}

function parseImage(rootDir: string, inputImage?: string | Image): Image {
	if (isString(inputImage)) {
		return {
			url: path.join(rootDir, inputImage as string)
		};
	}

	const image = inputImage as Image;
	if (image && image.url) {
		return {
			url: path.join(rootDir, image.url),
			alt: image.alt,
			title: image.title
		};
	}

	return null;
}

export default class {
	constructor(
		private readonly projectSupplier: ISupplyProjectText,
		private readonly projectTextProcessor: IProcessProjectText) {}

	promisePortfolios(repositories: (string | Project)[]): Promise<Portfolio[]> {
		const unconventionalProjects = repositories
			.filter(r => r && !isString(r))
			.map(r => r as Project);

		const promisedPortfolios = repositories
			.filter(r => isString(r))
			.map(r => r as string)
			.map(l => this.fetchAndParseProjectText(l))
			.concat(unconventionalProjects.map(p => this.handleUnconventionalProject(p)));

		return Promise.all(promisedPortfolios);
	}

	private async handleUnconventionalProject(project: Project): Promise<Portfolio> {
		const location = project.bodyCopy
			? path.join(project.location, project.bodyCopy)
			: project.location;

		const portfolio = await this.fetchAndParseProjectText(location);

		const parsedImage = parseImage(project.location, project.logo);
		if (parsedImage)
			portfolio.image = parsedImage;

		const examples = project.examples || [];
		portfolio.examples = examples
			.map(e => parseImage(project.location, e))
			.filter(e => e);

		return portfolio;
	}

	private async fetchAndParseProjectText(location: string): Promise<Portfolio> {
		const text = await this.projectSupplier.promiseProjectText(location);
		return this.projectTextProcessor.processProjectText(text);
	}
}
