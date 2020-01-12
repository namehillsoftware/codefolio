import { expect } from "chai";
import ReadmeFileTextFeed from "../../ReadmeFileTextFeed";
import IGetDirectoryFiles from "../../../resources/IGetDirectoryFiles";
import IReadFiles from "../../../resources/IReadFiles";

describe("Given repositories", () => {
	describe("When reading project text", () => {
		const directoryReader: IGetDirectoryFiles = {
			promiseDirectoryFiles: () => {
				return Promise.resolve([
					"file_1",
					"file_2"
				]);
			}
		};

		const textReader: IReadFiles = {
			readFile: () => {
				return Promise.resolve("File 1 text");
			}
		};

		const projectReader = new ReadmeFileTextFeed(directoryReader, textReader);
		it("returns the project text", async () => expect(await projectReader.promiseProjectTexts([])).to.deep.equal([
			"File 1 text",
			"File 2 text"
		]));
	});
});
