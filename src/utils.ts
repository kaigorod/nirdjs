import { charm, type Charm, type CharmConfig, type UpdateFn } from "./charm";
import { derive } from "./derive";

export const charmSetter = <Value>(charm: Charm<Value>) => {
	return (value: Value) => charm.set(value);
};
export const charmUpdater = <Value>(charm: Charm<Value>) => {
	return (updateFn: UpdateFn<Value>) => charm.update(updateFn);
};
export const charmGetter = <Value>(charm: Charm<Value>) => {
	return () => charm.get();
};

export type GetFromSourceFn<SourceValue, DerivedValue> = (
	value: SourceValue,
) => DerivedValue;
export type SetToSourceFn<SourceValue, DerivedValue> = (
	nextDerivedValue: DerivedValue,
	prevSourceValue: SourceValue,
) => SourceValue;

export const debouncedCharm = <Value>(
	sourceCharm: Charm<Value>,
	delay: number,
) => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
	let latestValue: Value = sourceCharm.get();
	const superCharm = charm(sourceCharm.get());

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
