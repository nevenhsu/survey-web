import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import { ComponentContext } from 'components/Editor/FinalForm/ComponentProvider'
import { ComponentList, getComponent } from 'components/common/ViewComponent'
import { getDefaultComponent } from 'utils/helper'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateFinalComponents, selectCurrentForm } from 'store/slices/editor'
import { ComponentType } from 'common/types'

export default function EditingFinal() {
    const dispatch = useAppDispatch()

    const form = useAppSelector(selectCurrentForm)
    const { id: formId, final } = form
    const { mode, components = [] } = final ?? {}

    const {
        setComponent,
        idPath = [],
        setIdPath,
        selectedId = '',
        setSelectedId,
        reset,
    } = React.useContext(ComponentContext)

    const selectedComponent = React.useMemo(() => {
        return getComponent(components, [...idPath, selectedId])
    }, [selectedId, idPath, components])

    const handleAdd = (idPath: string[], type: ComponentType) => {
        if (formId) {
            const newValue = getDefaultComponent(type)
            dispatch(updateFinalComponents({ formId, idPath, newValue }))
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (formId && selectedComponent) {
            let val: any = value === '' ? undefined : value
            val = Number(val) || val

            const newValue = {
                ...selectedComponent,
                [name]: val,
            }
            dispatch(updateFinalComponents({ formId, idPath, newValue }))
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
            sx={{
                backgroundColor: 'common.white',
            }}
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
    )
}
