import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import ImageUploader from 'components/common/ImageUploader'
import PencilIcon from 'mdi-react/PencilIcon'
import { variantOptions, sizeOptions } from 'components/common/options'
import { getStringLength, toNumOrStr } from 'utils/helper'
import { typoOptions, fontWeightOptions } from 'components/common/options'
import type { OnChangeInput, CustomButtonType, TextType } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

export type StyledTextFieldProps = TextFieldProps & {
    typoVariant?: Variant
    textProps: TextType
    onCustomize: (value: TextType) => void
}

type StyledFieldProps = TextFieldProps & {
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
    }
})

export function StyledTextField(props: StyledTextFieldProps) {
    const { onCustomize, textProps, ...rest } = props

    const { text, color, bgcolor, variant, fontWeight, padding } =
        textProps ?? {}

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

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
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClick}>
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
                    }),
                }}
                onChange={handleChange}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 320 }}>
                    <TextField
                        label="字體大小"
                        name="variant"
                        value={variant || 'body1'}
                        variant="standard"
                        onChange={handleChange}
                        InputProps={{
                            sx: (theme) => ({
                                '& .MuiTypography-root': {
                                    ...theme.typography.body1,
                                },
                            }),
                        }}
                        select
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        {typoOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                <Typography variant={el.value} noWrap>
                                    {el.label}
                                </Typography>
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="字重"
                        name="fontWeight"
                        value={fontWeight || 'bold'}
                        variant="standard"
                        onChange={handleChange}
                        select
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        {fontWeightOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="文字顏色"
                        variant="standard"
                        name="color"
                        value={color}
                        onChange={handleChange}
                        placeholder="#212121"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="背景顏色"
                        variant="standard"
                        name="bgcolor"
                        value={bgcolor}
                        onChange={handleChange}
                        placeholder="#ffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="留白"
                        variant="standard"
                        name="padding"
                        value={padding}
                        onChange={handleChange}
                        placeholder="8px 4px"
                        fullWidth
                        sx={{ mb: 3 }}
                    />
                </Box>
            </Popover>
        </>
    )
}

export type StyledCustomButtonProps = CustomButtonProps & {
    onCustomize: (value: CustomButtonType) => void
    showImage?: boolean
}

export const StyledCustomButton = (props: StyledCustomButtonProps) => {
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

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

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
                onClick={handleClick}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 320 }}>
                    <TextField
                        label="按鈕文字"
                        variant="standard"
                        name="text"
                        value={text}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字大小"
                        variant="standard"
                        name="fontSize"
                        value={fontSize}
                        onChange={handleChange}
                        placeholder="16"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字顏色"
                        variant="standard"
                        name="textColor"
                        value={textColor}
                        onChange={handleChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        variant="standard"
                        name="buttonColor"
                        value={buttonColor}
                        onChange={handleChange}
                        placeholder="#1565c0"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕樣式"
                        name="variant"
                        variant="standard"
                        value={variant}
                        onChange={handleChange}
                        fullWidth
                        select
                        sx={{ mb: 3 }}
                    >
                        {variantOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="按鈕大小"
                        name="size"
                        variant="standard"
                        value={size}
                        onChange={handleChange}
                        fullWidth
                        select
                        sx={{ mb: 3 }}
                    >
                        {sizeOptions.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="按鈕邊框"
                        variant="standard"
                        name="border"
                        value={border}
                        onChange={handleChange}
                        placeholder="0px solid #ffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    {showImage ? (
                        <>
                            <Typography
                                sx={{
                                    transform: `scale(0.75)`,
                                    transformOrigin: 'top left',
                                    color: 'text.secondary',
                                    mb: 0.5,
                                }}
                            >
                                背景圖片
                            </Typography>
                            <Box sx={{ position: 'relative', mb: 3 }}>
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
                            </Box>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="按鈕留白"
                                variant="standard"
                                name="padding"
                                value={padding}
                                onChange={handleChange}
                                placeholder="22px 8px"
                                fullWidth
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                label="按鈕圓角"
                                variant="standard"
                                name="borderRadius"
                                value={borderRadius}
                                onChange={handleChange}
                                placeholder="1"
                                fullWidth
                                sx={{ mb: 3 }}
                            />
                        </>
                    )}
                </Box>
            </Popover>
        </>
    )
}
