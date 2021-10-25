import * as React from 'react'
import _ from 'lodash'
import ViewComponentTool from 'components/common/ViewComponentTool'
import { ComponentContext } from 'components/Editor/ResultForm/ComponentProvider'
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
    const { component, idPath = [] } = React.useContext(ComponentContext)

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target
        const newValue = {
            ...component,
            [name]: Number(value) || value || undefined,
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
        <ViewComponentTool
            component={component}
            onChange={handleChange}
            onDelete={handleDelete}
        />
    )
}
