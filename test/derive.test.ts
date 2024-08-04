import { expect, mock, test } from "bun:test";
import { atom } from "../src/atom";
import { NeverSet, derive } from "../src/derive";

type A = { a: string };

test("when sources updates then derived updates", () => {
  const sourceAtom = atom<A>({ a: "1" });
  const derivedAtom = derive<A, string>(sourceAtom, ({ a }: A) => a, NeverSet);
  const derivedSubscriber = (_nextValue: string, _prevValue: string) => { };
  const mockFn = mock(derivedSubscriber);
  expect(derivedAtom.get()).toBe("1");
  derivedAtom.sub(mockFn);
  sourceAtom.set({ a: "2" });

  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual(["2", "1"]);

  expect(derivedAtom.get()).toBe("2");
});

test("derive", () => {
  const aAtom = atom({ a: "some string" });
  const beAtom = derive<A, string>(aAtom, ({ a }: A) => a, NeverSet);
  const seeAtom = derive<string, number>(beAtom, (a: string) => a.length, NeverSet);

  const derivedSubscriber = (_nextValue: number, _prevValue: number) => { };
  const mockFn = mock(derivedSubscriber);
  expect(seeAtom.get()).toBe(11);
  seeAtom.sub(mockFn);
  aAtom.set({ a: "another string" });

  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn.mock.calls[0]).toEqual([14, 11]);

  expect(seeAtom.get()).toBe(14);
});
