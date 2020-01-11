export default interface IGetDirectoryFiles {
	promiseDirectoryFiles(directory: string): Promise<string[]>
}
