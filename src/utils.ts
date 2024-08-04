
export type AtomSetter<Value> = (value: Value) => void;

export const atomSetter = <Value>(atom: Atom<Value>): AtomSetter<Value> => {
  return (value: Value) => atom.set(value);
};

export type AtomGetter<Value> = () => Value;
export const atomGetter = <Value>(atom: Atom<Value>): AtomGetter<Value> => {
  return () => atom.get();
};

/**
 * Extracts @param value of source atom to the value of derived atom
 * 
 * @see {@link } and @see {@link arrayEltAtom} for usage examples.
 */
export type GetFromSourceFn<SourceValue, DerivedValue> = (
  value: SourceValue,
) => DerivedValue;

/**
 * 
 * next value of derived atom @param nextDerivedValue
 * and previous value of source atom @param prevSourceValue.
 * When creating read-only derived atoms then use @see {@link NeverSet}.
 * When derived atom is not read-only then setting derived atom 
 * will also update the sourceAtom
 * @return next Value of source based on 
 */
export type SetToSourceFn<SourceValue, DerivedValue> = (
  nextDerivedValue: DerivedValue,
  prevSourceValue: SourceValue,
) => SourceValue;
