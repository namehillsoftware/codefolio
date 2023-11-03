import IReadFiles from "./IReadFiles.js";
import { promises as fs} from "fs";

export default class FileReader implements IReadFiles {
	readFile(file: string): Promise<string> {
		return fs.readFile(file, "utf8");
	}
}
