import * as React from 'react'
import type { Component } from 'common/types'

type ContextType = {
    component?: Component
    setComponent?: React.Dispatch<React.SetStateAction<Component | undefined>>
    idPath?: string[]
    setIdPath?: React.Dispatch<React.SetStateAction<string[] | undefined>>
    selectedId?: string
    setSelectedId?: React.Dispatch<React.SetStateAction<string | undefined>>
    reset?: () => void
}

type ProviderProps = { context: React.Context<ContextType> }

type Key = 'result' | 'final'

function ContextProvider(props: React.PropsWithChildren<ProviderProps>) {
    const { context } = props

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

    return <context.Provider value={value}>{props.children}</context.Provider>
}

export default class Contexts {
    private static instances: { [key: string]: Contexts } = {}
    private context: React.Context<ContextType>
    private provider: (
        props: React.PropsWithChildren<ProviderProps>
    ) => JSX.Element

    public static getInstance(key: Key) {
        if (!this.instances[key]) {
            this.instances[key] = new Contexts()
        }

        return this.instances[key]
    }

    private constructor() {
        this.context = React.createContext<ContextType>({})
        this.provider = ContextProvider
    }

    public getValue() {
        return { Context: this.context, Provider: this.provider }
    }
}
