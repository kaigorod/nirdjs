import { expect, test } from "bun:test";
import { replaceArrayElt } from "../src/langUtils";

test("replaceEltArray", () => {
  const arr = [1, 2, 3, 4, 5];
  const nextArr = replaceArrayElt(arr, 1, 10);
  expect(arr).toEqual([1, 2, 3, 4, 5]);
  expect(nextArr).toEqual([1, 10, 3, 4, 5]);
});
