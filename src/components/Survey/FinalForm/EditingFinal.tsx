import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import { Contexts } from 'components/common/Component'
import { ComponentList, getComponent } from 'components/common/Component'
import { getDefaultComponent, toNumOrStr } from 'utils/helper'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateFinalComponents, selectCurrentSurvey } from 'store/slices/survey'
import { ComponentType } from 'common/types'

export default function EditingFinal() {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectCurrentSurvey)
    const { id: surveyId, final, setting } = survey
    const { mode, components = [] } = final ?? {}
    const { maxWidth } = setting ?? {}

    const instance = Contexts.getInstance('final')
    const { Context } = instance.getValue()

    const {
        setComponent,
        idPath = [],
        setIdPath,
        selectedId = '',
        setSelectedId,
        reset,
    } = React.useContext(Context)

    const selectedComponent = React.useMemo(() => {
        return getComponent(components, [...idPath, selectedId])
    }, [selectedId, idPath, components])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (surveyId && selectedComponent) {
            const val = toNumOrStr(value)

            const newValue = {
                ...selectedComponent,
                [name]: val,
            }
            dispatch(updateFinalComponents({ surveyId, idPath, newValue }))
        }
    }

    React.useEffect(() => {
        if (components[0] && setSelectedId) {
            setSelectedId(components[0].id)
        }
    }, [])

    React.useEffect(() => {
        if (setComponent) {
            setComponent(selectedComponent)
        }
    }, [selectedComponent])

    return (
        <Box
            onClick={() => {
                if (reset) {
                    reset()
                }
            }}
        >
            <ComponentList
                components={components}
                idPath={[]}
                selectedComponent={selectedComponent}
                onSelect={(component, idPath: string[]) => {
                    if (setSelectedId) {
                        setSelectedId(component.id)
                    }

                    if (setIdPath) {
                        setIdPath(idPath)
                    }
                }}
                onChange={handleChange}
            />
        </Box>
    )
}
