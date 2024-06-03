import { expect, test } from "bun:test";
import { renderToString } from 'react-dom/server';
import { charm, useCharm } from "../src/charm";
import { asyncLocalStorageStoreProvider, execWithCharm } from "../src/ssr/AsyncLocalStorageCharmProvider";
import { createCharmStore, disableDefaultStore, getDefaultStore, setStoreProvider } from "../src/store";

const aCharm = charm(1);

const Comp = ({ }) => {
  const value = useCharm(aCharm)
  return <button>
    {value}
  </button>
}


test("render two pages at the same time", () => {
  const savedDefaultStore = getDefaultStore()
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

  setStoreProvider(() => savedDefaultStore)
});

// FIXME test disableDefaultStore
// FIXME test with async



