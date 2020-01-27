import ISupplyProjectText from "./ISupplyProjectText";
import IGetDirectoryFiles from "../resources/IGetDirectoryFiles";
import IReadFiles from "../resources/IReadFiles";

const splitRegex = new RegExp(/[\\/]/, "g");

export default class ReadmeFileTextFeed implements ISupplyProjectText {
	constructor(private readonly directoryFiles: IGetDirectoryFiles, private readonly fileText: IReadFiles) {}

	async promiseProjectTexts(repositories: string[]): Promise<string[]> {
		const projectTexts = await Promise.all(repositories.map(r => this.eventuallyGetReadmeText(r)));
		return projectTexts.filter(t => t !== null);
	}

	private async eventuallyGetReadmeText(repository: string): Promise<string> {
		const files = await this.directoryFiles.promiseDirectoryFiles(repository);
		const readMeFile = files.find(f => {
			const segments = f.split(splitRegex);
			const lastSegment = segments[segments.length - 1].toLowerCase();
			return lastSegment === "readme.md"
				|| lastSegment === "readme.markdown"
				|| lastSegment === "readme";
		});
		return readMeFile
			? this.fileText.readFile(readMeFile)
			: null;
	}
}
