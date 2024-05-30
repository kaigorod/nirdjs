import { expect, mock, test } from "bun:test";
import { charm } from "../charm";
import { splitCharm } from "../arrayEltCharm";

test("splitCharm", () => {
	const arrayCharm = charm([10, 11, 12, 13, 14]);
    const splitArrayCharm = splitCharm(arrayCharm);

	expect(splitArrayCharm.get().length).toBe(5);
});
