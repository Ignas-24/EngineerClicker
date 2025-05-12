import { Upgrades } from "../Upgrades.js";

describe("Upgrades", () => {
  let upgrades;
  let mockGame;
  let mockResourceManager;
  let mockCompanyManager;

  beforeEach(() => {
    mockResourceManager = {
      euro: 1000,
      prestige: 5,
      addClickPower: vi.fn(),
      changeEuros: vi.fn(),
      setMultiplier: vi.fn(),
      changePrestige: vi.fn(),
    };

    mockCompanyManager = {
      currentCompany: {
        type: "small",
        upkeep: 100,
      },
    };

    mockGame = {
      notifyUpdate: vi.fn(),
      resourceManager: mockResourceManager,
      companyManager: mockCompanyManager,
    };

    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };

    upgrades = new Upgrades(mockGame);
  });

  describe("Initialization", () => {
    it("should initialize with default values", () => {
      expect(upgrades.powerUpgrades).toEqual([false, false, false, false]);
      expect(upgrades.multUpgrades).toEqual([false, false, false]);
      expect(upgrades.companyUpgrades).toEqual({
        reward: false,
        size: false,
        speed: false,
        biggerProjects: false,
        reward2: false,
        size2: false,
        speed2: false,
        biggerProjects2: false,
        reward3: false,
        size3: false,
        speed3: false,
        biggerProjects3: false,
      });
    });
  });

  describe("powerUpgrade", () => {
    it.each`
      upgradeIndex | expectedCost | expectedPowerIncrease | expectedUpgradeIndex
      ${1}         | ${0.5}       | ${0.01}               | ${0}
      ${2}         | ${1}         | ${0.01}               | ${1}
      ${3}         | ${5}         | ${0.02}               | ${2}
      ${4}         | ${20}        | ${0.05}               | ${3}
    `(
      "should successfully apply power upgrade $upgradeIndex",
      ({
        upgradeIndex,
        expectedCost,
        expectedPowerIncrease,
        expectedUpgradeIndex,
      }) => {
        const result = upgrades.powerUpgrade(upgradeIndex);
        expect(result).toBe(true);
        expect(mockResourceManager.changeEuros).toHaveBeenCalledWith(
          -expectedCost,
        );
        expect(mockResourceManager.addClickPower).toHaveBeenCalledWith(
          expectedPowerIncrease,
        );
        expect(upgrades.powerUpgrades[expectedUpgradeIndex]).toBe(true);
        expect(mockGame.notifyUpdate).toHaveBeenCalled();
      },
    );

    it("should fail if upgrade already purchased", () => {
      upgrades.powerUpgrades[0] = true;
      const result = upgrades.powerUpgrade(1);
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });

    it("should fail if insufficient funds", () => {
      mockResourceManager.euro = 0;
      const result = upgrades.powerUpgrade(1);
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });

    it("should fail for invalid upgrade index", () => {
      const result = upgrades.powerUpgrade(5);
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });
  });

  describe("multUpgrade", () => {
    it.each`
      upgradeIndex | expectedMultiplier | expectedUpgradeIndex | prereqIndex
      ${1}         | ${2}               | ${0}                 | ${null}
      ${2}         | ${3}               | ${1}                 | ${0}
      ${3}         | ${4}               | ${2}                 | ${1}
    `(
      "should successfully apply multiplier upgrade $upgradeIndex",
      ({
        upgradeIndex,
        expectedMultiplier,
        expectedUpgradeIndex,
        prereqIndex,
      }) => {
        if (prereqIndex !== null) {
          upgrades.multUpgrades[prereqIndex] = true;
        }

        const result = upgrades.multUpgrade(upgradeIndex);
        expect(result).toBe(true);
        expect(mockResourceManager.setMultiplier).toHaveBeenCalledWith(
          expectedMultiplier,
        );
        expect(mockResourceManager.changePrestige).toHaveBeenCalledWith(-1);
        expect(upgrades.multUpgrades[expectedUpgradeIndex]).toBe(true);
      },
    );

    it("should fail if upgrade already purchased", () => {
      upgrades.multUpgrades[0] = true;
      const result = upgrades.multUpgrade(1);
      expect(result).toBe(false);
      expect(mockResourceManager.setMultiplier).not.toHaveBeenCalled();
    });

    it("should fail if prerequisites not met", () => {
      const result = upgrades.multUpgrade(2);
      expect(result).toBe(false);
      expect(mockResourceManager.setMultiplier).not.toHaveBeenCalled();
    });

    it("should fail if insufficient prestige", () => {
      mockResourceManager.prestige = 0;
      const result = upgrades.multUpgrade(1);
      expect(result).toBe(false);
      expect(mockResourceManager.setMultiplier).not.toHaveBeenCalled();
    });
  });

  describe("buyCompanyUpgrade", () => {
    it("should successfully purchase small company upgrade", () => {
      const result = upgrades.buyCompanyUpgrade("reward");
      expect(result).toBe(true);
      expect(mockResourceManager.changeEuros).toHaveBeenCalledWith(-1000);
      expect(mockCompanyManager.currentCompany.upkeep).toBe(200); // 100 base + 100 increase
      expect(upgrades.companyUpgrades.reward).toBe(true);
      expect(mockGame.notifyUpdate).toHaveBeenCalled();
    });

    it("should fail if upgrade already purchased", () => {
      upgrades.companyUpgrades.reward = true;
      const result = upgrades.buyCompanyUpgrade("reward");
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });

    it("should fail if no current company", () => {
      mockGame.companyManager.currentCompany = null;
      const result = upgrades.buyCompanyUpgrade("reward");
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });

    it("should fail if insufficient funds", () => {
      mockResourceManager.euro = 0;
      const result = upgrades.buyCompanyUpgrade("reward");
      expect(result).toBe(false);
      expect(mockResourceManager.changeEuros).not.toHaveBeenCalled();
    });

    it("should handle different company types", () => {
      mockResourceManager.euro = 10000;
      mockCompanyManager.currentCompany.type = "medium";
      const result = upgrades.buyCompanyUpgrade("speed2");
      expect(result).toBe(true);
      expect(mockResourceManager.changeEuros).toHaveBeenCalledWith(-10000);
      expect(mockCompanyManager.currentCompany.upkeep).toBe(350);
    });
  });

  describe("reset methods", () => {
    it("resetCompanyUpgrades should reset all company upgrades", () => {
      upgrades.companyUpgrades.reward = true;
      upgrades.companyUpgrades.speed3 = true;
      upgrades.resetCompanyUpgrades();
      expect(upgrades.companyUpgrades.reward).toBe(false);
      expect(upgrades.companyUpgrades.speed3).toBe(false);
    });

    it("resetPowerUpgrades should reset all power upgrades", () => {
      upgrades.powerUpgrades = [true, true, false, false];
      upgrades.resetPowerUpgrades();
      expect(upgrades.powerUpgrades).toEqual([false, false, false, false]);
    });

    it("resetForBankruptcy should reset power upgrades", () => {
      upgrades.powerUpgrades = [true, true, false, false];
      upgrades.resetForBankruptcy();
      expect(upgrades.powerUpgrades).toEqual([false, false, false, false]);
    });
  });

  describe("save/load data", () => {
    it("should correctly save and load data", () => {
      const mockData = {
        powerUpgrades: [true, false, false, false],
        multUpgrades: [false, true, false],
        companyUpgrades: {
          reward: false,
          size: false,
          speed: true,
          biggerProjects: false,
          reward2: false,
          size2: false,
          speed2: false,
          biggerProjects2: false,
          reward3: false,
          size3: false,
          speed3: false,
          biggerProjects3: false,
        },
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      upgrades.loadData();

      expect(upgrades.multUpgrades[1]).toBe(true);
      expect(upgrades.powerUpgrades[0]).toBe(true);
      expect(upgrades.companyUpgrades.speed).toBe(true);
    });
  });
});
