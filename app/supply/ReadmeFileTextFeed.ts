import ISupplyProjectText from "./ISupplyProjectText";
import IGetDirectoryFiles from "../resources/IGetDirectoryFiles";
import IReadFiles from "../resources/IReadFiles";

export default class ReadmeFileTextFeed implements ISupplyProjectText {
	constructor(private readonly directoryFiles: IGetDirectoryFiles, private readonly fileText: IReadFiles) {}

	async promiseProjectTexts(repositories: string[]): Promise<string[]> {
		const projectTexts = await Promise.all(repositories.map(r => this.eventuallyGetReadmeText(r)));
		return projectTexts;
	}

	private async eventuallyGetReadmeText(repository: string): Promise<string> {
		const files = await this.directoryFiles.promiseDirectoryFiles(repository);
		const readMeFile = files.find(f => {
			const segments = f.split("\\");
			const lastSegment = segments[segments.length - 1];
			return lastSegment.toLowerCase() == "readme.md";
		});
		return this.fileText.readFile(readMeFile);
	}
}
