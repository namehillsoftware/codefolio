import Portfolio from "../Portfolio.js";

export default interface IProcessProjectText {
    processProjectText(text: string): Portfolio;
}
