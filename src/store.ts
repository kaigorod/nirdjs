
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

export const getDefaultStore = (): CharmStore => {
  if (defaultStore === undefined) {
    throw new Error('default store was disable before. Use CharmProvider or execWithCharm')
  }
  return defaultStore;
}

/**
 * Use this in Server-Side-Rendering environment to catch situations 
 * when CharmProvider is missing
 */
export const disableDefaultStore = (): void => {
  defaultStore = undefined
}

let storeProvider = (): CharmStore => defaultStore as CharmStore;

export const getStore = (): CharmStore => {
  return storeProvider()
}

export const setStoreProvide = (storeProviderParam: () => CharmStore): void => {
  storeProvider = storeProviderParam;
}
