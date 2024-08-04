import { expect, mock, test } from "bun:test";
import { nano } from "../src/nanoState";

test("get", () => {
  const numCharm = nano(2);
  expect(numCharm.get()).toBe(2);
});

test("set one time", () => {
  const numCharm = nano(2);
  numCharm.set(3);
  expect(numCharm.get()).toBe(3);
});

test("set two times", () => {
  const numCharm = nano(2);
  numCharm.set(3);
  numCharm.set(4);
  expect(numCharm.get()).toBe(4);
});

test("sub", () => {
  const numCharm = nano(2);
  const fn = (_nextValue: number) => { };
  const mockFn = mock(fn);
  numCharm.sub(mockFn);
  numCharm.set(3);
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([3]);
});
