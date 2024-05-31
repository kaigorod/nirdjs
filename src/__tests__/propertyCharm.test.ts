import { expect, mock, test } from "bun:test";
import { propertyCharm } from "../propertyCharm";
import { charm } from "../charm";

test("propertyCharm", () => {
  const sourceCharm = charm({ a: 1, b: 2 });
  const elt0 = propertyCharm(sourceCharm, "a");
  const elt1 = propertyCharm(sourceCharm, "b");

  expect(elt0.get()).toBe(1);

  const fn0 = (_nextValue: number, _prevValue: number) => {};
  const fn1 = (_nextValue: number, _prevValue: number) => {
    throw new Error();
  };
  const mockFn0 = mock(fn0);
  const mockFn1 = mock(fn1);
  elt0.sub(mockFn0);
  elt1.sub(mockFn1);

  sourceCharm.update((prev) => ({
    ...prev,
    a: 3,
  }));
  expect(elt0.get()).toBe(3);
  expect(elt1.get()).toBe(2);

  expect(mockFn0).toHaveBeenCalledTimes(1);
  expect(mockFn0.mock.calls[0]).toEqual([3, 1]);

  //
  expect(mockFn1).toHaveBeenCalledTimes(0);
});
