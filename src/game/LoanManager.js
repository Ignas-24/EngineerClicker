export class LoanManager {
  game;
  inDebt = false;
  hasLoan = false;
  loanAmount = 0;
  loanInterestRate = 0;
  totalLoanToRepay = 0;
  remainingLoanAmount = 0;
  paymentClock = 0;
  paymentInterval = 5 * 60 * 1000;
  paymentPercentage = 0.05;
  timerInterval = 100;

  constructor(game) {
    this.game = game;
    this.loadData();
    this.setupPaymentTimer();
  }

  setupPaymentTimer() {
    setInterval(() => this.checkLoanPayment(), this.timerInterval);
  }

  checkLoanPayment() {
    if (!this.hasLoan) return;

    this.paymentClock -= this.timerInterval;
    if (this.paymentClock <= 0) {
      const paymentAmount = this.totalLoanToRepay * this.paymentPercentage;
      if (this.game.resourceManager.euro >= paymentAmount) {
        this.game.resourceManager.changeEuros(-paymentAmount);
        this.remainingLoanAmount -= paymentAmount;
        if (this.remainingLoanAmount <= 0) {
          this.hasLoan = false;
          this.remainingLoanAmount = 0;
          this.totalLoanToRepay = 0;
        }
      } else {
        this.declareBankruptcy();
      }
      this.paymentClock = this.paymentInterval;
      this.saveData();
      this.game.notifyUpdate();
    }
  }

  getMaxLoanAmount() {
    const prestige = this.game.resourceManager.prestige;
    if (prestige >= 5) return 100000;
    if (prestige >= 4) return 50000;
    if (prestige >= 2) return 10000;
    return 5000;
  }

  getInterestRate() {
    return this.game.resourceManager.prestige >= 4 ? 0.075 : 0.1;
  }

  canTakeLoan() {
    return !this.hasLoan;
  }

  takeLoan(amount) {
    if (this.hasLoan) return false;

    const maxAmount = this.getMaxLoanAmount();
    if (amount > maxAmount) return false;
    if (this.game.resourceManager.euro + amount < 0) return false;

    this.inDebt = false;
    this.hasLoan = true;
    this.loanAmount = amount;
    this.loanInterestRate = this.getInterestRate();
    this.totalLoanToRepay = amount * (1 + this.loanInterestRate);
    this.remainingLoanAmount = this.totalLoanToRepay;
    this.paymentClock = this.paymentInterval;

    this.game.resourceManager.euro += amount;

    this.saveData();
    this.game.notifyUpdate();
    return true;
  }

  payOffLoan() {
    if (!this.hasLoan) return false;

    if (this.game.resourceManager.euro >= this.remainingLoanAmount) {
      this.game.resourceManager.changeEuros(-this.remainingLoanAmount);
      this.hasLoan = false;
      this.loanAmount = 0;
      this.totalLoanToRepay = 0;
      this.remainingLoanAmount = 0;

      this.saveData();
      this.game.notifyUpdate();
      return true;
    }

    return false;
  }

  declareBankruptcy() {
    alert("You went bankrupt :)");

    this.inDebt = false;
    this.hasLoan = false;
    this.loanAmount = 0;
    this.totalLoanToRepay = 0;
    this.remainingLoanAmount = 0;

    this.game.resetForBankruptcy();

    this.saveData();
    this.game.notifyUpdate();
  }

  checkNegativeBalance() {
    if (this.game.resourceManager.euro < 0) {
      if (this.hasLoan) {
        this.declareBankruptcy();
      } else {
        this.inDebt = true;
        this.saveData();
      }
    }
  }

  saveData() {
    const data = {
      hasLoan: this.hasLoan,
      loanAmount: this.loanAmount,
      loanInterestRate: this.loanInterestRate,
      totalLoanToRepay: this.totalLoanToRepay,
      remainingLoanAmount: this.remainingLoanAmount,
      paymentClock: this.paymentClock,
      inDebt: this.inDebt
    };
    localStorage.setItem("LoanManagerData", JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem("LoanManagerData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.hasLoan = data.hasLoan || false;
      this.loanAmount = data.loanAmount || 0;
      this.loanInterestRate = data.loanInterestRate || 0;
      this.totalLoanToRepay = data.totalLoanToRepay || 0;
      this.remainingLoanAmount = data.remainingLoanAmount || 0;
      this.paymentClock = data.paymentClock || 0;
      this.inDebt = data.inDebt || false;
    }
  }
}
