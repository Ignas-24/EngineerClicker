import { ProjectManager } from "../ProjectManager.js";

describe("ProjectManager - calculateProjectWeight", () => {
    let projectManager;


    beforeEach(() => {
        projectManager = new ProjectManager(null);
    });

    it.each`
        expectedProgress | projectSize | expectedWeight
        ${6}             | ${5}        | ${0.5}
        ${5}             | ${6}        | ${0.5}
        ${47}            | ${47}       | ${1}
        ${0.1}           | ${0.144}    | ${1.0 / 3.0}
        ${100}           | ${1}        | ${0.038082897}
        ${1}             | ${100}      | ${0.038082897}
    `(
        "should correctly calculate project weight for expectedProgress = $expectedProgress and projectSize = $projectSize",
        ({ expectedProgress, projectSize, expectedWeight }) => {
            const result = projectManager.calculateProjectWeight(expectedProgress, projectSize);
            expect(result).toBeCloseTo(expectedWeight, 5);
        }
    );

    it("should throw an error when expectedProgress is zero", () => {
        expect(() => projectManager.calculateProjectWeight(0, 5)).toThrow("expectedProgress and projectSize must be positive values");
    });

    it("should throw an error when projectSize is zero", () => {
        expect(() => projectManager.calculateProjectWeight(5, 0)).toThrow("expectedProgress and projectSize must be positive values");
    });

    it("should throw an error when expectedProgress is negative", () => {
        expect(() => projectManager.calculateProjectWeight(-1, 10)).toThrow("expectedProgress and projectSize must be positive values");
    });

    it("should throw an error when projectSize is negative", () => {
        expect(() => projectManager.calculateProjectWeight(10, -1)).toThrow("expectedProgress and projectSize must be positive values");
    });
});