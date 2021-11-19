import * as React from 'react'
import _ from 'lodash'
import ComponentTool from 'components/common/Component/Tool'
import { Contexts } from 'components/common/Component'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateComponent, selectResult, setResult } from 'store/slices/survey'
import type { OnChangeInput, Component } from 'common/types'

type ResultToolProps = {
    surveyId?: string
    resultId?: string
}

export default function ResultTool(props: ResultToolProps) {
    const dispatch = useAppDispatch()

    const { surveyId, resultId } = props

    const result = useAppSelector(selectResult(resultId))
    const { bgcolor } = result ?? {}

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

        if (surveyId && resultId && idPath && component) {
            dispatch(
                updateComponent({
                    surveyId,
                    resultId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    const handleChangePage: OnChangeInput = (event) => {
        const { name, value } = event.target
        if (surveyId && resultId) {
            const newValue = { [name]: value }
            dispatch(
                setResult({
                    surveyId,
                    resultId,
                    newValue,
                })
            )
        }
    }

    const handleDelete = () => {
        if (surveyId && resultId && idPath && component) {
            dispatch(
                updateComponent({
                    surveyId,
                    resultId,
                    idPath,
                    newValue: component,
                    deleted: true,
                })
            )
        }
    }

    return (
        <ComponentTool
            page={{ bgcolor }}
            component={component}
            onChange={handleChange}
            onDelete={handleDelete}
            handleChangePage={handleChangePage}
        />
    )
}
