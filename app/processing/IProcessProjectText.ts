import Portfolio from "../Portfolio";

export default interface IProcessProjectText {
    processProjectText(text: string): Portfolio;
}