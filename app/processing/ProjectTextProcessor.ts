import IProcessProjectText from "./IProcessProjectText";

export default class ProjectTextProcessor implements IProcessProjectText {
    promiseProjectText(text: string): Promise<import("../Portfolio").default> {
        throw new Error("Method not implemented.");
    }
}