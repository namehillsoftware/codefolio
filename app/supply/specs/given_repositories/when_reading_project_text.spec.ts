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
					"MyBestProject/file_1.txt",
					"MyBestProject/other_stuff",
					"MyBestProject/Readme.md",
					"MyBestProject/AnotherFile.cs",
				]);
				case "AnotherProject\\Over\\Here": return Promise.resolve([
					"AnotherProject\\Over\\Here\\file_1.txt",
					"",
					"AnotherProject\\Over\\Here\\Readme.markDOWN",
					"AnotherProject\\Over\\Here\\other_stuff",
					"AnotherProject\\Over\\Here\\AnotherFile.cs",
					"AnotherProject\\Over\\Here\\SomeOtherStuff.js",
				]);
				case "": return Promise.resolve([
					"someStuff.txt",
					"a/nother/path/here.txt",
					"switch\\paths\\why\\not.jsmap",
					"rEADME"
				]);
				case "Project/Without/Readme": return Promise.resolve([
					"Project/Without/Readme/someStuff.txt",
					"Project/Without/Readme/a/nother/path/here.txt",
					"switch\\paths\\why\\not.jsmap",
					"AnotherProject\\Over\\Here\\other_stuff",
					"AnotherProject\\Over\\Here\\AnotherFile.cs",
					"AnotherProject\\Over\\Here\\SomeOtherStuff.js",
				]);
				default: return Promise.resolve([]);
				}
			}
		};

		const textReader: IReadFiles = {
			readFile: (file) => {
				switch(file) {
				case "MyBestProject/Readme.md": return Promise.resolve("The best text ever");
				case "AnotherProject\\Over\\Here\\Readme.markDOWN": return Promise.resolve("The other project also has wonderful text");
				case "rEADME": return Promise.resolve("This is a root readme file");
				default: return Promise.resolve("");
				}
			}
		};

		const projectReader = new ReadmeFileTextFeed(directoryReader, textReader);
		it("returns the project text", async () => expect(await projectReader.promiseProjectTexts(["MyBestProject", "AnotherProject\\Over\\Here", "", "Project/Without/Readme"])).to.deep.equal([
			"The best text ever",
			"The other project also has wonderful text",
			"This is a root readme file"
		]));
	});
});
