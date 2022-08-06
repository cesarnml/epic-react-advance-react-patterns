# Epic React - Advance React Patterns

## Lessons

### Lesson 01 - Context Module Functions

- *The Context Module Functions Pattern allows you to encapsulate a complex set of state changes into a utility function which can be tree-shaken and lazily loaded*
- Hot tip: `Context.displayName = 'MyContext'` to improve discoverability in DevTools
- Avoids the need to wrap exported helper function in `useCallback` and removes state update complexity from within component logic by encapsulating it in helper methods that are passed dispatch and data needed to update context state

### Lesson 02 - Compound Components

- *The Compound Components Pattern enables you to provide a set of components that implicitly share state for a simple yet powerful declarative API for reusable components.*
- Two parts two component components:
  - Parent component:
    - Parent `explictly` manages the state and passes it and updater methods to its children via a combination of `React.Children.map` and `React.cloneElement` API calls in order to implictly make the state and update methods available to its direct children
  - Children componets:
    - That indirectly consume state and methods that are managed by the parent
- Beware that `React.cloneElement` only works on React elements and not on native DOM elements (use `child.type` to override nasty error messages)

### Lesson 03 - Flexible Compound Components

- The Parent component passes the state and methods via Context for consumption by any of its children (not limited to direct children as lesson 02 approach)

### Lesson 04 - Props Collections and Getters

- *The Prop Collections and Getters Pattern allows your hooks to support common use cases for UI elements people build with your hook*
- `callAll` helper function takes an array of functions and calls them if they exist

```javascript
function callAll(...fns) {
  return (...args) => fns.forEach(fn => fn && fn(...args))
}
```

- A bit unclear on how the `args` work here


### Lesson 05 - State Reducer

- *The State Reducer Pattern inverts control over the state management of your hook and/or component to the developer using it so they can control the state changes that happen when dispatching events.*

### Lesson 06 - Control Props
