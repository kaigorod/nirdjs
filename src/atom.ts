import { getStore } from "./store";

export type Subscriber<Value> = (nextValue: Value, prevValue: Value) => void;

let atomCounter = 0;

/**
 * Updater function. get @param @prev previous @param Value and return next value
 * @see {@link Atom.update}
 */
export type UpdateFn<Value> = (prev: Value) => Value;


/**
 * Callback function to skip notification of subscriber when @see {@link Atom} value has not actually changed.
 * Should return `true` to skip notification, just as `===`.
 * 
 * @see {@link Atom.update}
 * @see {@link Atom.sub}
 */
export type IgnoreWhenFn<Value> = (
  prevValue: Value,
  nextValue: Value,
) => boolean;

let batching: Array<() => void> | undefined = undefined;

/**
 * The configuration of a atom.
 */
export type AtomConfig<Value> = {
  /**
   * when previous and next value of the atom are the same, then
   * atom will not notify subscriber about the change.
   * This way you can avoid unnecessary recalculations and re-render of the UI.
   * 
   * defaults to @see {@link isIdentical}.
   * For better performance, when your state is not weird, provide with deepEquals implementation.
   */
  ignoreWhen?: IgnoreWhenFn<Value>;
  /**
   * Debug label of this atom
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
 * Can be used as @see {@link AtomConfig.ignoreWhen} value. 
 * Will cause atom to always notify subscriber even when the value has not bee not changed.
 */
export const neverIgnore = undefined;

/**
 * Used when no @see {@link atom()} config is provided
 */
export const defaultConfig = {
  /** 
   * @see {@link isIdentical} 
   */
  ignoreWhen: isIdentical,

  /** using "atom" as default */
  debugLabel: "atom",
  /** 
   * helps debugging situations when you `atom.set(fn)` by mistake
   * @default false
   */
  allowFnValue: false,
};

const getStoreAtomValue = <Value>(atom: Atom<Value>): Value => {
  return getStore().atom2value.get(atom.id()) as Value
}

const setStoreAtomValue = <Value>(atom: Atom<Value>, value: Value) => {
  return getStore().atom2value.set(atom.id(), value);
}

/**
 * Atom type. Hold a specific value in a @see {@link Store}
 */
export type Atom<Value> = {
  /**
   * returns number id of the atom. Doesn't change.
   */
  id: () => number,
  /**
   * 
   * @returns current value of the atom in the Store
   */
  get: () => Value,
  /**
   * Set new current value of the atom in the Store
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
   * Add new subscriber to this atom
   * @param subscriber 
   * @returns 
   */
  sub: (subscriber: Subscriber<Value>) => void,
  /**
   * Remove this subscriber from the atom
   * @param subscriber 
   * @returns 
   */
  unsub: (subscriber: Subscriber<Value>) => void,
  /** 
   * return unique string representation of this atom and it's state
  */
  toString: () => string
}
/**
 * Create new atom .
 * @param initialValue the value this atom gets initialy or resets to. Should be of type Value.
 * @param atomConfig optional
 * @returns new Atom.
 */
export const atom = <Value>(
  initialValue: Value,
  atomConfig?: AtomConfig<Value>,
): Atom<Value> => {
  // let currentValue: Value = initialValue;
  const subscribers = new Set<Subscriber<Value>>();
  const atomId = atomCounter++;

  const config = atomConfig
    ? { ...defaultConfig, ...atomConfig }
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

  const atom: Atom<Value> = {
    id() {
      return atomId;
    },
    get(): Value {
      return getStoreAtomValue<Value>(this);
    },
    set(nextValue: Value) {
      if (!config.allowFnValue && typeof nextValue === "function") {
        console.trace("atom set fn", config.debugLabel, nextValue);
        return;
      }
      const prevValue = this.get();
      setStoreAtomValue(this, nextValue);
      notify(nextValue, prevValue);
    },
    update(setterFn: UpdateFn<Value>) {
      const prevValue = this.get();
      const nextValue = setterFn(prevValue);
      this.set(nextValue);
    },
    sub(subscriber: Subscriber<Value>) {
      if (!subscriber || typeof subscriber !== "function") {
        throw new Error(`Couldn't add atom sub: ${subscriber}`);
      }
      subscribers.add(subscriber);
    },
    unsub(subscriber: Subscriber<Value>) {
      if (!subscriber || typeof subscriber !== "function") {
        throw new Error(`Couldn't add atom sub: ${subscriber}`);
      }
      subscribers.delete(subscriber);
    },
    toString() {
      return `${config.debugLabel}:${atomId}: [${this.get()}]`;
    },
  };

  atom.set(initialValue)

  return atom;
};

/**
 * Performs atom transation. Internally: 
 * 1) starts postponing all atom notifications
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
