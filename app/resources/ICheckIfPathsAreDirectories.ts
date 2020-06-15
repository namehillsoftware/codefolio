export default interface ICheckIfPathsAreDirectories {
	promiseIsDirectory(path: string): Promise<boolean>;
}
