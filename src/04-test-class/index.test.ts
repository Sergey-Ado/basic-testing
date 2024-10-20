// Uncomment the code below and write your tests
import { getBankAccount } from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(100);
    const balance = bankAccount.getBalance();

    expect(balance).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(100);

    expect(() => bankAccount.withdraw(200)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(100);
    const secondBankAccount = getBankAccount(0);

    expect(() => bankAccount.transfer(200, secondBankAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);

    expect(() => bankAccount.transfer(50, bankAccount)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.deposit(50);

    expect(bankAccount.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.withdraw(25);

    expect(bankAccount.getBalance()).toBe(75);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(100);
    const secondBankAccount = getBankAccount(0);
    bankAccount.transfer(25, secondBankAccount);

    expect(bankAccount.getBalance()).toBe(75);
    expect(secondBankAccount.getBalance()).toBe(25);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(100);
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(1);

    const result = await bankAccount.fetchBalance();

    expect(result).toBe(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(200);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(200);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(100);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(() => bankAccount.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
