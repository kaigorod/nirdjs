import { atom, type Atom, type AtomConfig } from "./atom";
import type { GetFromSourceFn, SetToSourceFn } from "./utils";

/**
 * Use it as a setter function for read-only atoms.
 * @param _value 
 * @returns never for better typescript developer experience
 * @throws Error when called
 */
export const NeverSet = <Value>(_value: Value): never => {
  throw new Error("This atom is read-only");
};

/**
 * Creates derived atom based on @param sourceAtom
 * 
 * @param sourceAtom source atom to derive from
 * @param deriveFromSource @see {@link GetFromSourceFn}
 * @param propagateToSource @see {@link SetToSourceFn}, when creating read-only derived atoms then use @see {@link NeverSet} 
 * @param atomConfig 
 * 
 * @returns new Atom which is subscribed to @param @source atom
 */
export const derive = <SourceValue, DerivedValue>(
  sourceAtom: Atom<SourceValue>,
  deriveFromSource: GetFromSourceFn<SourceValue, DerivedValue>,
  propagateToSource: SetToSourceFn<SourceValue, DerivedValue>,
  atomConfig?: AtomConfig<DerivedValue>,
): Atom<DerivedValue> => {
  const innerAtom = atom(deriveFromSource(sourceAtom.get()), atomConfig);
  sourceAtom.sub((nextSourceValue: SourceValue) => {
    innerAtom.set(deriveFromSource(nextSourceValue));
  });

  return {
    ...innerAtom,
    get() {
      return innerAtom.get();
    },
    set(nextValue: DerivedValue) {
      const nextSourceValue = propagateToSource(nextValue, sourceAtom.get());
      innerAtom.set(nextValue);
      sourceAtom.set(nextSourceValue);
    },
  };
};
