import Portfolio from "./Portfolio";
import PortfolioCreator from "./PortfolioCreator";
import ReadmeFileTextFeed from "./supply/ReadmeFileTextFeed";
import DirectoryReader from "./resources/DirectoryReader";
import FileReader from "./resources/FileReader";
import ProjectTextProcessor from "./processing/ProjectTextProcessor";
import Project from "./Project";

const portfolioCreator = new PortfolioCreator(
	new ReadmeFileTextFeed(new DirectoryReader(), new FileReader()),
	new ProjectTextProcessor());

export function promisePortfolios(projects: (string | Project)[]): Promise<Portfolio[]> {
	return portfolioCreator.promisePortfolios(projects);
}
