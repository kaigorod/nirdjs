# Atom.js: Graceful State Management for React

Atom.js is a sophisticated state management library specifically designed to handle React state with atomic precision and clear separation of concerns.

## Features
- **Atomic State Management**: Work with granular pieces of state.
- **Derived State**: Easily derive states based on other states.
- **SSR and SSG Support**: Efficient compatibility with server-side rendering and generation.
- **Batch Updates**: Group multiple state changes.
- **Performance Optimized**: Minimizes unnecessary renders.
- **Context-free Updates**: Use providers to manage state without React context messiness.

## Installation

To install Atom.js, run the following command in your project directory:

```bash
npm install atom
```

## Usage

1. **Create a Atom:**

   Start by creating a atom which holds your data.

   ```typescript
   import { atom } from 'inert';

   const counterAtom = atom(0);
   ```

2. **Access and Update Atom in Components:**

   Use `useValue` to access and subscribe to changes in React components.

   ```jsx
   import { useValue, atomSetter } from 'atom';
   
   const CounterComponent = () => {
       const count = useValue(counterAtom);
       const increment = () => atomSetter(counterInert)(count + 1);

       return <button onClick={increment}>Count is: {count}</button>;
   };
   ```

3. **Derive State:**

   Create a derived state based on other atoms.

   ```typescript
   import { derive, NeverSet } from 'inert';

   const doubleCountAtom = derive(counterAtom, count => count * 2, NeverSet);
   ```

## Code Examples

### Basic Atom Usage

```typescript
import { atom, useValue } from 'atom';

const messageAtom = atom("Hello, Atom!");

function App() {
    const message = useValue(messageAtom);

    return <div>{message}</div>;
}
```

### Using Derived Atoms

```typescript
import { atom, derive, useValue, NeverSet } from 'atom';

const originalAtom = atom(10);
const derivedAtom = derive(originalAtom, value => value * 2, NeverSet);

function DerivedExample() {
    const derivedValue = useValue(derivedAtom);
    return <p>Derived Value: {derivedValue}</p>;
}
```

## Testing

Atom.js is unit tested using Jest. To run the tests:

```bash
npm test
```

You can also write additional tests for derived states or batch updates:

```typescript
import { atom, arrayEltAtom, batch } from 'atom';

// Test batch updates
test('batch update functionality', async () => {
    const arrayAtom = atom([0, 1, 2]);
    await batch(() => {
        arrayEltAtom(arrayAtom, 1)(10);
    });
    expect(arrayAtom.get()[1]).toBe(10);
});
```

## Contribution

Contributions are welcome. Please fork the [GitHub repository](https://github.com/kaigorod/atom), make your changes, and submit a pull request.

## License

Atom.js is [Apache-2.0 licensed](https://opensource.org/licenses/Apache-2.0). 

Full documentation, including more examples and API description, can be found in the project's [online docs](https://jsr.io/atom/doc).