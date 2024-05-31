
let storeSeq = 0;

const createCharmStoreClosure = (storeSeq: number) => {
  return {
    getStoreId() {
      return storeSeq;
    },
    charm2value: new Map<number, unknown>()
  }
}

export type Store = ReturnType<typeof createCharmStoreClosure>

export const createCharmStore = () => {
  return createCharmStoreClosure(storeSeq++);
}

type BoundCharm = {

}
export const bindCharm = (store: Store,): BoundCharm => {
  return
}