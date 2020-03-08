import ISupplyProjectText from "./ISupplyProjectText";
import IGetDirectoryFiles from "../resources/IGetDirectoryFiles";
import IReadFiles from "../resources/IReadFiles";

const splitRegex = new RegExp(/[\\/]/, "g");

export default class ReadmeFileTextFeed implements ISupplyProjectText {
	constructor(private readonly directoryFiles: IGetDirectoryFiles, private readonly fileText: IReadFiles) {}

	async promiseProjectText(repository: string): Promise<string> {
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
