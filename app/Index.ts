import Portfolio from "./Portfolio.js";
import PortfolioCreator from "./PortfolioCreator.js";
import ReadmeFileTextFeed from "./supply/ReadmeFileTextFeed.js";
import DirectoryReader from "./resources/DirectoryReader.js";
import FileReader from "./resources/FileReader.js";
import ProjectTextProcessor from "./processing/ProjectTextProcessor.js";
import Project from "./Project.js";

const directoryReader = new DirectoryReader();

const portfolioCreator = new PortfolioCreator(
	new ReadmeFileTextFeed(directoryReader, directoryReader, new FileReader()),
	new ProjectTextProcessor());

export function promisePortfolios(projects: (string | Project)[]): Promise<Portfolio[]> {
	return portfolioCreator.promisePortfolios(projects);
}
