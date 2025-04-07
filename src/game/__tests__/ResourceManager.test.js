import { ResourceManager } from "../ResourceManager.js";

describe("ResourceManager", () => {
    let resourceManager;
    let mockGame;

    beforeEach(() => {
        mockGame = {
            notifyUpdate: vi.fn(),
            loanManager: {
                checkNegativeBalance: vi.fn()
            }
        };

        global.localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
        };

        resourceManager = new ResourceManager(mockGame);
    });

    describe("Initialization", () => {
        it("should initialize with default values", () => {
            expect(resourceManager.euro).toBe(0);
            expect(resourceManager.prestige).toBe(0);
            expect(resourceManager.multiplier).toBe(1);
            expect(resourceManager.initClickPower).toBe(0.01);
            expect(resourceManager.clickPowerIncrease).toBe(0);
            expect(resourceManager.clickPower).toBe(0.01);
        });

        it("should load saved data if available", () => {
            const mockData = {
                euro: 100,
                prestige: 5,
                multiplier: 2,
                initClickPower: 0.01,
                clickPowerIncrease: 0.05,
                clickPower: 0.06
            };

            localStorage.getItem.mockReturnValue(JSON.stringify(mockData));

            resourceManager.loadData();

            expect(resourceManager.euro).toBe(100);
            expect(resourceManager.prestige).toBe(5);
            expect(resourceManager.multiplier).toBe(2);
            expect(resourceManager.initClickPower).toBe(0.01);
            expect(resourceManager.clickPowerIncrease).toBe(0.05);
            expect(resourceManager.clickPower).toBe(0.06);
        });
    });

    describe("addEurosClicked", () => {
        it.each`
      multiplier | clickPower | expected
      ${1}       | ${0.01}    | ${0.01}
      ${2}       | ${0.01}    | ${0.02}
      ${1}       | ${0.05}    | ${0.05}
      ${3}       | ${0.1}     | ${0.3}
    `("should add $expected euros when multiplier is $multiplier and clickPower is $clickPower",
            ({ multiplier, clickPower, expected }) => {
                resourceManager.multiplier = multiplier;
                resourceManager.clickPower = clickPower;
                resourceManager.addEurosClicked();
                expect(resourceManager.euro).toBeCloseTo(expected, 5);
                expect(mockGame.notifyUpdate).toHaveBeenCalled();
            });
    });

    describe("changeEuros", () => {
        it.each`
      initial | delta   | expected
      ${0}    | ${5}    | ${5}
      ${10}   | ${-3}   | ${7}
      ${100}  | ${50}   | ${150}
      ${20}   | ${-25}  | ${-5}
    `("should change euros from $initial to $expected when delta is $delta",
            ({ initial, delta, expected }) => {
                resourceManager.euro = initial;
                resourceManager.changeEuros(delta);
                expect(resourceManager.euro).toBe(expected);
                expect(mockGame.notifyUpdate).toHaveBeenCalled();
            });

        it("should check for negative balance when euros go below zero", () => {
            resourceManager.changeEuros(-10);
            expect(mockGame.loanManager.checkNegativeBalance).toHaveBeenCalled();
        });

        it("should not check for negative balance when euros remain positive", () => {
            resourceManager.changeEuros(10);
            expect(mockGame.loanManager.checkNegativeBalance).not.toHaveBeenCalled();
        });
    });

    describe("changePrestige", () => {
        it.each`
      initial | delta  | expected
      ${0}    | ${1}   | ${1}
      ${5}    | ${3}   | ${8}
      ${10}   | ${-2}  | ${8}
    `("should change prestige from $initial to $expected when delta is $delta",
            ({ initial, delta, expected }) => {
                resourceManager.prestige = initial;
                resourceManager.changePrestige(delta);
                expect(resourceManager.prestige).toBe(expected);
                expect(mockGame.notifyUpdate).toHaveBeenCalled();
            });
    });

    describe("setMultiplier", () => {
        it.each`
      multiplier
      ${2}
      ${3.5}
      ${10}
      ${0.5}
    `("should set multiplier to $multiplier", ({ multiplier }) => {
            resourceManager.setMultiplier(multiplier);
            expect(resourceManager.multiplier).toBe(multiplier);
            expect(mockGame.notifyUpdate).toHaveBeenCalled();
        });
    });

    describe("addClickPower", () => {
        it.each`
      initialIncrease | delta   | expectedIncrease | expectedClickPower
      ${0}           | ${0.01} | ${0.01}          | ${0.02}
      ${0.05}        | ${0.02} | ${0.07}          | ${0.08}
      ${0.1}         | ${-0.02}| ${0.08}          | ${0.09}
    `("should change click power correctly",
            ({ initialIncrease, delta, expectedIncrease, expectedClickPower }) => {
                resourceManager.clickPowerIncrease = initialIncrease;
                resourceManager.addClickPower(delta);
                expect(resourceManager.clickPowerIncrease).toBeCloseTo(expectedIncrease, 5);
                expect(resourceManager.clickPower).toBeCloseTo(expectedClickPower, 5);
                expect(mockGame.notifyUpdate).toHaveBeenCalled();
            });
    });

    describe("resetForBankruptcy", () => {
        it("should reset euro and click power values", () => {
            resourceManager.euro = 100;
            resourceManager.clickPowerIncrease = 0.05;
            resourceManager.clickPower = 0.06;

            resourceManager.resetForBankruptcy();

            expect(resourceManager.euro).toBe(0);
            expect(resourceManager.clickPowerIncrease).toBe(0);
            expect(resourceManager.clickPower).toBe(0.01);
            expect(resourceManager.clickPower).toBe(0.01);
        });
    });
});