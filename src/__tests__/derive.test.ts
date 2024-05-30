import { expect, mock, test } from "bun:test";
import { charm } from "../charm";
import { NeverSet, derive } from "../derive";

type A = { a: number };

test("when sources updates then derived updates", () => {
	const sourceCharm = charm({ a: 1 });
	const derivedCharm = derive(sourceCharm, ({ a }) => a, NeverSet);
	const derivedSubscriber = (_nextValue: number, _prevValue: number) => {};
	const mockFn = mock(derivedSubscriber);
	expect(derivedCharm.get()).toBe(1);
	derivedCharm.sub(mockFn);
	sourceCharm.set({ a: 2 });

	expect(mockFn).toHaveBeenCalled();
	expect(mockFn).toHaveBeenCalledTimes(1);
	expect(mockFn.mock.calls[0]).toEqual([2, 1]);

	expect(derivedCharm.get()).toBe(2);
});

test("derive", () => {
	const aCharm = charm({ a: "some string" });
	const beCharm = derive(aCharm, ({ a }) => a, NeverSet);
	const seeCharm = derive(beCharm, (a) => a.length, NeverSet);

	const derivedSubscriber = (_nextValue: number, _prevValue: number) => {};
	const mockFn = mock(derivedSubscriber);
	expect(seeCharm.get()).toBe(11);
	seeCharm.sub(mockFn);
	aCharm.set({ a: "another string" });

	expect(mockFn).toHaveBeenCalled();
	expect(mockFn).toHaveBeenCalledTimes(1);
	expect(mockFn.mock.calls[0]).toEqual([14, 11]);

	expect(seeCharm.get()).toBe(14);
});
