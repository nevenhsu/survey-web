import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import User from 'utils/user'
import ThemeProvider from 'theme/ThemeProvider'
import { Contexts } from 'components/common/ComponentView'
import { ComponentList, getComponent } from 'components/common/ComponentView'
import { getDefaultComponent, setId } from 'utils/helper'
import { useAppDispatch } from 'hooks'
import { updateComponent, setResult } from 'store/slices/survey'
import { ComponentType } from 'common/types'
import type { Result } from 'common/types'

type EditingQuizProps = {
    surveyId?: string
    result?: Result
}

export default function EditingResult(props: EditingQuizProps) {
    const dispatch = useAppDispatch()

    const instance = Contexts.getInstance('result')
    const { Context } = instance.getValue()

    const {
        setComponent,
        idPath = [],
        setIdPath,
        selectedId = '',
        setSelectedId,
        reset,
    } = React.useContext(Context)

    const { surveyId, result } = props
    const { id: resultId, components = [] } = result ?? {}

    const selectedComponent = React.useMemo(() => {
        return getComponent(components, [...idPath, selectedId])
    }, [selectedId, idPath, components])

    const handleAdd = (idPath: string[], type: ComponentType) => {
        if (surveyId && resultId) {
            const newValue = getDefaultComponent(type)
            dispatch(
                updateComponent({
                    surveyId: surveyId,
                    resultId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (surveyId && resultId && selectedComponent) {
            let val: any = value === '' ? undefined : value
            val = Number(val) || val

            const newValue = {
                ...selectedComponent,
                [name]: val,
            }
            dispatch(
                updateComponent({
                    surveyId: surveyId,
                    resultId,
                    idPath,
                    newValue,
                })
            )
        }
    }

    React.useEffect(() => {
        if (!selectedId && components[0] && setSelectedId) {
            setSelectedId(components[0].id)
        }
    }, [selectedId, components])

    React.useEffect(() => {
        const user = User.getInstance()
        if (components.length) {
            const componentsFormat = components.map((el) => ({
                ...el,
                value: '',
            }))
            user.setValue({ components: componentsFormat })
        } else {
            const { components: componentsFormat = [] } = user.getValue()
            if (
                surveyId &&
                resultId &&
                _.isArray(componentsFormat) &&
                componentsFormat.length
            ) {
                // TODO: preserve card components
                dispatch(
                    setResult({
                        surveyId: surveyId,
                        resultId,
                        newValue: {
                            components: componentsFormat.map((el) => ({
                                ...el,
                                id: setId(),
                                components: _.map(el.components, (el) => ({
                                    ...el,
                                    id: setId(),
                                    components: [],
                                })),
                            })),
                        },
                    })
                )
            }
        }
    }, [components])

    React.useEffect(() => {
        if (setComponent) {
            setComponent(selectedComponent)
        }
    }, [selectedComponent])

    return (
        <ThemeProvider mode="light">
            <Box
                onClick={() => {
                    if (reset) {
                        reset()
                    }
                }}
                sx={{
                    backgroundColor: 'common.white',
                }}
            >
                <ComponentList
                    components={components}
                    idPath={[]}
                    selectedComponent={selectedComponent}
                    onAdd={handleAdd}
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
        </ThemeProvider>
    )
}
