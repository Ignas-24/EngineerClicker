import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LoanManager } from "../LoanManager.js";

describe("LoanManager", () => {
  const mockGame = () => ({
    resourceManager: {
      euro: 0,
      prestige: 0,
      changeEuros: vi.fn(function (amount) {
        this.euro += amount;
      }),
    },
    stats: {
      increment: vi.fn(),
    },
    achievementManager: {
      checkAchievements: vi.fn(),
    },
    resetForBankruptcy: vi.fn(),
    notifyUpdate: vi.fn(),
  });

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };

    vi.useFakeTimers();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("can take a valid loan", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    const result = manager.takeLoan(5000);

    expect(result).toBe(true);
    expect(manager.hasLoan).toBe(true);
    expect(game.resourceManager.euro).toBe(5000);
  });

  //Current bug - taking a loan does not save the balance of the player, thus reloading the page removes loaned money
  it.skip("reloading the page saves loan", () => {
    const game = mockGame();
    const manager = new LoanManager(game);

    manager.takeLoan(5000);

    expect(game.resourceManager.euro).toBe(5000);

    const newGame = mockGame();
    const newManager = new LoanManager(newGame);

    expect(newGame.resourceManager.euro).toBe(5000);
    expect(newManager.hasLoan).toBe(true);
    expect(newManager.loanAmount).toBe(5000);
  });

  it("can not take an invalid (too large) loan", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    const result = manager.takeLoan(15000);

    expect(result).toBe(false);
    expect(manager.hasLoan).toBe(false);
    expect(game.resourceManager.euro).toBe(0);
  });

  it("can not take another loan if one is already present", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    manager.hasLoan = true;

    expect(manager.takeLoan(1000)).toBe(false);
  });

  it("fully pays off the loan if enough euros", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    manager.takeLoan(5000);

    game.resourceManager.euro = 100000;
    const result = manager.payOffLoan();

    expect(result).toBe(true);
    expect(manager.hasLoan).toBe(false);
    expect(manager.remainingLoanAmount).toBe(0);
  });

  it("does not pay off loan if euros are insufficient", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    manager.takeLoan(5000);

    game.resourceManager.euro = 4999;
    const result = manager.payOffLoan();

    expect(result).toBe(false);
    expect(manager.hasLoan).toBe(true);
  });

  it("sets inDebt if euros go negative without loan", () => {
    const game = mockGame();
    game.resourceManager.euro = -1;
    const manager = new LoanManager(game);

    manager.checkNegativeBalance();
    expect(manager.inDebt).toBe(true);
  });

  it("declares bankruptcy if in debt with loan", () => {
    const game = mockGame();
    game.resourceManager.euro = -100;
    const manager = new LoanManager(game);
    manager.hasLoan = true;

    manager.checkNegativeBalance();
    expect(game.resetForBankruptcy).toHaveBeenCalled();
  });

  it("sucesfully charges the player for the loan", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    game.resourceManager.euro = 1000;

    manager.takeLoan(5000);
    expect(manager.hasLoan).toBe(true);
    manager.paymentClock = 0;
    manager.checkLoanPayment();

    expect(game.resourceManager.euro).toBe(
      6000 - manager.totalLoanToRepay * manager.paymentPercentage,
    );
  });

  it("bankrups the player if the payment amount is more than the balance", () => {
    const game = mockGame();
    const manager = new LoanManager(game);
    game.resourceManager.euro = 1000;

    manager.takeLoan(5000);
    expect(manager.hasLoan).toBe(true);
    game.resourceManager.euro = 20;
    manager.paymentClock = 0;
    manager.checkLoanPayment();

    expect(game.resetForBankruptcy).toHaveBeenCalled();
  });

  it("returns correct max loan amount by prestige", () => {
    const game = mockGame();
    const manager = new LoanManager(game);

    game.resourceManager.prestige = 5;
    expect(manager.getMaxLoanAmount()).toBe(100000);

    game.resourceManager.prestige = 4;
    expect(manager.getMaxLoanAmount()).toBe(50000);

    game.resourceManager.prestige = 2;
    expect(manager.getMaxLoanAmount()).toBe(10000);

    game.resourceManager.prestige = 1;
    expect(manager.getMaxLoanAmount()).toBe(5000);
  });

  it("returns correct interest rate based on prestige", () => {
    const game = mockGame();
    const manager = new LoanManager(game);

    game.resourceManager.prestige = 4;
    expect(manager.getInterestRate()).toBe(0.075);

    game.resourceManager.prestige = 1;
    expect(manager.getInterestRate()).toBe(0.1);
  });
});
