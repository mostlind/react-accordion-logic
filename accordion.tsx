import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  Context,
  ReactNode,
  useReducer,
  Dispatch
} from "react";

/**
 * typescript doesn't support having symbol keys in it's object index syntax
 * @example type ObjWithSymbolKeys = {[key: symbol]: any} // doesn't commpile
 * this function tells typescript to treat the symbol as a string for object indexing purposes
 */
function symbolToString(id: symbol) {
  return (id as unknown) as string;
}

const setAllVals = (obj: { [key: string]: any }, val: any) =>
  Object.keys(obj)
    .map(key => ({
      [key]: val
    }))
    .reduce((a, b) => Object.assign(a, b), {});

export type ToggleStrategy = (
  state: { [key: string]: boolean },
  id: keyof typeof state
) => { [key: string]: boolean };

export const EXLUSIVE_OPEN: ToggleStrategy = (state, id) => ({
  ...setAllVals(state, false),
  [id]: !state[id]
});

export const SIMPLE_TOGGLE: ToggleStrategy = (state, id) => ({
  ...state,
  [id]: !state[id]
});

type Action =
  | { type: "register"; id: symbol }
  | { type: "unregister"; id: symbol }
  | { type: "toggle"; id: symbol };

const reducer = (toggleStrategy: ToggleStrategy) => (
  state: { [key: string]: boolean },
  action: Action
) => {
  const index = symbolToString(action.id);
  switch (action.type) {
    case "register":
      return { ...state, [index]: state[index] || false };
    case "unregister":
      let { [index]: _val, ...registered } = state;
      return registered;
    case "toggle":
      return toggleStrategy(state, index);
    default:
      return {};
  }
};

const AccordionContext: Context<{
  dispatch: Dispatch<Action>;
  registeredChildren: { [key: string]: boolean };
}> = createContext({} as any);

interface ContainerProps {
  children: ReactNode;
  toggleStrategy?: ToggleStrategy;
}
function Container({
  children,
  toggleStrategy = EXLUSIVE_OPEN
}: ContainerProps) {
  const [registeredChildren, dispatch] = useReducer(
    reducer(toggleStrategy),
    {}
  );

  return (
    <AccordionContext.Provider value={{ dispatch, registeredChildren }}>
      {children}
    </AccordionContext.Provider>
  );
}

interface RowProps {
  children: (props: { toggleOpen: () => void; isOpen: boolean }) => JSX.Element;
}
function Row({ children }: RowProps) {
  const { dispatch, registeredChildren } = useContext(AccordionContext);
  const [id] = useState(Symbol());
  const toggleOpen = () => dispatch({ type: "toggle", id });
  const isOpen = registeredChildren[symbolToString(id)];

  useEffect(() => {
    dispatch({ type: "register", id });
    return () => dispatch({ type: "unregister", id });
  }, [id]);

  return children({ toggleOpen, isOpen });
}

export const Accordion = { Container, Row };
