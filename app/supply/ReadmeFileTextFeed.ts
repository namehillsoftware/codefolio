import ISupplyProjectText from "./ISupplyProjectText";
import IGetDirectoryFiles from "../resources/IGetDirectoryFiles";
import IReadFiles from "../resources/IReadFiles";
import ICheckIfPathsAreDirectories from "../resources/ICheckIfPathsAreDirectories";

const splitRegex = new RegExp(/[\\/]/, "g");

export default class ReadmeFileTextFeed implements ISupplyProjectText {
	constructor(
		private readonly checkDirectories: ICheckIfPathsAreDirectories,
		private readonly directoryFiles: IGetDirectoryFiles,
		private readonly fileText: IReadFiles) {}

	async promiseProjectText(path: string): Promise<string> {
		if (!await this.checkDirectories.promiseIsDirectory(path)) {
			return await this.readFileIfNotNull(path);
		}

		const files = await this.directoryFiles.promiseDirectoryFiles(path);
		const readMeFile = files.find(f => {
			const segments = f.split(splitRegex);
			const lastSegment = segments[segments.length - 1].toLowerCase();
			return lastSegment === "readme.md"
				|| lastSegment === "readme.markdown"
				|| lastSegment === "readme";
		});
		return this.readFileIfNotNull(readMeFile);
	}

	private async readFileIfNotNull(filePath: string): Promise<string> {
		return filePath
			? this.fileText.readFile(filePath)
			: null;
	}
}
