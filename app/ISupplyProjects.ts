import Project from "./Project";

export default interface ISupplyProjects {
    promiseProjects(): Promise<Project[]>;
}
