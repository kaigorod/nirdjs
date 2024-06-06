# Charm.js: Graceful State Management for React

Charm.js is a sophisticated state management library specifically designed to handle React state with atomic precision and clear separation of concerns.

## Features
- **Atomic State Management**: Work with granular pieces of state.
- **Derived State**: Easily derive states based on other states.
- **SSR and SSG Support**: Efficient compatibility with server-side rendering and generation.
- **Batch Updates**: Group multiple state changes.
- **Performance Optimized**: Minimizes unnecessary renders.
- **Context-free Updates**: Use providers to manage state without React context messiness.

## Installation

To install Charm.js, run the following command in your project directory:

```bash
npm install @kaigorod/charm
```

## Usage

1. **Create a Charm:**

   Start by creating a charm which holds your data.

   ```typescript
   import { charm } from '@kaigorod/charm';

   const counterCharm = charm(0);
   ```

2. **Access and Update Charm in Components:**

   Use `useCharm` to access and subscribe to changes in React components.

   ```jsx
   import { useCharm, charmSetter } from '@kaigorod/charm';
   
   const CounterComponent = () => {
       const count = useCharm(counterCharm);
       const increment = () => charmSetter(counterCharm)(count + 1);

       return <button onClick={increment}>Count is: {count}</button>;
   };
   ```

3. **Derive State:**

   Create a derived state based on other charms.

   ```typescript
   import { derive, NeverSet } from '@kaigorod/charm';

   const doubleCountCharm = derive(counterCharm, count => count * 2, NeverSet);
   ```

## Code Examples

### Basic Charm Usage

```typescript
import { charm, useCharm } from '@kaigorod/charm';

const messageCharm = charm("Hello, Charm!");

function App() {
    const message = useCharm(messageCharm);

    return <div>{message}</div>;
}
```

### Using Derived Charms

```typescript
import { charm, derive, useCharm, NeverSet } from '@kaigorod/charm';

const originalCharm = charm(10);
const derivedCharm = derive(originalCharm, value => value * 2, NeverSet);

function DerivedExample() {
    const derivedValue = useCharm(derivedCharm);
    return <p>Derived Value: {derivedValue}</p>;
}
```

## Testing

Charm.js is unit tested using Jest. To run the tests:

```bash
npm test
```

You can also write additional tests for derived states or batch updates:

```typescript
import { charm, arrayEltCharm, batch } from '@kaigorod/charm';

// Test batch updates
test('batch update functionality', async () => {
    const arrayCharm = charm([0, 1, 2]);
    await batch(() => {
        arrayEltCharm(arrayCharm, 1)(10);
    });
    expect(arrayCharm.get()[1]).toBe(10);
});
```

## Contribution

Contributions are welcome. Please fork the [GitHub repository](https://github.com/kaigorod/charm), make your changes, and submit a pull request.

## License

Charm.js is [Apache-2.0 licensed](https://opensource.org/licenses/Apache-2.0). 

Full documentation, including more examples and API description, can be found in the project's [online docs](https://jsr.io/@kaigorod/charm/doc).