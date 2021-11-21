import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import User from 'utils/user'
import ThemeProvider from 'theme/ThemeProvider'
import { Contexts } from 'components/common/Component'
import { ComponentList, getComponent } from 'components/common/Component'
import { getDefaultComponent, setId, toNumOrStr } from 'utils/helper'
import { useAppDispatch } from 'hooks'
import { updateComponent, setResult } from 'store/slices/survey'
import { ComponentType } from 'common/types'
import type { Component, Result } from 'common/types'

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
    const { id: resultId, components = [], bgcolor } = result ?? {}

    const selectedComponent = React.useMemo(() => {
        return getComponent(components, [...idPath, selectedId])
    }, [selectedId, idPath, components])

    const handleAdd = (idPath: string[], type: ComponentType) => {
        if (surveyId && resultId) {
            const newValue = getDefaultComponent(type)
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (surveyId && resultId && selectedComponent) {
            const val = toNumOrStr(value)

            const newValue = {
                ...selectedComponent,
                [name]: val,
            }
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

    React.useEffect(() => {
        if (!selectedId && components[0] && setSelectedId) {
            setSelectedId(components[0].id)
        }
    }, [selectedId, components])

    // copy components from local storage
    React.useEffect(() => {
        const user = User.getInstance()
        if (components.length) {
            const componentsFormat = cleanValue(components)
            user.setValue({ components: componentsFormat })
        } else {
            const { components: componentsFormat = [] } = user.getValue()
            if (
                surveyId &&
                resultId &&
                _.isArray(componentsFormat) &&
                componentsFormat.length
            ) {
                const newComponents = setNewIds(componentsFormat)

                dispatch(
                    setResult({
                        surveyId,
                        resultId,
                        newValue: {
                            components: newComponents,
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
            >
                {Boolean(resultId) ? (
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
                ) : (
                    <Typography
                        variant="h6"
                        sx={{
                            py: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        請先選擇一個結果
                    </Typography>
                )}
            </Box>
        </ThemeProvider>
    )
}

function cleanValue(components: Component[]) {
    return components.map((el) => {
        const { components } = el
        const newVal: { [key: string]: any } = {}
        _.forEach(el, (val, key) => {
            if (_.includes(['value', 'link'], key)) {
                newVal[key] = ''
            } else if (
                key === 'components' &&
                components &&
                components.length > 0
            ) {
                newVal.components = cleanValue(components)
            } else {
                newVal[key] = val
            }
        })
        newVal.id = setId()
        return newVal as Component
    })
}

function setNewIds(components: Component[]) {
    return components.map((el) => {
        const { components } = el
        const newVal = { ...el }
        if (components && components.length > 0) {
            newVal.components = setNewIds(components)
        }
        newVal.id = setId()
        return newVal as Component
    })
}
