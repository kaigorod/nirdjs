import type { Charm, CharmConfig } from "./charm";
import { derive } from "./derive";

/**
 * Utility function which creates new derived charm.
 * This new charm represent a single property of the @pararm sourceCharm
 * 
 * @param sourceCharm source charm to derive from
 * @param propName name of the property
 * @param config option CharmConfig
 * @returns new derived charm
 */
export const propertyCharm = <
  Value,
  prop extends keyof Value>(
    sourceCharm: Charm<Value>,
    propName: prop,
    config?: CharmConfig<Value[prop]>,
  ): Charm<Value[prop]> => {
  return derive<Value, Value[prop]>(
    sourceCharm,
    (sourceValue: Value) => sourceValue[propName],
    (nextPropValue: Value[prop], sourceValue) => ({
      ...sourceValue,
      [propName]: nextPropValue,
    }),
    config,
  );
};
