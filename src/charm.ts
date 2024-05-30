import { useEffect, useState } from "react";

export type Subscriber<Value> = (nextValue: Value, prevValue: Value) => void;

export let charmCounter = 0;

export type UpdateFn<Value> = (prev: Value) => Value;

export type IgnoreWhenFn<Value> = (
	prevValue: Value,
	nextValue: Value,
) => boolean;

let batching: Array<() => void> | undefined = undefined;

export type CharmConfig<Value> = {
	ignoreWhen?: IgnoreWhenFn<Value>;
	debugLabel?: string;
};

export const isIdentical = <Value>(a: Value, b: Value) =>
	a === b || (Number.isNaN(a) && Number.isNaN(b));
export const neverIgnore = undefined;

export const defaultConfig = {
	ignoreWhen: isIdentical,
	debugLabel: "charm",
	allowFnValue: false,
};

export const charm = <Value>(
	initialValue: Value,
	charmConfig?: CharmConfig<Value>,
) => {
	let currentValue: Value = initialValue;
	const subscribers = new Set<Subscriber<Value>>();
	const charmId = charmCounter++;

	const config = charmConfig
		? { ...defaultConfig, ...charmConfig }
		: defaultConfig;

	const notifyNow = (nextValue: Value, prevValue: Value) => {
		for (const subscriber of subscribers) {
			subscriber(nextValue, prevValue);
		}
	};
	const notify = (nextValue: Value, prevValue: Value) => {
		if (config?.ignoreWhen?.(nextValue, prevValue)) {
			// console.log("notify skip ", { nextValue, prevValue })
			return;
		}
		// console.log("notify fire ", { nextValue, prevValue })

		if (batching === undefined) {
			notifyNow(nextValue, prevValue);
			return;
		}

		batching.push(() => {
			notifyNow(nextValue, prevValue);
		});
	};

	return {
		get(): Value {
			return currentValue;
		},
		set(nextValue: Value) {
			if (!config.allowFnValue && typeof nextValue === "function") {
				console.trace("charm set fn", config.debugLabel, nextValue);
				return;
			}
			const prevValue = currentValue;
			currentValue = nextValue;
			notify(nextValue, prevValue);
		},
		update(setterFn: UpdateFn<Value>) {
			const prevValue = currentValue;
			const nextValue = setterFn(currentValue);
			currentValue = nextValue;
			notify(nextValue, prevValue);
		},
		sub(subscriber: Subscriber<Value>) {
			if (!subscriber || typeof subscriber !== "function") {
				throw new Error(`Couldn't add charm sub: ${subscriber}`);
			}
			subscribers.add(subscriber);
		},
		unsub(subscriber: Subscriber<Value>) {
			if (!subscriber || typeof subscriber !== "function") {
				throw new Error(`Couldn't add charm sub: ${subscriber}`);
			}
			subscribers.delete(subscriber);
		},
		toString() {
			return `${config.debugLabel}:${charmId}: [${currentValue}]`;
		},
	};
};

export type Charm<Value> = ReturnType<typeof charm<Value>>;

export const useCharmValue = <Value>(charm: Charm<Value>): Value => {
	const [value, setValue] = useState(charm.get());

	useEffect(() => {
		const subscriber: Subscriber<Value> = (
			nextValue: Value,
			prevValue: Value,
		) => {
			setValue(nextValue);
		};
		charm.sub(subscriber);
		return () => charm.unsub(subscriber);
	});

	return value;
};

export const batch = async (fn: () => void) => {
	if (batching) {
		throw new Error("Another batching is already in the progress");
	}
	try {
		batching = [];
		await fn();
		for (const notification of batching) {
			await notification();
		}
	} finally {
		batching = undefined;
	}
};
