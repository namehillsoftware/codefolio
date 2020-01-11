export default interface ISupplyProjectText {
    promiseProjectTexts(repositories: string[]): Promise<string[]>;
}
