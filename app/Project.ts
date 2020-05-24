import Image from "./Image";

export default interface Project {
	location: string;
	bodyCopy?: string;
	logo?: string | Image;
	examples?: (string | Image)[]
}
