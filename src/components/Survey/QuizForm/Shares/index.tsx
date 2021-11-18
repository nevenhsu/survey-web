import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import { getStringLength } from 'utils/helper'
import { emphasizeColor } from 'theme/palette'
import type { CustomButtonType, OnChangeInput } from 'common/types'
import type { Variant } from '@mui/material/styles/createTypography'

export type StyledTextFieldProps = TextFieldProps & {
    value: string
    typoVariant?: Variant
}

export { default as ChoiceView } from 'components/Survey/QuizForm/Shares/ChoiceView'
export { default as DraggerChoiceView } from 'components/Survey/QuizForm/Shares/DraggerChoiceView'
export { default as ModeSelector } from 'components/Survey/QuizForm/Shares/ModeSelector'

export const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'typoVariant',
})<StyledTextFieldProps>(({ theme, value, typoVariant, placeholder }) => {
    const str = (value || placeholder) ?? ''
    const typo = typoVariant || 'h6'
    return {
        width: '90%',
        '& .MuiInputBase-input': {
            ...theme.typography[typo],
            margin: 'auto',
            maxWidth: '100%',
            width: str ? `${getStringLength(str)}ch` : undefined,
        },
    }
})

const variants = [
    { value: 'contained', label: '實心' },

    { value: 'outlined', label: '空心' },
    { value: 'text', label: '文字' },
]

export const CustomButton = (props: {
    customProps: CustomButtonType
    buttonProps?: ButtonProps
    onChange: OnChangeInput
    defaultText?: string
}) => {
    const { customProps, buttonProps, onChange, defaultText = '下一題' } = props
    const {
        buttonVariant = 'contained',
        buttonText = '',
        buttonColor = '',
        buttonTextColor = '',
    } = customProps

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

    return (
        <>
            <Button
                {...buttonProps}
                variant={buttonVariant}
                onClick={handleClick}
                sx={{
                    color: buttonTextColor,
                    backgroundColor: buttonColor,
                    '&:hover': {
                        backgroundColor: (theme) =>
                            emphasizeColor(theme, buttonColor, 0.08, ''),
                    },
                }}
            >
                {buttonText || defaultText}
            </Button>

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
                        name="buttonText"
                        value={buttonText}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字顏色"
                        variant="standard"
                        name="buttonTextColor"
                        value={buttonTextColor}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        variant="standard"
                        name="buttonColor"
                        value={buttonColor}
                        onChange={onChange}
                        placeholder="#1565c0"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕樣式"
                        name="buttonVariant"
                        variant="standard"
                        value={buttonVariant}
                        onChange={onChange}
                        fullWidth
                        select
                    >
                        {variants.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Popover>
        </>
    )
}
