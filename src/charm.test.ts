import { expect, mock, test } from "bun:test";
import { batch, charm } from "./charm";

test("get", () => {
  const numCharm = charm(2);
  expect(numCharm.get()).toBe(2);
});

test("charm.toString", () => {
  const aCharm = charm(2);
  const bCharm = charm(2);
  const aCharmStr = aCharm.toString()
  const bCharmStr = bCharm.toString()
  expect(aCharm.toString()).toMatch(/charm:[0-9]+: \[2\]/);
  expect(bCharm.toString()).toMatch(/charm:[0-9]+: \[2\]/);
  expect(aCharmStr === bCharmStr).toBeFalse()
});



test("set one time", () => {
  const numCharm = charm(2);
  numCharm.set(3);
  expect(numCharm.get()).toBe(3);
});

test("set two times", () => {
  const numCharm = charm(2);
  numCharm.set(3);
  numCharm.set(4);
  expect(numCharm.get()).toBe(4);
});


test("sub", () => {
  const numCharm = charm(2);
  const fn = (_nextValue: number, _prevValue: number) => {
  }
  const mockFn = mock(fn)
  numCharm.sub(mockFn)
  numCharm.set(3)
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([3, 2]);
});

test("batch does not run immediately", () => {
  const numCharm = charm(2);
  batch(() => {
    numCharm.set(3)
  })

  expect(numCharm.get()).toBe(3);
});