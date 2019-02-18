# A react component that encapsulates the logic of an accordion or tab like system

```javascript
<Accordion.Container>
  <Accordion.Row>
    {({ toggleOpen, isOpen }) => (
      <>
        <div className="accordion-row-header" onClick={toggleOpen}>
          {isOpen ? "click to close" : "click to open"}
        </div>
        {isOpen ? <p>some conditional content</p> : null}
      </>
    )}
  </Accordion.Row>
  <Accordion.Row>
    {({ toggleOpen, isOpen }) => (
      <>
        <div className="accordion-row-header" onClick={toggleOpen}>
          {isOpen ? "click to close" : "click to open"}
        </div>
        {isOpen ? <p>some conditional content</p> : null}
      </>
    )}
  </Accordion.Row>
</Accordion.Container>
```

# Components

## `Accordion.Container`

Context for container logic

### Props

- `toggleSrategy`: `(state: { [key: string]: boolean }, id: keyof typeof state) => { [key: string]: boolean }` - A function that is called when a row is toggled. Takes an object containing the rows and their toggle state, and the key for the row that triggered the toggle event. Returns the new state of the rows. Defaults to only allowing one row be open at a time.

- `children`: `any` - the children

## `Accordion.Row`

### Props

- `children`: `(toggleOpen: () => void, isOpen: boolean) => JSX.Element` - A render prop that passes the row's current open state, and a function to toggle that row

# Exported Types

## `ToggleStrategy`

The type of the `toggleStrategy` prop of the `Accordion.Container` component

# Constants

## `EXCLUSIVE_OPEN`: `ToggleStrategy`

Allows only one row to be open at a time. This is the default.

## `SIMPLE_TOGGLE`: `ToggleStrategy`

Will only toggle the state of the row that caused the toggle event. Leaves the other rows in the state that they were in previously
