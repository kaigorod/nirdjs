import { expect, mock, test } from "bun:test";
import { splitAtom } from "../src/arrays";
import { atom, type Atom } from "../src/atom";

test("atomList does not change when single value changes", () => {
  const arrayAtom = atom([10, 20]);
  const splitArrayAtom = splitAtom(arrayAtom);

  const atom0: Atom<number> = splitArrayAtom.get()[0];
  const atom1: Atom<number> = splitArrayAtom.get()[1];

  const nopFn = () => { }
  const subAtomMock = mock(nopFn as any)
  const sub0 = mock(nopFn as any)
  const sub1 = mock(nopFn as any)

  /// test


  splitArrayAtom.sub(subAtomMock)
  atom0.sub(sub0);
  atom1.sub(sub1);

  atom0.set(0);

  expect(sub0).toHaveBeenCalledTimes(1);

  expect(sub1).toHaveBeenCalledTimes(0);

  expect(subAtomMock).toHaveBeenCalledTimes(0);
});

