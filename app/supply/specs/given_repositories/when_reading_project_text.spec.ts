import { expect } from "chai";
import ReadmeFileTextFeed from "../../ReadmeFileTextFeed.js";
import IGetDirectoryFiles from "../../../resources/IGetDirectoryFiles.js";
import IReadFiles from "../../../resources/IReadFiles.js";
import ICheckIfPathsAreDirectories from "../../../resources/ICheckIfPathsAreDirectories.js";

describe("Given repositories", () => {
	describe("When reading project text", () => {
		const directoryChecker: ICheckIfPathsAreDirectories = {
			promiseIsDirectory: (path: string) => {
				switch(path) {
					case "rockstar.md":
						return Promise.resolve(false);
					default:
						return Promise.resolve(true);
				}
			}
		};

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
					case "rockstar.md": return Promise.resolve("Brilliant text!");
					default: return Promise.resolve("");
				}
			}
		};

		const projects = [
			"MyBestProject",
			"AnotherProject\\Over\\Here",
			"",
			"Project/Without/Readme",
			"rockstar.md"
		];

		const projectReader = new ReadmeFileTextFeed(directoryChecker, directoryReader, textReader);
		const projectTexts = Promise.all(projects.map(p => projectReader.promiseProjectText(p)));
		it("returns the project text", async () => expect(await projectTexts).to.deep.equal([
			"The best text ever",
			"The other project also has wonderful text",
			"This is a root readme file",
			null,
			"Brilliant text!"
		]));
	});
});
