
let storeSeq = 0;

const createCharmStoreClosure = (storeSeq: number) => {
  return {
    getStoreId() {
      return storeSeq;
    },
    charm2value: new Map<number, unknown>(),
  }
}

export type CharmStore = ReturnType<typeof createCharmStoreClosure>;

export const createCharmStore = () => {
  return createCharmStoreClosure(storeSeq++);
}


let defaultStore: undefined | CharmStore = createCharmStore();

export const getDefaultStore = (): CharmStore => {
  if (defaultStore === undefined) {
    throw new Error('disableDefaultStore has been called. Use CharmProvider or execWithCharm')
  }
  return defaultStore;
}

/**
 * Use this in Server-Side-Rendering environment to catch situations 
 * when CharmProvider is missing
 */
export const disableDefaultStore = () => {
  defaultStore = undefined
}
