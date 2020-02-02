export default class Project {
	constructor(
		public readonly location: string,
		public readonly bodyCopy: string = null,
		public readonly logo: string = null) {}
}
