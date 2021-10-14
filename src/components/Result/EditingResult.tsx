import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import AddIcon from 'mdi-react/AddIcon'
import { getDefaultComponent } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { addComponent, updateComponent } from 'store/slices/editor'
import { ComponentType } from 'common/types'
import type { Result, Component } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

type EditingQuizProps = {
    formId?: string
    result?: Result
}

const menuProps = {
    MenuProps: {
        PopoverClasses: {
            root: 'z-top',
        },
    },
}

const options = [
    { value: ComponentType.title, label: '標題' },
    { value: ComponentType.typography, label: '內文' },
    { value: ComponentType.image, label: '圖片' },
    { value: ComponentType.link, label: '超連結' },
    { value: ComponentType.clipboard, label: '剪貼簿' },
    { value: ComponentType.card, label: '卡片' },
]

const displayOptions = [
    { value: 'block', label: '獨立' },
    { value: 'inline-block', label: '行內' },
]

type StyledTextFieldProps = TextFieldProps & {
    value: string
    typoVariant?: Variant
}

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'typoVariant',
})<StyledTextFieldProps>(({ value, theme, typoVariant }) => ({
    '& input': {
        ...theme.typography[typoVariant ?? 'body1'],
        textAlign: 'center',
        minWidth: `${value?.length * 1.75}ch`,
    },
}))

const AddButton = (props: { onAdd: (type: ComponentType) => void }) => {
    const { onAdd } = props

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        type: ComponentType
    ) => {
        setAnchorEl(null)
        onAdd(type)
    }

    const open = Boolean(anchorEl)

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                新增元件
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {options.map((el) => (
                    <MenuItem
                        key={el.value}
                        onClick={(event) =>
                            handleMenuItemClick(event, el.value)
                        }
                    >
                        {el.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default function EditingResult(props: EditingQuizProps) {
    const dispatch = useAppDispatch()

    const { formId, result } = props
    const { id: resultId, components = [] } = result ?? {}

    const handleAdd: (value: ComponentType) => void = (type) => {
        const newValue = getDefaultComponent(type)
        if (formId && resultId) {
            dispatch(addComponent({ formId, resultId, newValue }))
        }
    }

    const renderView = (component: Component) => {
        return (
            <Tooltip
                title={renderTool(component)}
                placement="top"
                arrow
                sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }}
            >
                {renderComponent(component)}
            </Tooltip>
        )
    }

    const renderTool = (component: Component) => {
        const { id, type, display, align, width, height, fontSize, color } =
            component

        return (
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx={{
                    p: 2,
                }}
            >
                <TextField
                    label="展示區塊"
                    variant="outlined"
                    value={display}
                    select
                    fullWidth
                    sx={{
                        width: 96,
                    }}
                    SelectProps={menuProps}
                >
                    {displayOptions.map((el) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </TextField>
                <div>Item 2</div>
                <div>Item 3</div>
            </Stack>
        )
    }

    const renderComponent = (component: Component) => {
        const {
            id,
            type,
            value,
            display,
            align,
            width,
            height,
            fontSize,
            color,
        } = component
        switch (type) {
            case ComponentType.title: {
                return <StyledTextField value={value ?? ''} typoVariant="h4" />
            }
            case ComponentType.typography:
            case ComponentType.image:
            case ComponentType.link:
            case ComponentType.clipboard:
            case ComponentType.card:
                return <div />
        }
    }

    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ width: '100%', height: '100%' }}
        >
            {components.map((el) => (
                <Box key={el.id}>{renderView(el)}</Box>
            ))}

            <Box sx={{ py: 2 }}>
                <AddButton onAdd={handleAdd} />
            </Box>
        </Stack>
    )
}
