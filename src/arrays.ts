import type { Charm, CharmConfig, UpdateFn } from "./charm";
import { NeverSet, derive } from "./derive";
import { replaceArrayElt } from "./langUtils";

/**
 * Creates charm of single element of an array.
 * @see {@link splitCharm} returns an charm array
 * 
 * @param source Charm which holds array
 * @param index of an element
 * @param config optional @see {@link CharmConfig}
 * @returns new Charm linked to element of arrary by index.
 */
export const arrayEltCharm = <Value>(
  source: Charm<Array<Value>>,
  index: number,
  config?: CharmConfig<Value>,
): Charm<Value> => {
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

/**
 * Utility function to update a single element of an array.
 * 
 * @param arrayCharm charm which holds array
 * @param index Index of element to update
 * @param updateFn Update function 
 */
export const updateElt = <Value>(
  arrayCharm: Charm<Array<Value>>,
  index: number,
  updateFn: UpdateFn<Value>,
): void => {
  arrayCharm.update((array) => replaceArrayElt(array, index, updateFn(array[index])));
};

/**
 * 
 * @param source 
 * @param itemsConfig 
 * @param containerConfig 
 * @returns 
 */
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
