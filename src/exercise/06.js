// Control Props
// http://localhost:3000/isolated/exercise/06.js

import {noop} from 'lodash'
import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  on: controlledOn,
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  readOnly = false,
  // 🐨 add an `onChange` prop.
  // 🐨 add an `on` option here
  // 💰 you can alias it to `controlledOn` to avoid "variable shadowing."
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // 🐨 determine whether on is controlled and assign that to `onIsControlled`
  // 💰 `controlledOn != null`
  const isOnControlled = controlledOn !== undefined
  const hasOnChange = onChange !== undefined
  const wasControlled = React.useRef(isOnControlled)
  console.log('wasControlled:', wasControlled.current)
  console.log('isOnControlled:', isOnControlled)
  console.log('hasOnChange:', hasOnChange)
  const on = isOnControlled ? controlledOn : state.on

  React.useEffect(() => {
    console.log('running effect')
    warning(
      !(isOnControlled && !hasOnChange && !readOnly),
      'Creating a read-only Toggle',
    )
    warning(
      !(!wasControlled && isOnControlled && hasOnChange),
      'Changing a uncontrolled component to controlled. devs behaving badly',
    )
    warning(
      !(wasControlled && !isOnControlled && hasOnChange),
      'Changing controlled to uncontrolled',
    )
    wasControlled.current = isOnControlled
  }, [hasOnChange, isOnControlled, readOnly])

  function dispatchWithOnChange(action) {
    if (!isOnControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
    // make these call `dispatchWithOnChange` instead
  }
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange}) {
  const {on, getTogglerProps} = useToggle({on: controlledOn, onChange})
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }

    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      {/* <div>
        <Toggle on={bothOn} />
      </div> */}
      <div>
        <button onClick={() => setBothOn()}>Uncontrol Toggle</button>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        {/* <Toggle on={bothOn} onChange={handleToggleChange} /> */}
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        {/* <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        /> */}
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
