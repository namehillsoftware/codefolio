import ISupplyProjectText from "./ISupplyProjectText";
import IGetDirectoryFiles from "../resources/IGetDirectoryFiles";

export default class ReadmeFileTextFeed implements ISupplyProjectText {
	constructor(private readonly directoryFiles: IGetDirectoryFiles) {}

	promiseProjectTexts(): Promise<string[]> {
		return Promise.resolve([
			"File 1 text",
			"File 2 text"
		]);
	}
}
