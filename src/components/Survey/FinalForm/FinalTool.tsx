import * as React from 'react'
import _ from 'lodash'
import ComponentTool from 'components/common/Component/Tool'
import { Contexts } from 'components/common/Component'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    selectCurrentSurvey,
    updateFinalComponents,
    updateFinal,
} from 'store/slices/survey'
import type { OnChangeInput, Component } from 'common/types'

export default function FinalTool() {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectCurrentSurvey)
    const { id: surveyId, final } = survey ?? {}
    const { bgcolor } = final ?? {}

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

        if (surveyId && idPath && component) {
            dispatch(
                updateFinalComponents({
                    surveyId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    const handleChangePage: OnChangeInput = (event) => {
        const { name, value } = event.target
        if (surveyId) {
            const newValue = { [name]: value }
            dispatch(
                updateFinal({
                    surveyId,
                    newValue,
                })
            )
        }
    }

    const handleDelete = () => {
        if (surveyId && idPath && component) {
            dispatch(
                updateFinalComponents({
                    surveyId,
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
