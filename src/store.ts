
let storeSeq = 0;

const createCharmStoreClosure = (storeSeq: number): CharmStore => {
  return {
    getStoreId() {
      return storeSeq;
    },
    charm2value: new Map<number, unknown>(),
  }
}

export type CharmStore = {
  getStoreId: () => number,
  charm2value: Map<number, unknown>
};

export const createCharmStore = (): CharmStore => {
  return createCharmStoreClosure(storeSeq++);
}


let defaultStore: undefined | CharmStore = createCharmStore();

/**
 * 
 * Don't use on server enviroment, e.g. SSR or SSG.
 * Multiple server requests should not use the same store.
 * Instead use:
 * 1) @see disableDefaultStore
 * 2) @see AsyncLocalStorageCharmProvider instead
 * 3) @see setStoreProvider
 * 
 * @returns default Store. Fine for browser frontend environment.
 */
export const getDefaultStore = (): CharmStore => {
  if (defaultStore === undefined) {
    throw new Error('default store was disable before. Use CharmProvider or execWithCharm')
  }
  return defaultStore;
}

/**
 * Use this in Server-Side-Rendering or Server-Side-Generator environments 
 * to avoid situations when default store is used.
 */
export const disableDefaultStore = (): void => {
  defaultStore = undefined
}

let storeProvider = (): CharmStore => defaultStore as CharmStore;

export const getStore = (): CharmStore => {
  return storeProvider()
}

/**
 * 
```
  disableDefaultStore()
  setStoreProvider(asyncLocalStorageStoreProvider)
  const page1 = execWithCharm(createCharmStore(), () => {
    const comp = <Comp />
    aCharm.set(10);
    return renderToString(comp)
  })
  const page2 = execWithCharm(createCharmStore(), () => {
    const comp = <Comp />
    aCharm.set(20);
    return renderToString(comp)
  })

  expect(page1).toEqual("<button>10</button>")
  expect(page2).toEqual("<button>20</button>")
```
 * @param storeProviderParam function which return a CharmStore
 * for SSR and SSG must returns a new @see CharmStore instance
 * for browser frontend ok to return a default @see CharmStore instance
 */
export const setStoreProvider = (storeProviderParam: () => CharmStore): void => {
  storeProvider = storeProviderParam;
}
