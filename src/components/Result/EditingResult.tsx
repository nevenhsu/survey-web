import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import User from 'utils/user'
import ThemeProvider from 'theme/ThemeProvider'
import { ComponentContext } from 'components/Editor/ResultForm/ComponentProvider'
import { ComponentList, getComponent } from 'components/common/ViewComponent'
import { getDefaultComponent, setId } from 'utils/helper'
import { useAppDispatch } from 'hooks'
import { updateComponent, setResult } from 'store/slices/editor'
import { ComponentType } from 'common/types'
import type { Result } from 'common/types'

type EditingQuizProps = {
    formId?: string
    result?: Result
}

export default function EditingResult(props: EditingQuizProps) {
    const dispatch = useAppDispatch()

    const {
        setComponent,
        idPath = [],
        setIdPath,
    } = React.useContext(ComponentContext)

    const { formId, result } = props
    const { id: resultId, components = [] } = result ?? {}

    const [selectedId, setSelectedId] = React.useState<string>('')

    const selectedComponent = React.useMemo(() => {
        return getComponent(components, [...idPath, selectedId])
    }, [selectedId, idPath, components])

    const handleAdd = (idPath: string[], type: ComponentType) => {
        if (formId && resultId) {
            const newValue = getDefaultComponent(type)
            dispatch(updateComponent({ formId, resultId, idPath, newValue }))
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (formId && resultId && selectedComponent) {
            let val: any = value === '' ? undefined : value
            val = Number(val) || val

            const newValue = {
                ...selectedComponent,
                [name]: val,
            }
            dispatch(updateComponent({ formId, resultId, idPath, newValue }))
        }
    }

    React.useEffect(() => {
        if (components[0]) {
            setSelectedId(components[0].id)
        }
    }, [])

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
                formId &&
                resultId &&
                _.isArray(componentsFormat) &&
                componentsFormat.length
            ) {
                // TODO: preserve card components
                dispatch(
                    setResult({
                        formId,
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
                    setSelectedId('')
                    if (setIdPath) {
                        setIdPath([])
                    }
                }}
                sx={{
                    backgroundColor: 'common.white',
                }}
            >
                <Box onClick={(e) => e.stopPropagation()}>
                    <ComponentList
                        components={components}
                        idPath={[]}
                        selectedComponent={selectedComponent}
                        onAdd={handleAdd}
                        onSelect={(component, idPath: string[]) => {
                            setSelectedId(component.id)
                            if (setIdPath) {
                                setIdPath(idPath)
                            }
                        }}
                        onChange={handleChange}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    )
}
