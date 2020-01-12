import IReadFiles from "./IReadFiles";
import { promisify } from "util";
import fs from "fs";

const promiseReadFile = promisify(fs.readFile);

export default class FileReader implements IReadFiles {
	readFile(file: string): Promise<string> {
		return promiseReadFile(file, "utf8");
	}
}
