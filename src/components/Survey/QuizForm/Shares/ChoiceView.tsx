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
import { toNumOrStr } from 'utils/helper'
import type { ChoiceType, OnChangeInput, OnButtonClink } from 'common/types'

export default function ChoiceView(props: {
    value: ChoiceType
    onChange: OnChangeInput
    onDelete: OnButtonClink
    onCopy: OnButtonClink
    showImage?: boolean
}) {
    const { value, onChange, onCopy, onDelete, showImage = false } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = '',
        bgcolor = '',
        fontSize: fontSizeRaw,
        padding,
        border,
        borderRadius,
    } = value

    const fontSize = toNumOrStr(fontSizeRaw)

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
                sx={(theme) => {
                    const bg = bgcolor || theme.palette.common.white

                    const { color } = getContrastText(
                        theme,
                        bg,
                        theme.palette.text.primary
                    )

                    const emphasizedColor = emphasizeColor(theme, bg, 0.08, bg)

                    const hoverTextColor = getContrastText(
                        theme,
                        emphasizedColor,
                        theme.palette.text.primary
                    ).color

                    return {
                        width: '100%',
                        height: '100%',
                        color,
                        fontSize,
                        padding,
                        border,
                        borderRadius,
                        bgcolor: bg,
                        borderColor: buttonColor,
                        flexDirection: 'column',
                        overflow: 'hidden',
                        '&:hover': {
                            border,
                            borderColor: buttonColor,
                            backgroundColor: emphasizedColor,
                            color: hoverTextColor,
                        },
                        '& .MuiTouchRipple-root': {
                            color: buttonColor || bgcolor,
                        },
                        '& *': {
                            fontSize: 'inherit',
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
                        value={label ?? ''}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字大小"
                        variant="standard"
                        name="fontSize"
                        value={fontSize ?? ''}
                        onChange={onChange}
                        placeholder="16"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="邊框顏色"
                        name="buttonColor"
                        variant="standard"
                        value={buttonColor ?? ''}
                        onChange={onChange}
                        placeholder="#3892FC"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="背景顏色"
                        name="bgcolor"
                        variant="standard"
                        value={bgcolor ?? ''}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕留白"
                        variant="standard"
                        name="padding"
                        value={padding ?? ''}
                        onChange={onChange}
                        placeholder="22px 8px"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕邊框"
                        variant="standard"
                        name="border"
                        value={border ?? ''}
                        onChange={onChange}
                        placeholder="0px solid #3892FC"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕圓角"
                        variant="standard"
                        name="borderRadius"
                        value={borderRadius ?? ''}
                        onChange={onChange}
                        placeholder="1"
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
