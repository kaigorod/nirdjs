import { expect, test } from "bun:test";
import { renderToString } from 'react-dom/server';
import { atom } from "../src/atom";
import { asyncLocalStorageStoreProvider, execWithAtom } from "../src/ssr/AsyncLocalStorageAtomProvider";
import { createAtomStore, disableDefaultStore, getDefaultStore, setStoreProvider } from "../src/store";
import { useValue } from "../src/useValue";

const aAtom = atom(1);

const Comp = ({ }) => {
  const value = useValue(aAtom)
  return <button>
    {value}
  </button>
}


test("render two pages at the same time", () => {
  const savedDefaultStore = getDefaultStore()
  disableDefaultStore()
  setStoreProvider(asyncLocalStorageStoreProvider)
  const page1 = execWithAtom(createAtomStore(), () => {
    const comp = <Comp />
    aAtom.set(10);
    return renderToString(comp)
  })
  const page2 = execWithAtom(createAtomStore(), () => {
    const comp = <Comp />
    aAtom.set(20);
    return renderToString(comp)
  })

  expect(page1).toEqual("<button>10</button>")
  expect(page2).toEqual("<button>20</button>")

  setStoreProvider(() => savedDefaultStore)
});

// FIXME test disableDefaultStore
// FIXME test with async



