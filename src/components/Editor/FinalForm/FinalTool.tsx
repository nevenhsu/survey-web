import * as React from 'react'
import _ from 'lodash'
import ComponentViewTool from 'components/common/ComponentView/Tool'
import { Contexts } from 'components/common/ComponentView'
import { useAppDispatch } from 'hooks'
import { updateFinalComponents } from 'store/slices/editor'
import type { OnChangeInput, Component } from 'common/types'

type FinalToolProps = {
    formId?: string
}

export default function FinalTool(props: FinalToolProps) {
    const dispatch = useAppDispatch()

    const { formId } = props

    const instance = Contexts.getInstance('final')
    const { Context } = instance.getValue()

    const { component, idPath = [] } = React.useContext(Context)

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target

        let val: any = value === '' ? undefined : value
        val = Number(val) || val

        const newValue = {
            ...component,
            [name]: val,
        } as Component

        if (formId && idPath && component) {
            dispatch(
                updateFinalComponents({
                    formId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    const handleDelete = () => {
        if (formId && idPath && component) {
            dispatch(
                updateFinalComponents({
                    formId,
                    idPath,
                    newValue: component,
                    deleted: true,
                })
            )
        }
    }

    return (
        <ComponentViewTool
            component={component}
            onChange={handleChange}
            onDelete={handleDelete}
        />
    )
}
