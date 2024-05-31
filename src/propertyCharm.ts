import type { Charm, CharmConfig } from "./charm";
import { derive } from "./derive";

export const propertyCharm = <
  Value,
  prop extends keyof Value,
  DerivedValue extends Value[prop],
>(
  sourceCharm: Charm<Value>,
  propName: prop,
  config?: CharmConfig<Value[prop]>,
) => {
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
