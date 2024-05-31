import { expect, mock, test } from "bun:test";
import { splitCharm } from "../src/arrays";
import { charm, type Charm } from "../src/charm";

test("charmList does not change when single value changes", () => {
  const arrayCharm = charm([10, 20]);
  const splitArrayCharm = splitCharm(arrayCharm);

  const charm0: Charm<number> = splitArrayCharm.get()[0];
  const charm1: Charm<number> = splitArrayCharm.get()[1];

  const nopFn = () => { }
  const subCharmMock = mock(nopFn as any)
  const sub0 = mock(nopFn as any)
  const sub1 = mock(nopFn as any)

  /// test


  splitArrayCharm.sub(subCharmMock)
  charm0.sub(sub0);
  charm1.sub(sub1);

  charm0.set(0);

  expect(sub0).toHaveBeenCalledTimes(1);

  expect(sub1).toHaveBeenCalledTimes(0);

  expect(subCharmMock).toHaveBeenCalledTimes(0);
});

