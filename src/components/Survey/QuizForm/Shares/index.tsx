import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import CustomButton, { CustomButtonProps } from 'components/common/CustomButton'
import { variantOptions, sizeOptions } from 'components/common/options'
import { getStringLength, toNumOrStr, toNumber } from 'utils/helper'
import type { OnChangeInput, CustomButtonType } from 'common/types'
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

export type StyledCustomButtonProps = CustomButtonProps & {
    onCustomize: (value: CustomButtonType) => void
}

export const StyledCustomButton = (props: StyledCustomButtonProps) => {
    const { customProps, onCustomize, defaultText = '下一題', ...rest } = props
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
        let value: any = val

        if (_.includes(['fontSize', 'borderRadius'], name)) {
            value = toNumber(val)
        }

        if (name === 'padding') {
            value = toNumOrStr(val)
        }

        const buttonValue = {
            ...customProps,
            [name]: value,
        }

        onCustomize(buttonValue)
    }

    return (
        <>
            <CustomButton
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
                        label="按鈕邊框"
                        variant="standard"
                        name="border"
                        value={border}
                        onChange={handleChange}
                        placeholder="0px solid #ffffff"
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
                </Box>
            </Popover>
        </>
    )
}
