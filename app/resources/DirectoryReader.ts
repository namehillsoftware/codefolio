import { promises as fs } from "fs";
import IGetDirectoryFiles from "./IGetDirectoryFiles";
import ICheckIfPathsAreDirectories from "./ICheckIfPathsAreDirectories";

export default class DirectoryReader implements IGetDirectoryFiles, ICheckIfPathsAreDirectories {
	async promiseIsDirectory(path: string): Promise<boolean> {
		const statistics = await fs.lstat(path);
		return statistics.isDirectory();
	}

	promiseDirectoryFiles(directory: string): Promise<string[]> {
		return fs.readdir(directory);
	}
}
