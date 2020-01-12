import fs from "fs";
import IGetDirectoryFiles from "./IGetDirectoryFiles";
import { promisify } from "util";

const promisedDirs = promisify(fs.readdir);

export default class DirectoryReader implements IGetDirectoryFiles {
	promiseDirectoryFiles(directory: string): Promise<string[]> {
		return promisedDirs(directory);
	}
}
