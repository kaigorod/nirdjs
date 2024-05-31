import { expect, mock, test } from "bun:test";
import { charm } from "../src/charm";
import { NeverSet, derive } from "../src/derive";

type A = { a: string };

test("when sources updates then derived updates", () => {
  const sourceCharm = charm<A>({ a: "1" });
  const derivedCharm = derive<A, string>(sourceCharm, ({ a }: A) => a, NeverSet);
  const derivedSubscriber = (_nextValue: string, _prevValue: string) => { };
  const mockFn = mock(derivedSubscriber);
  expect(derivedCharm.get()).toBe("test");
  derivedCharm.sub(mockFn);
  sourceCharm.set({ a: "2" });

  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual(["2", "1"]);

  expect(derivedCharm.get()).toBe("2");
});

test("derive", () => {
  const aCharm = charm({ a: "some string" });
  const beCharm = derive<A, string>(aCharm, ({ a }: A) => a, NeverSet);
  const seeCharm = derive<string, number>(beCharm, (a: string) => a.length, NeverSet);

  const derivedSubscriber = (_nextValue: number, _prevValue: number) => { };
  const mockFn = mock(derivedSubscriber);
  expect(seeCharm.get()).toBe(11);
  seeCharm.sub(mockFn);
  aCharm.set({ a: "another string" });

  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([14, 11]);

  expect(seeCharm.get()).toBe(14);
});
