import { Fragment, createElement, type FunctionComponentElement, type ReactNode } from "react";
import { createAtomStore, type AtomStore } from "../store";

import { AsyncLocalStorage } from "node:async_hooks";


const asyncLocalStorage = AsyncLocalStorage ? new AsyncLocalStorage<AtomStore>() : undefined as unknown as AsyncLocalStorage<AtomStore>;

export const asyncLocalStorageStoreProvider = (): AtomStore => {
  const store = asyncLocalStorage?.getStore();
  return store as AtomStore;
}

export const execWithAtom = (store: AtomStore, fn: any) => {
  return asyncLocalStorage.run(store, fn);
}

export const AsyncLocalStorageAtomProvider = ({
  children,
  store,
}: {
  children?: ReactNode
  store?: AtomStore
}): FunctionComponentElement<{}> => {

  const theStore = store || createAtomStore()
  return execWithAtom(theStore, () => {
    return createElement(
      Fragment,
      {},
      children,
    )
  }) as unknown as FunctionComponentElement<{}>
}

