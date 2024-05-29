import { charm, type Charm, type CharmConfig, type UpdateFn } from "./charm";

export const charmSetter = <Value>(charm: Charm<Value>) => {
  return (value: Value) => charm.set(value);
};
export const charmUpdater = <Value>(charm: Charm<Value>) => {
  return (updateFn: UpdateFn<Value>) => charm.update(updateFn);
};
export const charmGetter = <Value>(charm: Charm<Value>) => {
  return () => charm.get();
};


export type GetByPathFn<BaseValue, DerivedValue> = (
  value: BaseValue,
) => DerivedValue;
export type SetByPathFn<BaseValue, DerivedValue> = (
  nextDerivedValue: DerivedValue,
  prevBaseValue: BaseValue,
) => BaseValue;

export const inheritCharm = <BaseValue, DerivedValue>(
  base: Charm<BaseValue>,
  getByPath: GetByPathFn<BaseValue, DerivedValue>,
  setByPath: SetByPathFn<BaseValue, DerivedValue>,
  charmConfig?: CharmConfig<DerivedValue>,
) => {
  const superCharm = charm(getByPath(base.get()));
  return {
    ...superCharm,
    get() {
      return getByPath(base.get());
    },
    set(nextValue: DerivedValue) {
      superCharm.set(nextValue);
      const nextBaseValue = setByPath(nextValue, base.get());
      base.set(nextBaseValue);
    },
  };
};

export const propertyCharm = <Value, PropValue>(
  base: Charm<Value>,
  propName: string,
  config?: CharmConfig<Value>,
) => {
  return inheritCharm(
    base,
    (base) => base[propName],
    (nextPropValue, base) => ({ ...base, [propName]: nextPropValue }),
    config,
  );
};

export const arrayEltCharm = <Value>(
  base: Charm<Array<Value>>,
  index: number,
  config?: CharmConfig<Value>,
) => {
  return inheritCharm<Array<Value>, Value>(
    base,
    (value: Array<Value>) => value[index],
    (nextEltValue, base) => {
      const nextBase = [...base];
      nextBase[index] = nextEltValue;
      return nextBase;
    },
    config,
  );
};

export const debouncedCharm = <Value>(
  baseCharm: Charm<Value>,
  delay: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
  let latestValue: Value = baseCharm.get();
  const superCharm = charm(baseCharm.get());

  return {
    ...superCharm,
    set(nextValue: Value) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      timeoutId = setTimeout(() => {
        superCharm.set(nextValue);
        latestValue = nextValue;
        timeoutId = undefined;
      }, delay);
    },
  };
};
