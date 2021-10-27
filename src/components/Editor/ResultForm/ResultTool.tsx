import * as React from 'react'
import _ from 'lodash'
import ComponentViewTool from 'components/common/ComponentView/Tool'
import { Contexts } from 'components/common/ComponentView'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateComponent } from 'store/slices/editor'
import type { OnChangeInput, Component } from 'common/types'

type ResultToolProps = {
    formId?: string
    resultId?: string
}

export default function ResultTool(props: ResultToolProps) {
    const dispatch = useAppDispatch()

    const { formId, resultId } = props

    const instance = Contexts.getInstance('result')
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

        if (formId && resultId && idPath && component) {
            dispatch(
                updateComponent({
                    formId,
                    resultId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    const handleDelete = () => {
        if (formId && resultId && idPath && component) {
            dispatch(
                updateComponent({
                    formId,
                    resultId,
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
