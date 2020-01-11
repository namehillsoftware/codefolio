export default interface IReadFiles {
	readFile(file: string): Promise<string>
}
