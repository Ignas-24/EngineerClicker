import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Project } from "../Project.js";

describe("Project", () => {
  let mockGame, project;

  beforeAll(() => {
    global.localStorage = { getItem: vi.fn(), setItem: vi.fn() };
    global.alert = vi.fn();
    vi.useFakeTimers();
  });

  beforeEach(() => {
    mockGame = {
      resourceManager: { clickPower: 2, multiplier: 3, changeEuros: vi.fn() },
      projectManager: {
        completedProjectsThisReset: 0,
        completedProjectTotal: 0,
        removeProject: vi.fn(),
        selectedProjects: [],
      },
      notifyUpdate: vi.fn(),
    };
    project = new Project(mockGame, 10, 100, 5, "Test", "TestKey");
    vi.spyOn(project, "startTimer").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("toggleActive", () => {
    it("should activate and call startTimer", () => {
      project.toggleActive();
      expect(project.active).toBe(true);
      expect(project.startTimer).toHaveBeenCalled();
      expect(mockGame.notifyUpdate).toHaveBeenCalled();
    });

    it("should deactivate, reset progress/time, and call stopTimer", () => {
      project.active = true;
      project.projectProgress = 5;
      project.remainingTime = 2;
      vi.spyOn(project, "stopTimer").mockImplementation(() => {});
      project.toggleActive();
      expect(project.active).toBe(false);
      expect(project.projectProgress).toBe(0);
      expect(project.remainingTime).toBe(5);
      expect(project.stopTimer).toHaveBeenCalled();
    });
  });

  describe("addProgress", () => {
    it("should increment progress by clickPower*multiplier when active", () => {
      project.active = true;
      project.addProgress();
      expect(project.projectProgress).toBe(2 * 3);
      expect(mockGame.notifyUpdate).toHaveBeenCalled();
    });
  });

  describe("addProgressByDeveloper", () => {
    it("should increment progress by company efficiency when active", () => {
      mockGame.companyManager = { calculateTotalEfficiency: () => 4 };
      project.active = true;
      project.addProgressByDeveloper();
      expect(project.projectProgress).toBe(4);
      expect(mockGame.notifyUpdate).toHaveBeenCalled();
    });
  });

  describe("checkCompletion", () => {
    it("should mark complete, reward, and remove project when progress ≥ size", () => {
      project.active = true;
      project.projectProgress = 10;
      project.checkCompletion();
      expect(project.completed).toBe(true);
      expect(project.active).toBe(false);
      expect(mockGame.resourceManager.changeEuros).toHaveBeenCalledWith(100);
      expect(mockGame.projectManager.removeProject).toHaveBeenCalledWith(
        project,
      );
    });
  });

  describe("stopTimer", () => {
    it("should clear interval and null timerInterval", () => {
      project.timerInterval = 123;
      project.stopTimer();
      expect(project.timerInterval).toBeNull();
    });
  });

  describe("saveData", () => {
    it("should write project data to localStorage", () => {
      project.projectProgress = 3;
      project.saveData();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "TestKeyData",
        expect.stringContaining('"projectProgress":3'),
      );
    });
  });

  describe("loadData", () => {
    it("should load and override fields from storage", () => {
      const stored = {
        projectName: "X",
        projectSize: 7,
        projectProgress: 2,
        projectReward: 50,
        projectDeadline: 8,
        remainingTime: 4,
        completed: true,
        failed: false,
        isActive: true,
      };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(stored));
      project.loadData();
      expect(project.projectName).toBe("X");
      expect(project.projectSize).toBe(7);
      expect(project.projectProgress).toBe(2);
      expect(project.active).toBe(true);
    });
  });

  describe("resetForBankruptcy", () => {
    it("should clear progress, size, time and save", () => {
      project.projectProgress = 5;
      project.projectSize = 9;
      project.remainingTime = 3;
      project.active = true;
      project.resetForBankruptcy();
      expect(project.projectProgress).toBe(0);
      expect(project.projectSize).toBe(0);
      expect(project.remainingTime).toBe(0);
      expect(project.active).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
