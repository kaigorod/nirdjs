import { expect, mock, test } from "bun:test";
import { charm } from "../charm";
import { NeverSet, derive } from "../derive";

type A = { a: number }

test("derive", () => {
  const sourceCharm = charm({ a: 1 });
  const derivedCharm = derive(sourceCharm, ({ a }) => a, NeverSet);
  const derivedSubscriber = (_nextValue: number, _prevValue: number) => { };
  const mockFn = mock(derivedSubscriber);
  expect(derivedCharm.get()).toBe(1);
  derivedCharm.sub(mockFn);
  sourceCharm.set({ a: 2 });

  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([3, 2]);

  expect(derivedCharm.get()).toBe(2);
});


