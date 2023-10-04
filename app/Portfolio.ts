import Image from "./Image";

export default interface Portfolio {
    body: string;
	image?: Image;
	examples: Image[];
}
