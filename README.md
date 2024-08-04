# What is Inert

Inert is an atomic state management library for React.

Latest documentation is available at https://jsr.io/inert/doc

```jsx

// counterAtom.ts 

const counterAtom = atom(0);

export const useCounter = () => useValue(counterAtom);
export const inc = () => counterAtom.update(prev => prev + 1);

// Counter.tsx

const Counter = () => {
  const counter = useCounter();

  return <button onclick={inc}>
    clicked {counter} times
  </button>
}

```

# State management best practices

## Atoms stay protected

Notice that `counterAtom` is not exported directly. 
This way we avoid unexpected direct modifications of the atom we created.

Instead, we create and expose micro-API to interact with the atom. 

## useCounter

`useCounter()` is extremly simple to use: it only does two things.

First, it returns the value of the current value of the counter.

Second, as any React hook, it subscribes the component to changes of the counter. 
So, when a counter changes then the components re-renders. 

## Avoid setter callback hooks

Notice, there is no `setCounter` function returned by the useValue hook. 
One of the distiguishing features of Inert is that your Component doesn't 
have to subscribe to the changes of the hooks. 

You can update Atom value by simple functions. 
You don't need to call the hook to create new function every render. 

There several benefits to it:
- component doesn't have to re-render if they use just the update callbacks
- with less re-renders, the app gets better performance
- you don't have to write `useCallback`, `useMemo` and other caching code for your update callbacks. 
- you avoid complicated cache callback bugs of `useEffect` and event listeners.
- you write less code, and your code is more readable

So, this way the only case your components re-render is the actual 
change of the atom they implicitly subscribed to using the `useValue` hook.

### How update callbacks work internally

Modern state management libaries, in addition to managing front-end state have to provide compatibility 
with Server-Side Rendering (SSR) and Server-Side Generation (SSG) rendering. In this mode, the page of 
the application are rendered in-parallel. This way every atom sits in the memory of the node application 
in multiple instances, one per every page being rendered. A specific state of all atoms and variables
required to render a single page is called Store.

Let's look at the example of a todo app which uses server-side rendering. 
When users request of the app simultateously request their todo-list page at the same time then their todo-list pages render 
separately and in parallel. One page and one store for every single user request. For different user the page has different data to show. 
But, the nodejs application has single memory space where it creates atoms, functions and other variables. Store

To distinguish page renders, tools like redux, recoil, jotai use ReactContext-based approach.
They use ReactContext providers at the root of the render tree and then use ReactContext on the leaves of the render tree.
This is why they force users to create callbacks using hooks in order to pass the rendering context to the hooks.

Unlike other libraries, Inert is using `AsyncLocalStorage` to pass rendering context to the callbacks and other functions. 
This way Inert stay independent from the `ReactContext` and does not require developers to write hooks for callbacks.

###


## Best practices, enabled

### Don't Repeat Yourself


### Data consistancy

When you don't expose raw set-state API to the world, your atoms transition from one meaningful state to the another.
There is no transitional or partially correct state of the atoms.

No arbitrary code is able to modify the state of your atoms. 

When you refactor you code or fix a bug, you are certain that you only have a single place to make change to or to review.

### Composing interactions

Quite often you need to perform multiple state changes per single action of the user. 
For example, when user creates a new slide then they expect that:
- (1) a new slide appears in the list of the slides
- (2) and new slide becomes selected in the list of the slides

The code to perform these two actions together is actually simple and familiar function composition:

```jsx
// file: slide-commands.ts

import { createNewEmptyAfterCurrentSlide } from "@state/slideList"
import { switchToNextSlide } from "@state/slideList"


const createNewSlideAfterCurrentSlide = () => {
  createNewEmptyAfterCurrentSlide();
  switchToNextSlide();
}

```

### Self-documenting functions

A JavaScript function declaration is a great descriptor for the action it performs. 
Moreover, it is obvious and familiar documentation of how to use it. 

When you declare your actions as functions, you automatically get:
- descriptive function name
- descriptive list of parameters
- descriptive type of parameters
- optional, js-doc.

And you lose this clarity when you are forced to:
- create lists of strings for names of actions
- implement switch/case clauses
- write "reducer" code
- wrap actions into hooks, `useMemo` or `useCallback`

### Manageable modifications



## Application layers

For larger project, mc recommends to split state operation and user actions code into two separate layers.


### State actions layer

The state actions are simple JavaScript functions on top of the state atoms.

The state actions code knows nothing about user actions, DOM, UI, HTML and Components. 

This layer contains all the business logic of application and it stays easy-to-test.

### User interface commands

User interface commands are build on top of state actions. 

User interface commands know all about the hovers, mousedowns, clicks, drags, keypresses, onChanges
of your application and make it smooth for users.

This way, all the UI-complication doesn't get mixed up with the business logic.

For even larger projects it might make sense to move state actions of a specific business domain to a dedicated workspace package.


# Derived atoms

```jsx

// word.ts 

const wordAtom = atom("compatibility");
const lettersAtom = derivedAtom(wordAtom, (word) => word.length, NeverSet)

export const useWord = () => useValue(wordAtom)
export const setWord = atomSetter(wordAtom)

export const useLetters = () => useValue(lettersAtom)


// Counter.tsx

const WordAndLetters = () => {
  const word = useWord();
  const letters = useLetters();

  return <>
    <p>
      <input onChange={e => setWord(e.target.value)}/>
    </p>
    <p>
      Word "{word}" contains {letters} letters.
    </p>
  </>    
}

```

## Split array atoms


```jsx
import { expect, mock, test } from "bun:test";
import { splitAtom } from "../src/arrays";
import { atom, type Atom } from "../src/inert";

test("atomList does not change when single value changes", () => {
  const arrayAtom = atom([10, 20]);
  const splitArrayAtom = splitAtom(arrayAtom);

  const atom0: Atom<number> = splitArrayAtom.get()[0];
  const atom1: Atom<number> = splitArrayAtom.get()[1];

  const nopFn = () => { }
  const subAtomMock = mock(nopFn as any)
  const sub0 = mock(nopFn as any)
  const sub1 = mock(nopFn as any)

  /// test


  splitArrayAtom.sub(subAtomMock)
  atom0.sub(sub0);
  atom1.sub(sub1);

  atom0.set(0);

  expect(sub0).toHaveBeenCalledTimes(1);

  expect(sub1).toHaveBeenCalledTimes(0);

  expect(subAtomMock).toHaveBeenCalledTimes(0);
});

```

# Using Provider for SSR

```jsx

const aAtom = atom(1);

const Comp = ({}) => {
  const value = useValue(aAtom)
  return <button>
    {value}
  </button>
}


test("render two pages at the same time", () => {
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
});

```

# Install

```sh

npx jsr add inert

# or

bunx 

# or

deno add inert

```

This command will add the following line to your `package.json` file

```json
{
  //in package.json, 
  "inert": "npm:@jsr/kaigorod__inert",
}
```


```
import { atom, atomGetter, atomSetter, useValue } from "atom";

const isImageSearchOnAtom = atom(false);

export const useIsImageSearchOn = () => useValue(isImageSearchOnAtom);
export const setIsImageSearchOn = atomSetter(isImageSearchOnAtom);
```




# Inspiration
Inert is inspired by recoil and jotai state management libraries.

# Links

- Github Repo https://github.com/kaigorod/inert
- Deno Package https://jsr.io/inert
