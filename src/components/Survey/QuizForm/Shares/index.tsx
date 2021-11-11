import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import type { CustomButton, OnChangeInput } from 'common/types'

export type StyledTextFieldProps = TextFieldProps & { value: string }

export { default as ChoiceView } from 'components/Survey/QuizForm/Shares/ChoiceView'
export { default as ModeSelector } from 'components/Survey/QuizForm/Shares/ModeSelector'

export const StyledTextField = styled(TextField)<StyledTextFieldProps>(
    ({ theme, value }) => ({
        width: '90%',
        '& .MuiInputBase-input': {
            ...theme.typography.h6,
            margin: 'auto',
            maxWidth: '100%',
            width: value ? `${value?.length * 2}ch` : undefined,
        },
    })
)

export const QuizButton = (props: {
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { buttonProps, onChange } = props
    const {
        buttonVariant = 'contained',
        buttonText = '下一題',
        buttonColor = '',
        buttonTextColor = '',
    } = buttonProps

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
                variant={buttonVariant}
                onClick={handleClick}
                sx={{
                    color: buttonTextColor,
                    backgroundColor: buttonColor,
                }}
            >
                {buttonText || '下一題'}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 320 }}>
                    <TextField
                        label="按鈕文字"
                        name="buttonText"
                        variant="standard"
                        value={buttonText}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字顏色"
                        name="buttonTextColor"
                        variant="standard"
                        value={buttonTextColor}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        name="buttonColor"
                        variant="standard"
                        value={buttonColor}
                        onChange={onChange}
                        placeholder="#1565c0"
                        fullWidth
                    />
                </Box>
            </Popover>
        </>
    )
}
