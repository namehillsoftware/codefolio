export default interface ISupplyProjectText {
    promiseProjectText(fileOrDirectory: string): Promise<string>;
}
