
let storeSeq = 0;

const createAtomStoreClosure = (storeSeq: number): AtomStore => {
  return {
    getStoreId() {
      return storeSeq;
    },
    atom2value: new Map<number, unknown>(),
  }
}

/**
 * Type of AtomStore
 */
export type AtomStore = {
  /**
   * 
   * @returns unique store id, number
   */
  getStoreId: () => number,
  /**
   * Map which binds atomId to the value of the Atom in the Store
   */
  atom2value: Map<number, unknown>
};

/**
 * @returns new AtomStore with unique storeId
 */
export const createAtomStore = (): AtomStore => {
  return createAtomStoreClosure(storeSeq++);
}


let defaultStore: undefined | AtomStore = createAtomStore();

/**
 * 
 * Don't use on server enviroment, e.g. SSR or SSG.
 * Multiple server requests should not use the same store.
 * Instead use:
 * - @see {@link disableDefaultStore}
 * - @see {@link AsyncLocalStorageAtomProvider} instead
 * - @see {@link setStoreProvider}
 * 
 * @returns default Store. Fine for browser frontend environment.
 */
export const getDefaultStore = (): AtomStore => {
  if (defaultStore === undefined) {
    throw new Error('default store was disable before. Use AtomProvider or execWithAtom')
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

let storeProvider = (): AtomStore => defaultStore as AtomStore;

/**
 * Returns new or existing Store. As an application developer, you don't have to use it. 
 * use `atom.get()`, `atom.set()`, `atom.update()` and `useValue()` functions instead.
 * 
 * @returns calls {@link storeProvider} function to create or use existing Store.
 */
export const getStore = (): AtomStore => {
  return storeProvider()
}

/**
 * 
 * ```
 *   disableDefaultStore()
 *   setStoreProvider(asyncLocalStorageStoreProvider)
 *   const page1 = execWithAtom(createAtomStore(), () => {
 *     const comp = <Comp />
 *     aAtom.set(10);
 *     return renderToString(comp)
 *   })
 *   const page2 = execWithAtom(createAtomStore(), () => {
 *     const comp = <Comp />
 *     aAtom.set(20);
 *     return renderToString(comp)
 *   })
 *   expect(page1).toEqual("<button>10</button>")
 *   expect(page2).toEqual("<button>20</button>")
 * 
 * ```
 * @param storeProviderParam function which return a AtomStore
 * for SSR and SSG must returns a new @see {@link AtomStore} instance
 * for browser frontend ok to return a default @see {@link AtomStore} instance
 */
export const setStoreProvider = (storeProviderParam: () => AtomStore): void => {
  storeProvider = storeProviderParam;
}
