import { charm, type Charm, type CharmConfig } from "./charm";
import type { GetFromSourceFn, SetToSourceFn } from "./utils";

/**
 * Use it as a setter function for read-only charms.
 * @param _value 
 * @returns never for better typescript developer experience
 * @throws Error when called
 */
export const NeverSet = <Value>(_value: Value): never => {
  throw new Error("This charm is read-only");
};

/**
 * Creates derived charm particle based on @param sourceCharm particle
 * 
 * @param sourceCharm source charm to derive from
 * @param deriveFromSource @see GetFromSourceFn
 * @param propagateToSource @see SetToSourceFn, when creating read-only derived charms then use @see NeverSet 
 * @param charmConfig 
 * 
 * @returns new Charm which is subscribed to @param @source charm
 */
export const derive = <SourceValue, DerivedValue>(
  sourceCharm: Charm<SourceValue>,
  deriveFromSource: GetFromSourceFn<SourceValue, DerivedValue>,
  propagateToSource: SetToSourceFn<SourceValue, DerivedValue>,
  charmConfig?: CharmConfig<DerivedValue>,
): Charm<DerivedValue> => {
  const innerCharm = charm(deriveFromSource(sourceCharm.get()), charmConfig);
  sourceCharm.sub((nextSourceValue: SourceValue) => {
    innerCharm.set(deriveFromSource(nextSourceValue));
  });

  return {
    ...innerCharm,
    get() {
      return innerCharm.get();
    },
    set(nextValue: DerivedValue) {
      const nextSourceValue = propagateToSource(nextValue, sourceCharm.get());
      innerCharm.set(nextValue);
      sourceCharm.set(nextSourceValue);
    },
  };
};
