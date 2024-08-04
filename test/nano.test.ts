import { expect, mock, test } from "bun:test";
import { nano } from "../src/nanoState";

test("get", () => {
  const numAtom = nano(2);
  expect(numAtom.get()).toBe(2);
});

test("set one time", () => {
  const numAtom = nano(2);
  numAtom.set(3);
  expect(numAtom.get()).toBe(3);
});

test("set two times", () => {
  const numAtom = nano(2);
  numAtom.set(3);
  numAtom.set(4);
  expect(numAtom.get()).toBe(4);
});

test("sub", () => {
  const numAtom = nano(2);
  const fn = (_nextValue: number) => { };
  const mockFn = mock(fn);
  numAtom.sub(mockFn);
  numAtom.set(3);
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([3]);
});
