import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { ProjectManager } from "../ProjectManager.js";

describe("ProjectManager", () => {
  let projectManager;
  let gameMock;

  beforeAll(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });

    gameMock = {
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
      resourceManager: {
        clickPower: 0.01,
        multiplier: 1,
      },
    };

    vi.mock("../Project.js", async () => {
      const originalModule = await vi.importActual("../Project.js");
      return {
        Project: class MockProject extends originalModule.Project {
          isActive = vi.fn();
          toggleActive = vi.fn();
          addProgress = vi.fn();
          addProgressByDeveloper = vi.fn();
          checkCompletion = vi.fn();
          startTimer = vi.fn();
          stopTimer = vi.fn();
          onTimerComplete = vi.fn();
          saveData = vi.fn();
          loadData = vi.fn();
          resetForBankruptcy = vi.fn();
        },
      };
    });
  });

  beforeEach(() => {
    projectManager = new ProjectManager(gameMock);
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("getRandomInt", () => {
    it("getRandomInt returns value within specified range", () => {
      const result = projectManager.getRandomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe("getRandomLetter", () => {
    it("getRandomLetter returns a single uppercase letter", () => {
      const result = projectManager.getRandomLetter();
      expect(result).toMatch(/^[A-Z]$/);
    });
  });

  describe("getRandomProjectName", () => {
    it("getRandomProjectName returns a formatted name", () => {
      const name = projectManager.getRandomProjectName();
      expect(name).toMatch(/^Project [A-Z]{3}\d+$/);
    });
  });

  describe("createProject", () => {
    it("should create a project with random properties within certain ranges", () => {
      const [sizeInterval, rewardInterval, deadlineInterval] = [
        [5, 12],
        [2, 8],
        [50, 100],
      ];
      const project = projectManager.createProject(
        sizeInterval,
        rewardInterval,
        deadlineInterval
      );

      expect(project).toBeDefined();
      expect(project.projectSize).toBeGreaterThanOrEqual(sizeInterval[0]);
      expect(project.projectSize).toBeLessThanOrEqual(sizeInterval[1]);
      expect(project.projectReward).toBeGreaterThanOrEqual(
        sizeInterval[0] * rewardInterval[0]
      );
      expect(project.projectReward).toBeLessThanOrEqual(
        sizeInterval[1] * rewardInterval[1]
      );
      expect(project.projectDeadline).toBeGreaterThanOrEqual(
        deadlineInterval[0]
      );
      expect(project.projectDeadline).toBeLessThanOrEqual(deadlineInterval[1]);
      expect(typeof project.projectName).toBe("string");
    });
  });

  describe("applySizeUpgrades", () => {
    it("applySizeUpgrades doubles size with one upgrade", () => {
      const result = projectManager.applySizeUpgrades([10, 20], {
        biggerProjects: true,
      });
      expect(result).toEqual([20, 40]);
    });
  });

  describe("applyRewardUpgrades", () => {
    it("applyRewardUpgrades increases reward by 10%", () => {
      const result = projectManager.applyRewardUpgrades([10, 20], {
        reward: true,
      });
      expect(result).toEqual([11, 22]);
    });
  });

  describe("applySizeReduction", () => {
    it("applySizeReduction decreases size with upgrades", () => {
      const reduced = projectManager.applySizeReduction(100, { size: true });
      expect(reduced).toBeLessThan(100);
    });
  });

  describe("generateProjectPool", () => {
    it("generateProjectPool returns small, medium, large arrays", () => {
      const pool = projectManager.generateProjectPool();
      expect(Object.keys(pool)).toEqual(["small", "medium", "large"]);
      expect(pool.small).toHaveLength(4);
    });
  });

  describe("calculateEstimatedProgress", () => {
    it("calculateEstimatedProgress returns a number", () => {
      const progress = projectManager.calculateEstimatedProgress(10);
      expect(typeof progress).toBe("number");
    });
  });

  describe("calculateProjectWeight", () => {
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
        const result = projectManager.calculateProjectWeight(
          expectedProgress,
          projectSize
        );
        expect(result).toBeCloseTo(expectedWeight, 5);
      }
    );

    it("should throw an error when expectedProgress is zero", () => {
      expect(() => projectManager.calculateProjectWeight(0, 5)).toThrow(
        "expectedProgress and projectSize must be positive values"
      );
    });

    it("should throw an error when projectSize is zero", () => {
      expect(() => projectManager.calculateProjectWeight(5, 0)).toThrow(
        "expectedProgress and projectSize must be positive values"
      );
    });

    it("should throw an error when expectedProgress is negative", () => {
      expect(() => projectManager.calculateProjectWeight(-1, 10)).toThrow(
        "expectedProgress and projectSize must be positive values"
      );
    });

    it("should throw an error when projectSize is negative", () => {
      expect(() => projectManager.calculateProjectWeight(10, -1)).toThrow(
        "expectedProgress and projectSize must be positive values"
      );
    });
  });

  describe("selectProjects", () => {
    it("selectProjects populates selectedProjects", () => {
      projectManager.selectedProjects = [];
      projectManager.cooldown = 0;
      projectManager.selectProjects();
      expect(projectManager.selectedProjects.length).toBe(4);
    });
  });

  describe("replaceIncativeProjects", () => {
    it("replaceInactiveProjects replaces non-active projects", () => {
      projectManager.selectedProjects = [
        { active: true, dataName: "a" },
        { active: false, dataName: "b" },
        { active: false, dataName: "c" },
        { active: true, dataName: "d" },
      ];
      projectManager.replaceInactiveProjects();
      expect(projectManager.selectedProjects.length).toBe(4);
      expect(projectManager.selectedProjects).not.toContain(
        (i) => i.dataName === "b"
      );
      expect(projectManager.selectedProjects).not.toContain(
        (i) => i.dataName === "c"
      );
    });
  });

  describe("selectAllNewProjects", () => {
    it("selectAllNewProjects selects 4 projects", () => {
      projectManager.selectAllNewProjects();
      expect(projectManager.selectedProjects.length).toBe(4);
    });
  });

  describe("getWeightedProjects", () => {
    it("getWeightedProjects returns an array of weighted projects", () => {
      const weighted = projectManager.getWeightedProjects();
      expect(weighted).toHaveLength(3 * 4);
      expect(weighted[0]).toHaveProperty("project");
      expect(weighted[0]).toHaveProperty("key");
      expect(weighted[0]["key"]).toBeGreaterThan(0);
    });
  });

  describe("removeProject", () => {
    it("removeProject removes a project from selectedProjects", () => {
      const dummy = { dataName: "123" };
      projectManager.selectedProjects = [dummy];
      projectManager.removeProject(dummy);
      expect(projectManager.selectedProjects).toHaveLength(0);
    });
  });

  describe("startTimer", () => {
    it("startTimer initializes cooldown and interval", () => {
      projectManager.startTimer(5);
      expect(projectManager.cooldown).toBe(5);
    });
  });

  describe("saveData", () => {
    it("saveData stores data in localStorage", () => {
      projectManager.saveData();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "ProjectManagerData",
        expect.any(String)
      );
    });
  });

  describe("loadData", () => {
    it("loadData loads data and starts timer", () => {
      localStorage.getItem.mockReturnValueOnce(
        JSON.stringify({ selectedProjectKeys: [], cooldown: 3 })
      );
      projectManager.loadData();
      expect(projectManager.cooldown).toBe(3);
    });
  });

  describe("loadProjects", () => {
    it("loadProjects restores valid projects", () => {
      const mockProject = {
        projectSize: 10,
        projectReward: 10,
        projectDeadline: 10,
        projectName: "P",
        projectProgress: 0,
        remainingTime: 10,
        completed: false,
        failed: false,
        isActive: false,
      };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockProject));
      projectManager.loadProjects(["testKey"]);
      expect(projectManager.selectedProjects.length).toBe(1);
    });
  });

  describe("createProjectFromData", () => {
    it("createProjectFromData creates a project from parsed data", () => {
      const project = projectManager.createProjectFromData(
        {
          projectSize: 5,
          projectReward: 10,
          projectDeadline: 20,
          projectName: "Test",
          projectProgress: 0,
          remainingTime: 20,
          completed: false,
          failed: false,
          isActive: false,
        },
        "abc123"
      );
      expect(project.projectName).toBe("Test");
    });
  });

  describe("resetForBankruptcy", () => {
    it("resetForBankruptcy calls reset on active projects", () => {
      const resetFn = vi.fn();
      projectManager.selectedProjects = [
        { active: true, resetForBankruptcy: resetFn },
      ];
      projectManager.resetForBankruptcy();
      expect(resetFn).toHaveBeenCalled();
    });
  });
});
