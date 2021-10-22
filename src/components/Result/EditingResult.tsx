import * as React from 'react'
import _ from 'lodash'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import AddIcon from 'mdi-react/AddIcon'
import User from 'utils/user'
import ThemeProvider from 'theme/ThemeProvider'
import { ComponentContext } from 'components/Editor/ResultForm/ComponentProvider'
import { getDefaultComponent, setId } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { updateComponent, setResult } from 'store/slices/editor'
import { ComponentType } from 'common/types'
import type { Result, Component, OnChangeInput } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

type EditingQuizProps = {
    formId?: string
    result?: Result
}

type ComponentListProps = {
    components: Component[]
    idPath: string[]
    selectedComponent?: Component
    onAdd: (idPath: string[], type: ComponentType) => void
    onSelect: (component: Component, idPath: string[]) => void
    onChange: OnChangeInput
}

const options = [
    { value: ComponentType.title, label: '標題' },
    { value: ComponentType.typography, label: '內文' },
    { value: ComponentType.image, label: '圖片' },
    { value: ComponentType.link, label: '超連結' },
    { value: ComponentType.clipboard, label: '剪貼簿' },
    { value: ComponentType.card, label: '卡片' },
]

type StyledTextFieldProps = TextFieldProps & {
    value: string
    typoVariant?: Variant
}

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'typoVariant',
})<StyledTextFieldProps>(({ value, theme, typoVariant }) => ({
    '& .MuiInputBase-input': {
        ...theme.typography[typoVariant ?? 'body1'],
        textAlign: 'inherit',
        color: 'inherit',
        fontWeight: 'inherit',
    },
}))

const AddButton = (props: {
    idPath: string[]
    onAdd: (idPath: string[], type: ComponentType) => void
}) => {
    const { idPath, onAdd } = props

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
        onAdd(idPath, type)
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

function ComponentItem(
    props: { component: Component } & Omit<ComponentListProps, 'components'>
) {
    const { component, idPath, selectedComponent, onAdd, onSelect, onChange } =
        props

    const {
        id,
        type,
        value,
        underline,
        display,
        align,
        width,
        height,
        typoVariant,
        fontWeight,
        color,
        bgcolor,
        components = [],
    } = component

    const val = value ?? ''

    const [copied, setCopied] = React.useState(false)

    switch (type) {
        case ComponentType.title:
        case ComponentType.typography: {
            return (
                <StyledTextField
                    onChange={onChange}
                    value={val}
                    typoVariant={typoVariant}
                    variant="standard"
                    name="value"
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            color,
                            fontWeight,
                            textAlign: align,
                        },
                    }}
                    placeholder="請輸入文字"
                    sx={{
                        width,
                        height,
                        bgcolor,
                    }}
                    fullWidth
                    multiline
                />
            )
        }
        case ComponentType.link: {
            return (
                <Link
                    underline={underline}
                    sx={{
                        color,
                        '&.MuiLink-root': { textDecorationColor: 'inherit' },
                    }}
                >
                    <StyledTextField
                        onChange={onChange}
                        value={val}
                        typoVariant={typoVariant}
                        variant="standard"
                        name="value"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                color,
                                textAlign: align,
                            },
                        }}
                        placeholder="請輸入文字"
                        sx={{
                            width,
                            height,
                            bgcolor,
                        }}
                        fullWidth
                    />
                </Link>
            )
        }
        case ComponentType.clipboard: {
            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                    spacing={2}
                >
                    <StyledTextField
                        onChange={(e) => {
                            onChange(e as any)
                            setCopied(false)
                        }}
                        value={val}
                        typoVariant={typoVariant}
                        variant="outlined"
                        name="value"
                        InputProps={{
                            sx: {
                                color,
                                textAlign: align,
                            },
                        }}
                        placeholder="請輸入文字"
                        sx={{
                            width,
                            height,
                            bgcolor,
                        }}
                        fullWidth
                    />
                    <CopyToClipboard text={val} onCopy={() => setCopied(true)}>
                        <Button
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {copied ? '已複製' : '複製'}
                        </Button>
                    </CopyToClipboard>
                </Stack>
            )
        }
        case ComponentType.image: {
            return (
                <Box sx={{ display, bgcolor, width, height, textAlign: align }}>
                    <img
                        src={val}
                        style={{
                            width: 'inherit',
                            height: 'inherit',
                        }}
                    />
                </Box>
            )
        }
        case ComponentType.card:
            return (
                <Box
                    sx={{
                        display,
                        width: '100%',
                        height: '100%',
                        bgcolor,
                        textAlign: align,
                        borderRadius: 1,
                        border: `1px solid ${color}`,
                    }}
                >
                    <ComponentList
                        components={components}
                        idPath={idPath}
                        selectedComponent={selectedComponent}
                        onAdd={onAdd}
                        onSelect={onSelect}
                        onChange={onChange}
                    />
                </Box>
            )
    }
}

function ComponentList(props: ComponentListProps) {
    const {
        components = [],
        selectedComponent,
        idPath,
        onAdd,
        onSelect,
        onChange,
    } = props

    return (
        <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%', height: '100%' }}
        >
            {components.map((el) => (
                <Grid
                    key={el.id}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect(el, idPath)
                    }}
                    xs={el.display === 'block' ? 12 : undefined}
                    sx={{
                        width: el.width,
                        height: el.height,
                        padding: 1,
                        borderRadius: 1,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor:
                            el.id === selectedComponent?.id
                                ? 'primary.light'
                                : 'transparent',
                    }}
                    item
                >
                    <ComponentItem
                        component={el}
                        idPath={[...idPath, el.id]}
                        selectedComponent={selectedComponent}
                        onAdd={onAdd}
                        onSelect={onSelect}
                        onChange={onChange}
                    />
                </Grid>
            ))}

            <Grid xs={12} item>
                <Box sx={{ py: 2, textAlign: 'center' }}>
                    <AddButton idPath={idPath} onAdd={onAdd} />
                </Box>
            </Grid>
        </Grid>
    )
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
                    p: 4,
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

function getComponent(
    components: Component[],
    idPath: string[]
): Component | undefined {
    const [id, ...rest] = idPath
    const component = _.find(components, { id })

    if ([...rest].length) {
        return component && component.components?.length
            ? getComponent(component.components, [...rest])
            : component
    }

    return component
}
