import * as React from 'react'
import _ from 'lodash'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import AddIcon from 'mdi-react/AddIcon'
import LinkIcon from 'mdi-react/LinkIcon'
import FormatSizeIcon from 'mdi-react/FormatSizeIcon'
import PaletteIcon from 'mdi-react/PaletteIcon'
import BorderOutsideIcon from 'mdi-react/BorderOutsideIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import User from 'utils/user'
import { getDefaultComponent, setId } from 'utils/helper'
import { useAppSelector, useAppDispatch } from 'hooks'
import { updateComponent, setResult } from 'store/slices/editor'
import { ComponentType } from 'common/types'
import type { Result, Component } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

type onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => void
type onButtonClink = (event: React.MouseEvent<HTMLButtonElement>) => void

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
    onChange: onInputChange
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
    { value: 'block', label: '獨行' },
    { value: 'inline-block', label: '行內' },
]

const alignOptions = [
    { value: 'left', label: '置左' },
    { value: 'center', label: '置中' },
    { value: 'right', label: '置右' },
    { value: 'justify', label: '齊行' },
]

const typoOptions = [
    { value: 'h2', label: 'Heading 1' },
    { value: 'h4', label: 'Heading 2' },
    { value: 'h6', label: 'Heading 3' },
    { value: 'subtitle1', label: 'Subtitle 1' },
    { value: 'subtitle2', label: 'Subtitle 2' },
    { value: 'body1', label: 'Body 1' },
    { value: 'body2', label: 'Body 2' },
    { value: 'button', label: 'Button' },
    { value: 'caption', label: 'Caption' },
    { value: 'overline', label: 'Overline' },
] as const

const fontWeightOptions = [
    { value: 'light', label: 'Light' },
    { value: 'regular', label: 'Regular' },
    { value: 'medium', label: 'Medium' },
    { value: 'bold', label: 'Bold' },
]

const underlineOptions = [
    { value: 'always', label: '永遠' },
    { value: 'hover', label: '游標' },
    { value: 'none', label: '隱藏' },
] as const

type StyledTextFieldProps = TextFieldProps & {
    value: string
    typoVariant?: Variant
}

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'typoVariant',
})<StyledTextFieldProps>(({ value, theme, typoVariant }) => ({
    '& input': {
        ...theme.typography[typoVariant ?? 'body1'],
        textAlign: 'inherit',
        color: 'inherit',
        fontWeight: 'inherit',
    },
}))

const StyledSmallTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    '& .MuiInputBase-input *': {
        ...theme.typography.body2,
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

function ToolBar(props: {
    component?: Component
    onChange: onInputChange
    onDelete: onButtonClink
}) {
    const { component, onChange, onDelete } = props

    const {
        id,
        type,
        link,
        underline,
        display,
        align,
        typoVariant,
        fontWeight,
        width,
        height,
        color,
        bgcolor,
    } = component ?? {}

    const PopIds = {
        font: 'font',
        palette: 'palette',
        size: 'size',
        link: 'link',
    } as const

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const [popId, setPopId] = React.useState('')

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPopId(event.currentTarget.name)
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <StyledSmallTextField
                    label="展示區塊"
                    variant="outlined"
                    size="small"
                    name="display"
                    value={display ?? ''}
                    onChange={onChange}
                    select
                    fullWidth
                >
                    {displayOptions.map((el) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </StyledSmallTextField>
                <StyledSmallTextField
                    label="對齊"
                    variant="outlined"
                    size="small"
                    name="align"
                    value={align ?? ''}
                    onChange={onChange}
                    select
                    fullWidth
                >
                    {alignOptions.map((el) => (
                        <MenuItem key={el.value} value={el.value}>
                            {el.label}
                        </MenuItem>
                    ))}
                </StyledSmallTextField>
                <Tooltip placement="top" title="字體">
                    <IconButton name={PopIds.font} onClick={handleClick}>
                        <FormatSizeIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip placement="top" title="尺寸">
                    <IconButton name={PopIds.size} onClick={handleClick}>
                        <BorderOutsideIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip placement="top" title="顏色">
                    <IconButton name={PopIds.palette} onClick={handleClick}>
                        <PaletteIcon />
                    </IconButton>
                </Tooltip>
                {type === ComponentType.link && (
                    <Tooltip placement="top" title="超連結">
                        <IconButton name={PopIds.link} onClick={handleClick}>
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip placement="top" title="刪除">
                    <IconButton color="error" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Popover
                open={open && popId === PopIds.font}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{ py: 3, px: 2, width: 224 }}
                >
                    <StyledSmallTextField
                        label="大小"
                        variant="outlined"
                        size="small"
                        name="typoVariant"
                        value={typoVariant ?? ''}
                        onChange={onChange}
                        select
                        fullWidth
                    >
                        {typoOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                <Typography variant={el.value} noWrap>
                                    {el.label}
                                </Typography>
                            </MenuItem>
                        ))}
                    </StyledSmallTextField>
                    <StyledSmallTextField
                        label="字重"
                        variant="outlined"
                        size="small"
                        name="fontWeight"
                        value={fontWeight ?? ''}
                        onChange={onChange}
                        select
                        fullWidth
                    >
                        {fontWeightOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </StyledSmallTextField>
                </Stack>
            </Popover>
            <Popover
                open={open && popId === PopIds.palette}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{ py: 3, px: 2 }}
                >
                    <StyledSmallTextField
                        label="文字顏色"
                        variant="outlined"
                        size="small"
                        name="color"
                        value={color ?? ''}
                        onChange={onChange}
                        fullWidth
                    />
                    <StyledSmallTextField
                        label="背景背景"
                        variant="outlined"
                        size="small"
                        name="bgcolor"
                        value={bgcolor ?? ''}
                        onChange={onChange}
                        fullWidth
                    />
                </Stack>
            </Popover>
            <Popover
                open={open && popId === PopIds.size}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{ py: 3, px: 2 }}
                >
                    <StyledSmallTextField
                        label="寬度"
                        variant="outlined"
                        size="small"
                        name="width"
                        value={width ?? ''}
                        onChange={onChange}
                        fullWidth
                    />
                    <StyledSmallTextField
                        label="高度"
                        variant="outlined"
                        size="small"
                        name="height"
                        value={height ?? ''}
                        onChange={onChange}
                        fullWidth
                    />
                </Stack>
            </Popover>
            <Popover
                open={open && popId === PopIds.link}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{ py: 3, px: 2 }}
                >
                    <StyledSmallTextField
                        label="超連結"
                        variant="outlined"
                        size="small"
                        name="link"
                        value={link ?? ''}
                        onChange={onChange}
                        fullWidth
                    />
                    <StyledSmallTextField
                        label="底線顯示"
                        variant="outlined"
                        size="small"
                        name="underline"
                        value={underline ?? ''}
                        onChange={onChange}
                        select
                        fullWidth
                    >
                        {underlineOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </StyledSmallTextField>
                </Stack>
            </Popover>
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
                        <Button variant="contained">
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
                        width,
                        height,
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
                    item
                >
                    <Box sx={{ padding: 1 }}>
                        <Box
                            sx={{
                                borderRadius: 1,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor:
                                    el.id === selectedComponent?.id
                                        ? 'primary.light'
                                        : 'transparent',
                            }}
                        >
                            <ComponentItem
                                component={el}
                                idPath={[...idPath, el.id]}
                                selectedComponent={selectedComponent}
                                onAdd={onAdd}
                                onSelect={onSelect}
                                onChange={onChange}
                            />
                        </Box>
                    </Box>
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

    const { formId, result } = props
    const { id: resultId, components = [] } = result ?? {}

    const [selectedId, setSelectedId] = React.useState<string>('')

    const [idPath, setIdPath] = React.useState<string[]>([])

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

    const handleDelete = () => {
        if (formId && resultId && selectedComponent) {
            dispatch(
                updateComponent({
                    formId,
                    resultId,
                    idPath,
                    newValue: selectedComponent,
                    deleted: true,
                })
            )
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

    return (
        <Box
            onClick={() => {
                setSelectedId('')
                setIdPath([])
            }}
            sx={{
                p: 4,
                backgroundColor: 'common.white',
            }}
        >
            <Box onClick={(e) => e.stopPropagation()}>
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        top: -72,
                        left: 0,
                        p: 2,
                        bgcolor: 'grey.100',
                    }}
                >
                    <ToolBar
                        component={selectedComponent}
                        onChange={handleChange}
                        onDelete={handleDelete}
                    />
                </Box>
                <ComponentList
                    components={components}
                    idPath={[]}
                    selectedComponent={selectedComponent}
                    onAdd={handleAdd}
                    onSelect={(component, idPath: string[]) => {
                        setSelectedId(component.id)
                        setIdPath(idPath)
                    }}
                    onChange={handleChange}
                />
            </Box>
        </Box>
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
