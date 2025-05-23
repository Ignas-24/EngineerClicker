import { describe, expect, spyOn, vi } from "vitest";
import { CompanyManager } from "../CompanyManager.js";

describe("CompanyManager", () => {
  let mockGame;
  let companyManager;
  let mockChangeEuros;
  let mockChangePrestige;

  beforeEach(() => {
    mockChangeEuros = vi.fn();
    mockGame = {
      resourceManager: {
        changeEuros: mockChangeEuros,
      },
      notifyUpdate: vi.fn(),
      upgrades: {
        companyUpgrades: {
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
        },
      },
      stats: {
        increment: vi.fn(),
      },
      achievementManager: {
        checkAchievements: vi.fn(),
      },
    };

    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };

    companyManager = new CompanyManager(mockGame);
    vi.useFakeTimers();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("startUpkeepTimer", () => {
    it("should deduct upkeep cost from euros every 5 minutes", () => {
      companyManager.currentCompany = { upkeep: 300 };
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };

      companyManager.startUpkeepTimer();

      // Fast-forward 5 minutes
      vi.advanceTimersByTime(5 * 60 * 1000);

      expect(mockChangeEuros).toHaveBeenCalledWith(-600);
    });

    it("should not deduct upkeep if there is no current company", () => {
      companyManager.currentCompany = null;

      companyManager.startUpkeepTimer();

      // Fast-forward 5 minutes
      vi.advanceTimersByTime(5 * 60 * 1000);

      expect(mockChangeEuros).not.toHaveBeenCalled();
    });

    it("should clear the previous interval if already running", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      companyManager.upkeepInterval = 123;

      companyManager.startUpkeepTimer();

      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });
  });

  describe("startProjectContributionTimer", () => {
    it("should call addProgressByDeveloper on active project every second", () => {
      const mockProject = {
        isActive: vi.fn(() => true),
        addProgressByDeveloper: vi.fn(),
      };
      companyManager.game.project = mockProject;

      companyManager.startProjectContributionTimer();

      vi.advanceTimersByTime(1000);

      expect(mockProject.addProgressByDeveloper).toHaveBeenCalled();
    });
    it("should not call addProgressByDeveloper if project is not active", () => {
      const mockProject = {
        isActive: vi.fn(() => false),
        addProgressByDeveloper: vi.fn(),
      };
      companyManager.game.project = mockProject;

      companyManager.startProjectContributionTimer();

      vi.advanceTimersByTime(1000);

      expect(mockProject.addProgressByDeveloper).not.toHaveBeenCalled();
    });
  });

  describe("calculateDeveloperUpkeep", () => {
    it("zero developers should have no upkeep", () => {
      companyManager.developers = {
        junior: 0,
        midlevel: 0,
        senior: 0,
        lead: 0,
      };
      const upkeep = companyManager.calculateDeveloperUpkeep();
      expect(upkeep).toBe(0);
    });

    it("developer upkeep should be calculated correctly when having devellopers", () => {
      companyManager.developers = {
        junior: 2,
        midlevel: 2,
        senior: 2,
        lead: 2,
      };
      const upkeep = companyManager.calculateDeveloperUpkeep();
      expect(upkeep).toBe(3600); // 100*2 + 2*200 + 500*2 + 1000*2
    });
  });

  describe("hireDeveloper", () => {
    it("should hire a developer if under max employees", () => {
      companyManager.currentCompany = { maxEmployees: 5 };
      companyManager.developers = {
        junior: 2,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };

      companyManager.game.resourceManager.euro = 1000;
      const result = companyManager.hireDeveloper("junior");

      expect(mockChangeEuros).toHaveBeenCalledWith(-500);
      expect(result).toBe(true);
      expect(companyManager.developers.junior).toBe(3);
    });

    it("should not hire a developer if over max employees", () => {
      companyManager.currentCompany = { maxEmployees: 2 };
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };

      const result = companyManager.hireDeveloper("junior");

      expect(result).toBe(false);
      expect(companyManager.developers.junior).toBe(1);
    });
    it("should not hire a developer if incorrect employee type", () => {
      companyManager.currentCompany = { maxEmployees: 5 };
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };

      const result = companyManager.hireDeveloper("doesnotexist");

      expect(result).toBe(false);
      expect(companyManager.developers.junior).toBe(1);
    });
    it("should not hire a developer if not enough euros", () => {
      companyManager.currentCompany = { maxEmployees: 5 };
      companyManager.developers = {
        junior: 2,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };

      companyManager.game.resourceManager.euro = 100;
      const result = companyManager.hireDeveloper("junior");

      expect(mockChangeEuros).not.toHaveBeenCalled();
      expect(result).toBe(false);
      expect(companyManager.developers.junior).toBe(2);
    });
  });

  describe("calculateTotalEfficiency", () => {
    it("should calculate total efficiency without lead developer boost and without upgrades", () => {
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 1,
        lead: 0,
      };

      const efficiency = companyManager.calculateTotalEfficiency();
      expect(efficiency).toBe(0.1 + 0.3 + 0.7);
    });
    it("should calculate total efficiency with lead developer boost and without upgrades", () => {
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 1,
        lead: 1,
      };
      const efficiency = companyManager.calculateTotalEfficiency();
      expect(efficiency).toBe((0.1 + 0.3 + 0.7) * 1.1 + 1.5);
    });
    it("lead developers should not boost themselves, no upgrades", () => {
      companyManager.developers = {
        junior: 0,
        midlevel: 0,
        senior: 0,
        lead: 2,
      };
      const efficiency = companyManager.calculateTotalEfficiency();
      expect(efficiency).toBe(3);
    });
    it("should calculate total efficiency with lead developer boost and with one upgrades", () => {
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 1,
        lead: 1,
      };
      companyManager.game.upgrades.companyUpgrades.speed = true;
      const efficiency = companyManager.calculateTotalEfficiency();
      expect(efficiency).toBe(((0.1 + 0.3 + 0.7) * 1.1 + 1.5) * 1.2);
    });
    it("should apply the correct multiplier when all the upgrades are active", () => {
      companyManager.developers = {
        junior: 1,
        midlevel: 1,
        senior: 0,
        lead: 0,
      };
      companyManager.game.upgrades.companyUpgrades.speed = true;
      companyManager.game.upgrades.companyUpgrades.speed2 = true;
      companyManager.game.upgrades.companyUpgrades.speed3 = true;
      const efficiency = companyManager.calculateTotalEfficiency();
      const expectedEfficiency = (0.1 + 0.3) * 1.2 * 1.2 * 1.2;
      expect(efficiency).toBeCloseTo(expectedEfficiency, 4); //using toBeCloseTo because of floating point precision issues
    });
  });
  describe("stopUpkeepTimer", () => {
    it("should clear the upkeep interval when there is an active one", () => {
      companyManager.upkeepInterval = 123;

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      companyManager.stopUpkeepTimer();

      expect(global.clearInterval).toHaveBeenCalledWith(123);
      expect(companyManager.upkeepInterval).toBeNull();
    });
    it("should not change the upkeep interval if there is no active one", () => {
      companyManager.upkeepInterval = null;

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      companyManager.stopUpkeepTimer();

      expect(global.clearInterval).not.toHaveBeenCalled();
      expect(companyManager.upkeepInterval).toBeNull();
    });
  });
  describe("stopProjectContributionTimer", () => {
    it("should clear the project contribution interval when there is an active one", () => {
      companyManager.projectContributionInterval = 123;

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      companyManager.stopProjectContributionTimer();

      expect(global.clearInterval).toHaveBeenCalledWith(123);
      expect(companyManager.projectContributionInterval).toBeNull();
    });
    it("should not change the project contribution interval if there is no active one", () => {
      companyManager.projectContributionInterval = null;

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      companyManager.stopProjectContributionTimer();

      expect(global.clearInterval).not.toHaveBeenCalled();
      expect(companyManager.projectContributionInterval).toBeNull();
    });
  });

  describe("buyCompany", () => {
    it.each([
      {
        description: "should not buy a small company if not enough euros",
        euro: 1000,
        completedProjects: 0,
        currentCompany: null,
        companyType: "small",
        expectedResult: false,
        expectedCurrentCompany: null,
        shouldCallChangeEuros: false,
      },
      {
        description:
          "should not buy a medium company if the current one is not small",
        euro: 1000000,
        completedProjects: 0,
        currentCompany: null,
        companyType: "medium",
        expectedResult: false,
        expectedCurrentCompany: null,
        shouldCallChangeEuros: false,
      },
      {
        description:
          "should buy a small company if the amount of money is enough",
        euro: 1000000,
        completedProjects: 0,
        currentCompany: null,
        companyType: "small",
        expectedResult: true,
        expectedCurrentCompany: { type: "small" },
        shouldCallChangeEuros: true,
      },
      {
        description:
          "should buy a medium company if there are enough projects completed",
        euro: 1000000,
        completedProjects: 100,
        currentCompany: { type: "small" },
        companyType: "medium",
        expectedResult: true,
        expectedCurrentCompany: { type: "medium" },
        shouldCallChangeEuros: true,
      },
      {
        description:
          "should not buy a medium company if there are not enough projects completed",
        euro: 1000000,
        completedProjects: 0,
        currentCompany: { type: "small" },
        companyType: "medium",
        expectedResult: false,
        expectedCurrentCompany: { type: "small" },
        shouldCallChangeEuros: false,
      },
    ])(
      "$description",
      ({
        euro,
        completedProjects,
        currentCompany,
        companyType,
        expectedResult,
        expectedCurrentCompany,
        shouldCallChangeEuros,
      }) => {
        companyManager.game.resourceManager.euro = euro;
        companyManager.game.projectManager = {
          completedProjectsThisReset: completedProjects,
        };
        companyManager.currentCompany = currentCompany;

        const result = companyManager.buyCompany(companyType);

        expect(result).toBe(expectedResult);
        if (shouldCallChangeEuros) {
          expect(mockChangeEuros).toHaveBeenCalled();
        } else {
          expect(mockChangeEuros).not.toHaveBeenCalled();
        }
        if (expectedCurrentCompany == null) {
          expect(companyManager.currentCompany).toEqual(expectedCurrentCompany);
        } else {
          expect(companyManager.currentCompany.type).toEqual(
            expectedCurrentCompany.type,
          );
        }
      },
    );
  });
  describe("buyUpgrade", () => {
    it("should call the buyCompanyUpgrade function with the correct upgrade key", () => {
      const mockBuyCompanyUpgrade = vi.fn();
      companyManager.game.upgrades = {
        buyCompanyUpgrade: mockBuyCompanyUpgrade,
      };

      const upgradeKey = "speed";
      companyManager.buyUpgrade(upgradeKey);

      expect(mockBuyCompanyUpgrade).toHaveBeenCalledWith(upgradeKey);
    });
  });
  describe("sellCompany", () => {
    it("should sell the current company and return the correct ammount of prestige points", () => {
      companyManager.currentCompany = { type: "medium" };
      companyManager.game.projectManager = { completedProjectsThisReset: 100 };
      companyManager.developers = {
        junior: 2,
        midlevel: 2,
        senior: 2,
        lead: 2,
      };

      companyManager.game.upgrades = {
        resetCompanyUpgrades: vi.fn(),
        resetPowerUpgrades: vi.fn(),
      };
      companyManager.game.projectManager.selectProjects = vi.fn();
      companyManager.game.resourceManager = {
        euro: 100000,
        saveData: vi.fn(),
        changeEuros: mockChangeEuros,
        changePrestige: (mockChangePrestige = vi.fn()),
      };

      const result = companyManager.sellCompany();

      expect(mockChangePrestige).toHaveBeenCalledWith(2);
      expect(companyManager.currentCompany).toBeNull();
      expect(companyManager.game.resourceManager.euro).toBe(0);
      expect(result).toBe(true);
    });

    it("should not sell the company if there is no current company", () => {
      companyManager.currentCompany = null;
      const oldPresstige = companyManager.game.resourceManager.prestige;
      const oldEuros = companyManager.game.resourceManager.euro;
      const result = companyManager.sellCompany();

      expect(mockChangeEuros).not.toHaveBeenCalled();
      expect(oldPresstige).toBe(companyManager.game.resourceManager.prestige);
      expect(oldEuros).toBe(companyManager.game.resourceManager.euro);
      expect(result).toBe(false);
    });
  });
  describe("saveData", () => {
    it("should save the current company and developers to localStorage", () => {
      companyManager.currentCompany = { type: "medium" };
      companyManager.developers = {
        junior: 1,
        midlevel: 2,
        senior: 3,
        lead: 4,
      };

      companyManager.saveData();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "CompanyManagerData",
        JSON.stringify({
          currentCompany: companyManager.currentCompany,
          developers: companyManager.developers,
        }),
      );
    });
  });
  describe("loadData", () => {
    it("should load the company and developers from localStorage", () => {
      const mockData = {
        currentCompany: { type: "medium" },
        developers: { junior: 1, midlevel: 2, senior: 3, lead: 4 },
      };
      localStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      companyManager.loadData();

      expect(companyManager.currentCompany).toEqual(mockData.currentCompany);
      expect(companyManager.developers).toEqual(mockData.developers);
    });

    it("should initialize developers with default values", () => {
      const mockData = {};
      localStorage.getItem.mockReturnValue(JSON.stringify(mockData));

      companyManager.loadData();

      expect(companyManager.developers).toEqual({
        junior: 0,
        midlevel: 0,
        senior: 0,
        lead: 0,
      });
    });
  });
});
