
let storeSeq = 0;

const createCharmStoreClosure = (storeSeq: number): CharmStore => {
  return {
    getStoreId() {
      return storeSeq;
    },
    charm2value: new Map<number, unknown>(),
  }
}

/**
 * Type of CharmStore
 */
export type CharmStore = {
  /**
   * 
   * @returns unique store id, number
   */
  getStoreId: () => number,
  /**
   * Map which binds charmId to the value of the Charm in the Store
   */
  charm2value: Map<number, unknown>
};

/**
 * @returns new CharmStore with unique storeId
 */
export const createCharmStore = (): CharmStore => {
  return createCharmStoreClosure(storeSeq++);
}


let defaultStore: undefined | CharmStore = createCharmStore();

/**
 * 
 * Don't use on server enviroment, e.g. SSR or SSG.
 * Multiple server requests should not use the same store.
 * Instead use:
 * - @see {@link disableDefaultStore}
 * - @see {@link AsyncLocalStorageCharmProvider} instead
 * - @see {@link setStoreProvider}
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

/**
 * Returns new or existing Store. As an application developer, you don't have to use it. 
 * use `charm.get()`, `charm.set()`, `charm.update` and `useCharm` functions instead.
 * 
 * @returns calls {@link storeProvider} function to create or use existing Store.
 */
export const getStore = (): CharmStore => {
  return storeProvider()
}

/**
 * 
 * ```
 *   disableDefaultStore()
 *   setStoreProvider(asyncLocalStorageStoreProvider)
 *   const page1 = execWithCharm(createCharmStore(), () => {
 *     const comp = <Comp />
 *     aCharm.set(10);
 *     return renderToString(comp)
 *   })
 *   const page2 = execWithCharm(createCharmStore(), () => {
 *     const comp = <Comp />
 *     aCharm.set(20);
 *     return renderToString(comp)
 *   })
 *   expect(page1).toEqual("<button>10</button>")
 *   expect(page2).toEqual("<button>20</button>")
 * 
 * ```
 * @param storeProviderParam function which return a CharmStore
 * for SSR and SSG must returns a new @see {@link CharmStore} instance
 * for browser frontend ok to return a default @see {@link CharmStore} instance
 */
export const setStoreProvider = (storeProviderParam: () => CharmStore): void => {
  storeProvider = storeProviderParam;
}
