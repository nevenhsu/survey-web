import * as React from 'react'
import _ from 'lodash'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ImageUploader from 'components/common/ImageUploader'
import { getContrastText, emphasizeColor } from 'theme/palette'
import type { ChoiceType, OnChangeInput, OnButtonClink } from 'common/types'

export default function ChoiceView(props: {
    value: ChoiceType
    onChange: OnChangeInput
    onDelete: OnButtonClink
    onCopy: OnButtonClink
    showImage?: boolean
}) {
    const theme = useTheme()
    const { value, onChange, onCopy, onDelete, showImage = false } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = theme.palette.primary.main,
        backgroundColor = theme.palette.common.white,
    } = value

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
                variant="outlined"
                onClick={handleClick}
                sx={() => {
                    const { color } = getContrastText(
                        theme,
                        backgroundColor,
                        theme.palette.text.primary
                    )

                    const emphasizedColor = emphasizeColor(
                        theme,
                        backgroundColor,
                        0.08,
                        backgroundColor
                    )

                    const hoverTextColor = getContrastText(
                        theme,
                        emphasizedColor,
                        theme.palette.text.primary
                    ).color

                    return {
                        width: '100%',
                        color,
                        borderColor: buttonColor,
                        backgroundColor,
                        flexDirection: 'column',
                        padding: showImage ? '0 0 5px' : '5px 15px',
                        overflow: 'hidden',
                        '&:hover': {
                            color: hoverTextColor,
                            borderColor: buttonColor,
                            backgroundColor: emphasizedColor,
                        },
                        '& .MuiTouchRipple-root': {
                            color: buttonColor || backgroundColor,
                        },
                    }
                }}
            >
                {showImage && (
                    <span onClick={(e) => e.stopPropagation()}>
                        <ImageUploader
                            bgImage={image}
                            onUploaded={(value) => {
                                onChange({
                                    target: {
                                        value,
                                        name: 'image',
                                    },
                                } as any)
                            }}
                            sx={{
                                width: '100%',
                                minHeight: 48,
                                mb: 2,
                            }}
                            loadingButtonProps={{
                                variant: 'text',
                            }}
                            hideButton={Boolean(image)}
                        />
                    </span>
                )}

                <Typography
                    variant="button"
                    color="inherit"
                    width="100%"
                    sx={{
                        textTransform: 'none',
                    }}
                >
                    {label || '選項'}
                </Typography>
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
                        label="選項文字"
                        name="label"
                        variant="standard"
                        value={label}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        name="buttonColor"
                        variant="standard"
                        value={buttonColor}
                        onChange={onChange}
                        placeholder="#7879F1"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="背景顏色"
                        name="backgroundColor"
                        variant="standard"
                        value={backgroundColor}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={onCopy}
                        >
                            套用全部
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onDelete}
                        >
                            刪除選項
                        </Button>
                    </Stack>
                </Box>
            </Popover>
        </>
    )
}
