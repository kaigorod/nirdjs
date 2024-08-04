import { expect, mock, test } from "bun:test";
import { atom, batch } from "../src/atom";

test("get", () => {
  const numAtom = atom(2);
  expect(numAtom.get()).toBe(2);
});

test("atom.toString", () => {
  const aAtom = atom(2);
  const bAtom = atom(2);
  const aAtomStr = aAtom.toString();
  const bAtomStr = bAtom.toString();
  expect(aAtom.toString()).toMatch(/atom:[0-9]+: \[2\]/);
  expect(bAtom.toString()).toMatch(/atom:[0-9]+: \[2\]/);
  expect(aAtomStr === bAtomStr).toBeFalse();
});

test("set one time", () => {
  const numAtom = atom(2);
  numAtom.set(3);
  expect(numAtom.get()).toBe(3);
});

test("set two times", () => {
  const numAtom = atom(2);
  numAtom.set(3);
  numAtom.set(4);
  expect(numAtom.get()).toBe(4);
});

test("sub", () => {
  const numAtom = atom(2);
  const fn = (_nextValue: number, _prevValue: number) => { };
  const mockFn = mock(fn);
  numAtom.sub(mockFn);
  numAtom.set(3);
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([3, 2]);
});

test("batch does not run immediately", () => {
  const numAtom = atom(2);
  batch(() => {
    numAtom.set(3);
  });

  expect(numAtom.get()).toBe(3);
});
