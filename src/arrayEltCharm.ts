import type { Charm, CharmConfig } from "./charm";
import { NeverSet, derive } from "./derive";
import { replaceArrayElt } from "./langUtils";

export const arrayEltCharm = <Value>(
	source: Charm<Array<Value>>,
	index: number,
	config?: CharmConfig<Value>,
) => {
	return derive<Array<Value>, Value>(
		source,
		(value: Array<Value>) => value[index],
		(nextEltValue, source) => {
			const nextSource = [...source];
			nextSource[index] = nextEltValue;
			return nextSource;
		},
		config,
	);
};

export const splitCharm = <Value>(
	source: Charm<Array<Value>>,
	itemsConfig?: CharmConfig<Value>,
	containerConfig?: CharmConfig<Array<Charm<Value>>>,
): Charm<Array<Charm<Value>>> => {
	const arrayOfCharms = new Array<Charm<Value>>();
	const valueArray = source.get();
	const charmOfArrayToArrayOfCharms = () => {
		for (let index = 0; index < valueArray.length; index++) {
			const derived = arrayEltCharm<Value>(source, index, itemsConfig);
			arrayOfCharms.push(derived);
		}
		return arrayOfCharms;
	};

	return derive<Array<Value>, Array<Charm<Value>>>(
		source,
		charmOfArrayToArrayOfCharms,
		NeverSet,
		containerConfig,
	);
};
