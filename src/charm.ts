import { useEffect, useState } from "react";
import { getStore } from "./store";

export type Subscriber<Value> = (nextValue: Value, prevValue: Value) => void;

let charmCounter = 0;

/**
 * Updater function. get @param @prev previous @param Value and return next value
 * @see {@link Charm.update}
 */
export type UpdateFn<Value> = (prev: Value) => Value;


/**
 * Callback function to skip notification of subscriber when @see {@link Charm} value has not actually changed.
 * Should return `true` to skip notification, just as `===`.
 * 
 * @see {@link Charm.update}
 * @see {@link Charm.sub}
 */
export type IgnoreWhenFn<Value> = (
  prevValue: Value,
  nextValue: Value,
) => boolean;

let batching: Array<() => void> | undefined = undefined;

/**
 * The configuration of a charm.
 */
export type CharmConfig<Value> = {
  /**
   * when previous and next value of the charm are the same, then
   * charm will not notify subscriber about the change.
   * This way you can avoid unnecessary recalculations and re-render of the UI.
   * 
   * defaults to @see {@link isIdentical}.
   * For better performance, when your state is not weird, provide with deepEquals implementation.
   */
  ignoreWhen?: IgnoreWhenFn<Value>;
  /**
   * Debug label of this charm
   */
  debugLabel?: string;
};

/**
 * a === b || (Number.isNaN(a) && Number.isNaN(b))
 * 
 * @param a 
 * @param b 
 * @returns true if and only if two values are identical
 */
export const isIdentical = <Value>(a: Value, b: Value): boolean =>
  a === b || (Number.isNaN(a) && Number.isNaN(b));

/**
 * Can be used as @see {@link CharmConfig.ignoreWhen} value. 
 * Will cause charm to always notify subscriber even when the value has not bee not changed.
 */
export const neverIgnore = undefined;

/**
 * Used when no @see {@link charm()} config is provided
 */
export const defaultConfig = {
  /** 
   * @see {@link isIdentical} 
   */
  ignoreWhen: isIdentical,

  /** using "charm" as default */
  debugLabel: "charm",
  /** 
   * helps debugging situations when you `charm.set(fn)` by mistake
   * @default false
   */
  allowFnValue: false,
};

const getStoreCharmValue = <Value>(charm: Charm<Value>): Value => {
  return getStore().charm2value.get(charm.id()) as Value
}

const setStoreCharmValue = <Value>(charm: Charm<Value>, value: Value) => {
  return getStore().charm2value.set(charm.id(), value);
}

/**
 * Charm type. Hold a specific value in a @see {@link Store}
 */
export type Charm<Value> = {
  /**
   * returns number id of the charm. Doesn't change.
   */
  id: () => number,
  /**
   * 
   * @returns current value of the charm in the Store
   */
  get: () => Value,
  /**
   * Set new current value of the charm in the Store
   * @param value 
   * @returns 
   */
  set: (value: Value) => void,
  /**
   * Perform update function to the result of get() and then set().
   * @param updateFn 
   * @returns 
   */
  update: (updateFn: UpdateFn<Value>) => void,
  /**
   * Add new subscriber to this charm
   * @param subscriber 
   * @returns 
   */
  sub: (subscriber: Subscriber<Value>) => void,
  /**
   * Remove this subscriber from the charm
   * @param subscriber 
   * @returns 
   */
  unsub: (subscriber: Subscriber<Value>) => void,
  /** 
   * return unique string representation of this particle and it's state
  */
  toString: () => string
}
/**
 * Create new charm particle.
 * @param initialValue the value this charm gets initialy or resets to. Should be of type Value.
 * @param charmConfig optional
 * @returns new Charm.
 */
export const charm = <Value>(
  initialValue: Value,
  charmConfig?: CharmConfig<Value>,
): Charm<Value> => {
  // let currentValue: Value = initialValue;
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

  const charm: Charm<Value> = {
    id() {
      return charmId;
    },
    get(): Value {
      return getStoreCharmValue<Value>(this);
    },
    set(nextValue: Value) {
      if (!config.allowFnValue && typeof nextValue === "function") {
        console.trace("charm set fn", config.debugLabel, nextValue);
        return;
      }
      const prevValue = this.get();
      setStoreCharmValue(this, nextValue);
      notify(nextValue, prevValue);
    },
    update(setterFn: UpdateFn<Value>) {
      const prevValue = this.get();
      const nextValue = setterFn(prevValue);
      this.set(nextValue);
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
      return `${config.debugLabel}:${charmId}: [${this.get()}]`;
    },
  };

  charm.set(initialValue)

  return charm;
};

/**
 * The usual React hook to get charm value and subscribes the caller Component.
 * Use it only in React functional components or other react hooks.
 * You are very welcome to create new React hooks using it. 
 * 
 * @param charm 
 * @returns current value of the @param charm, on every render
 */
export const useCharm = <Value>(charm: Charm<Value>): Value => {
  const [value, setValue] = useState(charm.get());

  useEffect(() => {
    const subscriber: Subscriber<Value> = (
      nextValue: Value,
      _prevValue: Value,
    ) => {
      setValue(nextValue);
    };
    charm.sub(subscriber);
    return () => charm.unsub(subscriber);
  });

  return value;
};

/**
 * Performs charm transation. Internally: 
 * 1) starts postponing all charm notifications
 * 2) calls await @param fn()
 * 3) performs all postponed notifications
 */
export const batch = async (fn: () => void): Promise<void> => {
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
