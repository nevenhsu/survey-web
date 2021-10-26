import * as React from 'react'
import type { Component } from 'common/types'

type ComponentContextType = {
    component?: Component
    setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>
    idPath?: string[]
    setIdPath?: React.Dispatch<React.SetStateAction<string[] | undefined>>
    selectedId?: string
    setSelectedId?: React.Dispatch<React.SetStateAction<string | undefined>>
    reset?: () => void
}

export const ComponentContext = React.createContext<ComponentContextType>({})

export default function ComponentProvider(props: React.PropsWithChildren<{}>) {
    const [component, setComponent] = React.useState<Component>()
    const [idPath, setIdPath] = React.useState<string[]>()
    const [selectedId, setSelectedId] = React.useState<string>()

    const reset = () => {
        setComponent(undefined)
        setSelectedId(undefined)
        setIdPath([])
    }

    const value = React.useMemo(
        () => ({
            component,
            setComponent,
            idPath,
            setIdPath,
            selectedId,
            setSelectedId,
            reset,
        }),
        [component, idPath, selectedId]
    )

    return (
        <ComponentContext.Provider value={value}>
            {props.children}
        </ComponentContext.Provider>
    )
}
