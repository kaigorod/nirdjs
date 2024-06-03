# State Management Best Practices


```jsx

// counterCharm.ts 

const counterCharm = charm(0);

export const useCounter = () => useCharm(counterCharm);
export const inc = counterCharm.update(prev => prev + 1);

// Counter.tsx

const Counter = () => {
  const counter = useCounter();

  return <button onclick={inc}>
    clicked {counter} times
  </button>
}

```

## Atoms stay protected

Notice that `counterCharm` is not exported directly. 
This way we avoid un-expected direct modifications of the atom we created.

Instead, we create and expose micro-API to interact with the particle. 

## useCounter

`useCounter()` is extremly simple to use, it does two things. 

First, it returns the value of the current value of the counter.

Second, as any React hook, it subscribes the component to changes of the counter. 
So, when a counter changes then the components re-renders. 

## No setter function hook

Notice, where is no `setCounter` function returned by the useCharm hook. 
One of the distiguishing feature of Charm is that your Component doesn't 
have to subscribe to the changes of the hooks. 

You can update Charm value from simple functions. 
You don't need to call hook to create function on every render. 

There several benefit for this:
- component doesn't have to re-render if they use just the update callbacks
- with less re-renders the app is getting better performance
- you don't have to write useCallback, useMemo and other cache code for you update callbacks. 
- you avoid having complicate cached callback bugs with useEffect and event listeners.
- you write less code, and your code is more readable

So, this way the only case your components got re-render is the actual 
change of the atom they implicitly subscribed to using the use-Charm hook.

### How update callbacks work internally

Modern state management libaries, in addition to managing front-end state have to provide compatibility 
with Server-Side Rendering (SSR) and Server-Side Generation (SSG) rendering. In this mode, the page of 
the application are rendered in-parallel. This way every atom sits in the memory of the node application 
in multiple instances, one per every page being rendered. A specific state of all the atom and variables which is
required to render a single page call Store.

Let's look at the example of a todo app which uses server-side rendering. 
When users request of the app simultateously request their todo-list page at the same time then their todo-list pages render 
separately and in parallel. One page and one store for every single user request. For different user the page has different data to show. 
But, the nodejs application has single memory space where it creates atoms, functions and other variables. Store

To distinguish page renders tools like redux, recoil, jotai use
ReactContext-based approach. They use ReactContext providers at the root of the render tree and then use ReactContext 
on the leaves of the render tree. This why are force to create callback using hooks in order to pass the rendering context to the hooks.

Unlike other libs, Charm is using AsyncLocalStorage to pass rendering context to the callbacks and other functions. 
This way Charm stay independant from React context and does not require developers to write hooks for callbacks.

###


## Best practices, enabled

### Don't Repeat Yourself


### Data consistancy

When you don't expose raw set-state API to world your atoms transition 
from one meanigful to another meaningful state. There is not transional or partially correct state of the atoms.

No orbitrary code is able to modify the state of your atoms. 

When you refactor you code or fixing a bug then you are certain you have only single place to make change to or review.

### Compounding interactions

Quite often you need to perform multiple state changes per single use action. 
For example, when a user creates a new slide then they expect that:
- (1) a new slide appears in the list of the slides
- (2) and new slide becomes selected in the list of the slides

The code to perform these two actions together is actuall, a very simple and familiar function composition:

```ts
// file: slide-commands.ts

import { createNewEmptyAfterCurrentSlide } from "@state/slideList"
import { switchToNextSlide } from "@state/slideList"


const createNewSlideAfterCurrentSlide = () => {
  createNewEmptyAfterCurrentSlide();
  switchToNextSlide();
}

```

### Self-documenting

A javascript function declaration is a great descriptor of the action it performs. 
And it is obvious and familiar documentation of how to use it. 


When you declare your action as functions you provide
- descriptive function name
- descriptive list of parameters
- descriptive type of parameters
- optional, js-doc.

You loose these clear descriptions when you are forced to:
- create lists of string of the name of the actions
- implement switch/case clauses
- have "reducer" code
- wrap actions into hooks code
- wrap actions into useMemo, useCallback code 

### Manageable modifications



## Application layers

For larger project, mc recommends to split state operation and user actions code into two separate layers.


### State actions layer

The state actions are simple javascript functions on top of the state particles.

The state actions code knows nothing about user actions, DOM, UI, HTML and Components. 

This layer contains all the business logic of application and it stays easy-to-test.

### User interface commands

User interface commands are build on top of state actions. 

User interface commands know all about the hovers, mousedowns, clicks, drags, keypresses, onChanges,
of your application and make it smooth for users.

This way, all the UI-complications don't get mixed up with the business logic.

For even larger projects it might make sense to move state actions of a specific business domain to a dedicated workspace package.







