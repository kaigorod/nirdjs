import type { Atom, AtomConfig, UpdateFn } from "./atom";
import { NeverSet, derive } from "./derive";
import { replaceArrayElt } from "./langUtils";

/**
 * Creates atom of single element of an array.
 * @see {@link splitAtom} returns an atom array
 * 
 * @param source Atom which holds array
 * @param index of an element
 * @param config optional @see {@link AtomConfig}
 * @returns new Atom linked to element of arrary by index.
 */
export const arrayEltAtom = <Value>(
  source: Atom<Array<Value>>,
  index: number,
  config?: AtomConfig<Value>,
): Atom<Value> => {
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
 * @param arrayAtom atom which holds array
 * @param index Index of element to update
 * @param updateFn Update function 
 */
export const updateElt = <Value>(
  arrayAtom: Atom<Array<Value>>,
  index: number,
  updateFn: UpdateFn<Value>,
): void => {
  arrayAtom.update((array) => replaceArrayElt(array, index, updateFn(array[index])));
};

/**
 * 
 * @param source 
 * @param itemsConfig 
 * @param containerConfig 
 * @returns 
 */
export const splitAtom = <Value>(
  source: Atom<Array<Value>>,
  itemsConfig?: AtomConfig<Value>,
  containerConfig?: AtomConfig<Array<Atom<Value>>>,
): Atom<Array<Atom<Value>>> => {
  const arrayOfAtoms = new Array<Atom<Value>>();
  const valueArray = source.get();
  const atomOfArrayToArrayOfAtoms = () => {
    for (let index = 0; index < valueArray.length; index++) {
      const derived = arrayEltAtom<Value>(source, index, itemsConfig);
      arrayOfAtoms.push(derived);
    }
    return arrayOfAtoms;
  };

  return derive<Array<Value>, Array<Atom<Value>>>(
    source,
    atomOfArrayToArrayOfAtoms,
    NeverSet,
    containerConfig,
  );
};
