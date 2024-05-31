import { test } from "bun:test";
import { CharmProvider } from "../CharmProvider";
import { charm, useCharmValue } from "../charm";

const aCharm = charm(1);

const Comp = ({ }) => {
  const value = useCharmValue(aCharm)
  return <button onClick={() => aCharm.update(val => val + 1)}>
    {value}
  </button>
}


test("render two pages at the same time", () => {

  const page1 = <CharmProvider><Comp /><CharmProvider>;
    const page2 = <CharmProvider><Comp /><CharmProvider>;



});
