import { useEffect, useState } from "react";

export const nano = <T>(i: T) => {
  let v = i;
  const subs = new Array<(n: T) => void>()

  return {
    get: () => v,
    set: (n: T)=> {
      if(v !== n) {
        v = n;
        subs.forEach(s => s(n))
      } 
    },
    sub: (s: (n: T)=> void) => subs.push(s),
    unsub: (s: (n: T)=> void) => subs.splice(subs.indexOf(s), 1)
  }
}

export const useNano = <T>(n: ReturnType<typeof nano<T>>): T => {
  const [value, setValue] = useState(n.get());

  useEffect(() => {    
    n.sub(setValue);
    return () => { n.unsub(setValue) }
  });

  return value;
};

