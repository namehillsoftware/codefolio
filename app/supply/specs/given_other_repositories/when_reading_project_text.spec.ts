import { expect } from "chai";
import ReadmeFileTextFeed from "../../ReadmeFileTextFeed";
import IGetDirectoryFiles from "../../../resources/IGetDirectoryFiles";
import IReadFiles from "../../../resources/IReadFiles";

describe("Given repositories", () => {
	describe("When reading project text", () => {
		const directoryReader: IGetDirectoryFiles = {
			promiseDirectoryFiles: (directory: string) => {
				switch(directory) {
				case "MyBestProject": return Promise.resolve([
					"MyBestProject\\file_1.txt",
					"MyBestProject\\other_stuff",
					"MyBestProject\\Readme.md",
					"MyBestProject\\AnotherFile.cs",
				]);
				case "AnotherProject\\Over\\Here": return Promise.resolve([
					"AnotherProject\\Over\\Here\\file_1.txt",
					"AnotherProject\\Over\\Here\\Readme.md",
					"AnotherProject\\Over\\Here\\other_stuff",
					"AnotherProject\\Over\\Here\\AnotherFile.cs",
					"AnotherProject\\Over\\Here\\SomeOtherStuff.js",
				]);
				default: return Promise.resolve([]);
				}
			}
		};

		const textReader: IReadFiles = {
			readFile: () => {
				return Promise.resolve("The best text ever");
			}
		};

		const projectReader = new ReadmeFileTextFeed(directoryReader, textReader);
		it("returns the project text", async () => expect(await projectReader.promiseProjectTexts([])).to.deep.equal([
			"The best text ever",
			"The other project also has wonderful text"
		]));
	});
});
