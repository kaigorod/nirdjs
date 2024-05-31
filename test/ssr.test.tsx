import { test } from "bun:test";
import { charm, useCharmValue } from "../src/charm";
import { NodeJsCharmProvider } from "../src/ssr/AsyncLocalStorageCharmProvider";

const aCharm = charm(1);

const Comp = ({ }) => {
  const value = useCharmValue(aCharm)
  return <button onClick={() => aCharm.update(val => val + 1)}>
    {value}
  </button>
}


test("render two pages at the same time", () => {

  const page1 = <NodeJsCharmProvider><Comp /><NodeJsCharmProvider>;
    const page2 = <NodeJsCharmProvider><Comp /><NodeJsCharmProvider>;



});
