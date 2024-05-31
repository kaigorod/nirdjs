import { Fragment, createElement, type FunctionComponentElement, type ReactNode } from "react";
import { createCharmStore, getDefaultStore, type CharmStore } from "../store";

import { AsyncLocalStorage } from "node:async_hooks";


const asyncLocalStorage = AsyncLocalStorage ? new AsyncLocalStorage<CharmStore>() : undefined as unknown as AsyncLocalStorage<CharmStore>;

export const getStore = (): CharmStore => {
  const store = asyncLocalStorage?.getStore() || getDefaultStore();
  return store;
}

export const execWithCharm = (store: CharmStore, fn: any) => {
  return asyncLocalStorage.run(store, fn);
}

export const AsyncLocalStorageCharmProvider = ({
  children,
  store,
}: {
  children?: ReactNode
  store?: CharmStore
}): FunctionComponentElement<{}> => {

  const theStore = store || createCharmStore()
  return execWithCharm(theStore, () => {
    return createElement(
      Fragment,
      {},
      children,
    )
  }) as unknown as FunctionComponentElement<{}>

}

