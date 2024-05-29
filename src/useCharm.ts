import { useEffect, useState } from "react";
import type { Charm, Subscriber } from "./charm";

export const useCharm = <Value>(charm: Charm<Value>) => {
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

  return [value, setValue];
};
