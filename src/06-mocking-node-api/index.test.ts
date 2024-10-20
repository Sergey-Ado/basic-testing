// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockFn = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockFn, 2000);

    expect(setTimeout).toBeCalledWith(mockFn, 2000);
  });

  test('should call callback only after timeout', () => {
    const mockFn = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockFn, 2000);

    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(2000);
    expect(mockFn).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockFn = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockFn, 2000);

    expect(setInterval).toBeCalledWith(mockFn, 2000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockFn = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockFn, 2000);

    expect(mockFn).not.toBeCalled();

    jest.advanceTimersByTime(2000);
    expect(mockFn).toBeCalledTimes(1);

    jest.advanceTimersByTime(2000);
    expect(mockFn).toBeCalledTimes(2);
  });
});

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('test.txt');

    expect(join).toBeCalledWith(expect.anything(), 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously('test.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue('content');
    const result = await readFileAsynchronously('test.txt');

    expect(result).toBe('content');
  });
});
