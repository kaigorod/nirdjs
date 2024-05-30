export const replaceArrayElt = <Value>(
	array: Array<Value>,
	index: number,
	nextValue: Value,
): Array<Value> => [
	...array.slice(0, index),
	nextValue,
	...array.slice(index + 1),
];
