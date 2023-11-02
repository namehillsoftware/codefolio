import Image from "./Image.js";

export default interface Project {
	location: string;
	bodyCopy?: string;
	logo?: string | Image;
	examples?: (string | Image)[]
}
