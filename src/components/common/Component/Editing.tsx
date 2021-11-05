import * as React from 'react'
import _ from 'lodash'
import ImageUploader from 'components/common/ImageUploader'
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
import StyledButton from 'components/common/StyledButton'
import AddIcon from 'mdi-react/AddIcon'
import { ComponentType } from 'common/types'
import type { Component, OnChangeInput } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

export type ComponentListProps = {
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
        buttonColor,
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
                            height,
                            bgcolor,
                        }}
                        fullWidth
                    />
                </Link>
            )
        }
        case ComponentType.clipboard: {
            const margin = getMargin(align)

            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ width, ...margin }}
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
                            },
                        }}
                        placeholder="請輸入文字"
                        sx={{
                            minWidth: 'calc(100% - 80px)',
                            height,
                            bgcolor,
                        }}
                        size="small"
                    />
                    <CopyToClipboard text={val} onCopy={() => setCopied(true)}>
                        <StyledButton
                            variant="contained"
                            sx={{ whiteSpace: 'nowrap' }}
                            colorName={buttonColor}
                        >
                            {copied ? '已複製' : '複製'}
                        </StyledButton>
                    </CopyToClipboard>
                </Stack>
            )
        }
        case ComponentType.image: {
            const margin = getMargin(align)

            return (
                <ImageUploader
                    bgImage={val}
                    onUploaded={(value) => {
                        onChange({
                            target: { name: 'value', value },
                        } as any)
                    }}
                    hideButton={Boolean(val)}
                    hideDeleteButton
                    sx={{
                        display,
                        bgcolor,
                        width,
                        height,
                        textAlign: align,
                        minHeight: 32,
                        ...margin,
                    }}
                />
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
                        overflow: 'hidden',
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

export function ComponentList(props: ComponentListProps) {
    const {
        components = [],
        selectedComponent,
        idPath,
        onAdd,
        onSelect,
        onChange,
    } = props

    return (
        <Box sx={{ width: '100%' }}>
            <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
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
        </Box>
    )
}

export function getComponent(
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

function getMargin(align?: string) {
    if (!align) {
        return { mx: 'auto' }
    }
    return align === 'center'
        ? { mx: 'auto' }
        : align === 'right'
        ? { ml: 'auto' }
        : { mr: 'auto' }
}
