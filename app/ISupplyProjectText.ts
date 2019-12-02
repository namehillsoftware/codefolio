import Project from "./Project";

export default interface ISupplyProjectText {
    promiseProjectText(): Promise<string[]>;
}
