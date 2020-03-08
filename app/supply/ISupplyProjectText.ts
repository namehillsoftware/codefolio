export default interface ISupplyProjectText {
    promiseProjectText(repository: string): Promise<string>;
}
