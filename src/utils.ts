import { type Charm } from "./charm";

export type CharmSetter<Value> = (value: Value) => void;

export const charmSetter = <Value>(charm: Charm<Value>): CharmSetter<Value> => {
  return (value: Value) => charm.set(value);
};

export type CharmGetter<Value> = () => Value;
export const charmGetter = <Value>(charm: Charm<Value>): CharmGetter<Value> => {
  return () => charm.get();
};

export type GetFromSourceFn<SourceValue, DerivedValue> = (
  value: SourceValue,
) => DerivedValue;
export type SetToSourceFn<SourceValue, DerivedValue> = (
  nextDerivedValue: DerivedValue,
  prevSourceValue: SourceValue,
) => SourceValue;

// export const debouncedCharm = <Value>(
//   sourceCharm: Charm<Value>,
//   delay: number,
// ) => {
//   let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
//   // let latestValue: Value = sourceCharm.get();
//   const superCharm = charm(sourceCharm.get());

//   return {
//     ...superCharm,
//     set(nextValue: Value) {
//       if (timeoutId !== undefined) {
//         clearTimeout(timeoutId);
//         timeoutId = undefined;
//       }
//       timeoutId = setTimeout(() => {
//         superCharm.set(nextValue);
//         // latestValue = nextValue;
//         timeoutId = undefined;
//       }, delay);
//     },
//   };
// };
