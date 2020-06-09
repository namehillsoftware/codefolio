import Image from "./Image";

export default interface Portfolio {
    headline: string;
    summary?: string;
    body: string;
	image?: Image;
	examples: Image[];
}
