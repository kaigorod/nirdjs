import type { Atom, AtomConfig } from "./atom";
import { derive } from "./derive";

/**
 * Utility function which creates new derived atom.
 * This new atom represent a single property of the @pararm sourceAtom
 * 
 * @param sourceAtom source atom to derive from
 * @param propName name of the property
 * @param config option AtomConfig
 * @returns new derived atom
 */
export const propertyAtom = <
  Value,
  prop extends keyof Value>(
    sourceAtom: Atom<Value>,
    propName: prop,
    config?: AtomConfig<Value[prop]>,
  ): Atom<Value[prop]> => {
  return derive<Value, Value[prop]>(
    sourceAtom,
    (sourceValue: Value) => sourceValue[propName],
    (nextPropValue: Value[prop], sourceValue) => ({
      ...sourceValue,
      [propName]: nextPropValue,
    }),
    config,
  );
};
