import * as React from 'react'
import _ from 'lodash'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField, { StandardTextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import ImageUploader from 'components/common/ImageUploader'
import PencilIcon from 'mdi-react/PencilIcon'
import { variantOptions, sizeOptions } from 'components/common/options'
import { getStringLength, toNumOrStr } from 'utils/helper'
import { typoOptions, fontWeightOptions } from 'components/common/options'
import type { OnChangeInput, CustomButtonType, TextType } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

export type StyledTextFieldProps = StandardTextFieldProps & {
    typoVariant?: Variant
    textProps: TextType
    onCustomize: (value: TextType) => void
}

type StyledFieldProps = StandardTextFieldProps & {
    typoVariant?: Variant
}

export { default as ChoiceView } from 'components/Survey/QuizForm/Shares/ChoiceView'
export { default as DraggerChoiceView } from 'components/Survey/QuizForm/Shares/DraggerChoiceView'
export { default as ModeSelector } from 'components/Survey/QuizForm/Shares/ModeSelector'

const StyledField = styled(TextField, {
    shouldForwardProp: (prop) => !_.includes(['typoVariant'], prop),
})<StyledFieldProps>(({ theme, value, typoVariant, placeholder }) => {
    const str = `${value || placeholder || ''}`
    const typo = typoVariant || 'h6'
    return {
        width: '90%',
        '& .MuiInputBase-input': {
            ...theme.typography[typo],
            margin: 'auto',
            maxWidth: '100%',
            width: str ? `${getStringLength(str)}ch` : undefined,
            textTransform: 'none',
        },
        '&:hover .MuiInputAdornment-root': {
            opacity: 1,
        },
    }
})

export const NoUnderlineTextField = styled(TextField)({
    '& .MuiInput-root:before': {
        opacity: 0,
    },
    '& .MuiInput-root:after': {
        opacity: 0,
    },
})

export function StyledTextField(props: StyledTextFieldProps) {
    const theme = useTheme()
    const { onCustomize, textProps, ...rest } = props

    const { text, color, bgcolor, variant, fontWeight, padding } =
        textProps ?? {}

    const [open, setOpen] = React.useState(false)

    const handleChange: OnChangeInput = (event) => {
        const { name, value: val } = event.target
        let value: any = val

        if (name === 'padding') {
            value = toNumOrStr(val)
        }

        const newValue: TextType = {
            ...textProps,
            [name]: value,
        }

        onCustomize(newValue)
    }

    return (
        <>
            <StyledField
                {...rest}
                name="text"
                value={text ?? ''}
                InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setOpen(true)}>
                                <PencilIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: (theme) => ({
                        '& .MuiInput-input': {
                            ...theme.typography[variant || 'body1'],
                            color,
                            fontWeight,
                            bgcolor,
                            padding,
                        },
                        '& .MuiInputAdornment-root': {
                            position: 'absolute',
                            right: 0,
                            opacity: 0,
                        },
                    }),
                }}
                onChange={handleChange}
            />

            <Drawer
                open={open}
                anchor="right"
                onClose={() => setOpen(false)}
                elevation={16}
                sx={{
                    '& .MuiBackdrop-root': {
                        opacity: '0 !important',
                    },
                }}
            >
                <Box sx={{ width: 320 }}>
                    <TableContainer
                        sx={{
                            '& td': {
                                height: 36,
                                border: 'none',
                                py: 0,
                            },
                            '& th': {
                                height: 48,
                                border: 'none',
                            },
                        }}
                    >
                        <Table size="small">
                            <TableBody>
                                <Header title="文字樣式" />

                                <TableRow
                                    sx={{
                                        borderBottom: `1px solid ${theme.palette.grey[500]}`,
                                    }}
                                />

                                <TableRow>
                                    <TableCell>字體大小</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            name="variant"
                                            value={variant || 'body1'}
                                            variant="standard"
                                            onChange={handleChange}
                                            InputProps={{
                                                sx: (theme) => ({
                                                    '& .MuiTypography-root': {
                                                        ...theme.typography
                                                            .body1,
                                                    },
                                                }),
                                            }}
                                            select
                                            fullWidth
                                        >
                                            {typoOptions.map((el) => (
                                                <MenuItem
                                                    key={el.value}
                                                    value={el.value}
                                                >
                                                    <Typography
                                                        variant={el.value}
                                                        noWrap
                                                    >
                                                        {el.label}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                        </NoUnderlineTextField>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>字重</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="fontWeight"
                                            value={fontWeight || 'bold'}
                                            onChange={handleChange}
                                            select
                                            fullWidth
                                        >
                                            {fontWeightOptions.map((el) => (
                                                <MenuItem
                                                    key={el.value}
                                                    value={el.value}
                                                >
                                                    {el.label}
                                                </MenuItem>
                                            ))}
                                        </NoUnderlineTextField>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>文字顏色</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="color"
                                            value={color}
                                            onChange={handleChange}
                                            placeholder="#212121"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>背景顏色</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="bgcolor"
                                            value={bgcolor}
                                            onChange={handleChange}
                                            placeholder="#ffffff"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>留白</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="padding"
                                            value={padding}
                                            onChange={handleChange}
                                            placeholder="8px 4px"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Drawer>
        </>
    )
}

export type StyledCustomButtonProps = CustomButtonProps & {
    onCustomize: (value: CustomButtonType) => void
    showImage?: boolean
}

export const StyledCustomButton = (props: StyledCustomButtonProps) => {
    const theme = useTheme()

    const {
        customProps,
        onCustomize,
        defaultText = '下一題',
        showImage = false,
        ...rest
    } = props
    const {
        text = '',
        textColor = '',
        buttonColor = '',
        variant = 'contained',
        size = 'large',
        fontSize,
        padding,
        border,
        borderRadius,
        image,
    } = customProps ?? {}

    const [open, setOpen] = React.useState(false)

    const handleChange: OnChangeInput = (event) => {
        const { name, value: val } = event.target
        const value = toNumOrStr(val)

        const buttonValue = {
            ...customProps,
            [name]: value,
        }

        onCustomize(buttonValue)
    }

    return (
        <>
            <CustomButton
                defaultText={defaultText}
                customProps={customProps}
                {...rest}
                onClick={() => setOpen(true)}
            />

            <Drawer
                open={open}
                anchor="right"
                onClose={() => setOpen(false)}
                elevation={16}
                sx={{
                    '& .MuiBackdrop-root': {
                        opacity: '0 !important',
                    },
                }}
            >
                <Box sx={{ width: 320 }}>
                    <TableContainer
                        sx={{
                            '& td': {
                                height: 36,
                                border: 'none',
                                py: 0,
                            },
                            '& th': {
                                height: 48,
                                border: 'none',
                            },
                        }}
                    >
                        <Table size="small">
                            <TableBody>
                                <Header title="按鈕樣式" />

                                <TableRow
                                    sx={{
                                        borderBottom: `1px solid ${theme.palette.grey[500]}`,
                                    }}
                                />

                                <TableRow>
                                    <TableCell>按鈕文字</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="text"
                                            value={text}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>文字大小</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="fontSize"
                                            value={fontSize}
                                            onChange={handleChange}
                                            placeholder="16"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>文字顏色</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="textColor"
                                            value={textColor}
                                            onChange={handleChange}
                                            placeholder="#fffffff"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>按鈕顏色</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="buttonColor"
                                            value={buttonColor}
                                            onChange={handleChange}
                                            placeholder="#1565c0"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>按鈕樣式</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            name="variant"
                                            variant="standard"
                                            value={variant}
                                            onChange={handleChange}
                                            fullWidth
                                            select
                                        >
                                            {variantOptions.map((el) => (
                                                <MenuItem
                                                    key={el.value}
                                                    value={el.value}
                                                >
                                                    {el.label}
                                                </MenuItem>
                                            ))}
                                        </NoUnderlineTextField>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>按鈕大小</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="size"
                                            value={size}
                                            onChange={handleChange}
                                            fullWidth
                                            select
                                        >
                                            {sizeOptions.map((el) => (
                                                <MenuItem
                                                    key={el.value}
                                                    value={el.value}
                                                >
                                                    {el.label}
                                                </MenuItem>
                                            ))}
                                        </NoUnderlineTextField>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>按鈕邊框</TableCell>
                                    <TableCell>
                                        <NoUnderlineTextField
                                            variant="standard"
                                            name="border"
                                            value={border}
                                            onChange={handleChange}
                                            placeholder="0px solid #ffffff"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>

                                {showImage ? (
                                    <>
                                        <TableRow>
                                            <TableCell>背景圖片</TableCell>
                                            <TableCell
                                                sx={{
                                                    position: 'relative',
                                                }}
                                            >
                                                <ImageUploader
                                                    onUploaded={(value) => {
                                                        handleChange({
                                                            target: {
                                                                name: 'image',
                                                                value,
                                                            },
                                                        } as any)
                                                    }}
                                                    sx={{ width: 104 }}
                                                    hideImage
                                                    hideDeleteButton
                                                />
                                                <Button
                                                    className="absolute-vertical"
                                                    color="error"
                                                    sx={{ right: 0 }}
                                                    disabled={!Boolean(image)}
                                                    onClick={() => {
                                                        handleChange({
                                                            target: {
                                                                name: 'image',
                                                                value: undefined,
                                                            },
                                                        } as any)
                                                    }}
                                                >
                                                    清除
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ) : (
                                    <>
                                        <TableRow>
                                            <TableCell>按鈕留白</TableCell>
                                            <TableCell>
                                                <NoUnderlineTextField
                                                    variant="standard"
                                                    name="padding"
                                                    value={padding}
                                                    onChange={handleChange}
                                                    placeholder="22px 8px"
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>按鈕圓角</TableCell>
                                            <TableCell>
                                                <NoUnderlineTextField
                                                    variant="standard"
                                                    name="borderRadius"
                                                    value={borderRadius}
                                                    onChange={handleChange}
                                                    placeholder="1"
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Drawer>
        </>
    )
}

export function Header(props: { title: string }) {
    const { title } = props
    return (
        <TableRow
            sx={{
                position: 'relative',
                height: 48,
            }}
        >
            <TableCell component="th">{title}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    )
}
