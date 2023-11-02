import Image from "./Image.js";

export default interface Portfolio {
    body: string;
	image?: Image;
	examples: Image[];
}
