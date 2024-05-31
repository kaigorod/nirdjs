import type { FunctionComponentElement } from "react"
  

export const CharmProvider = ({
    children,
    store,
  }: {
    children?: ReactNode
    store?: Store
  }): FunctionComponentElement<{ value: Store | undefined }> => {

  AsyncLocalStorage

    return createElement(
      StoreContext.Provider,
      {
        value: store || storeRef.current,
      },
      children,
    )
  }
  