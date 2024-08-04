import { useEffect, useState } from "react";
import type { Atom, Subscriber } from "./atom";

/**
 * The usual React hook to get atom value and subscribes the caller Component.
 * Use it only in React functional components or other react hooks.
 * You are very welcome to create new React hooks using it. 
 * 
 * @param atom 
 * @returns current value of the @param atom, on every render
 */
export const useValue = <Value>(atom: Atom<Value>) => {
  const [value, setValue] = useState(atom.get());

  useEffect(() => {
    const subscriber: Subscriber<Value> = (
      nextValue: Value,
      _prevValue: Value,
    ) => {
      setValue(nextValue);
    };
    atom.sub(subscriber);
    return () => atom.unsub(subscriber);
  });

  return value;
};
