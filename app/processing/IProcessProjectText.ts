import Portfolio from "../Portfolio";

export default interface IProcessProjectText {
    promiseProjectText(text: string): Promise<Portfolio>;
}