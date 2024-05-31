import { charm, type Charm, type CharmConfig } from "./charm";
import type { GetFromSourceFn, SetToSourceFn } from "./utils";

export const NeverSet = <DerivedValue>(_value: DerivedValue): never => {
  throw new Error("This charm is read-only");
};

export const derive = <SourceValue, DerivedValue>(
  source: Charm<SourceValue>,
  deriveFromSource: GetFromSourceFn<SourceValue, DerivedValue>,
  propagateToSource: SetToSourceFn<SourceValue, DerivedValue>,
  charmConfig?: CharmConfig<DerivedValue>,
) => {
  const innerCharm = charm(deriveFromSource(source.get()), charmConfig);
  source.sub((nextSourceValue: SourceValue) => {
    innerCharm.set(deriveFromSource(nextSourceValue));
  });

  return {
    ...innerCharm,
    get() {
      return innerCharm.get();
    },
    set(nextValue: DerivedValue) {
      const nextSourceValue = propagateToSource(nextValue, source.get());
      innerCharm.set(nextValue);
      source.set(nextSourceValue);
    },
  };
};
