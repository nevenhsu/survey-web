import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ImageUploader from 'components/common/ImageUploader'
import { lightenColor } from 'theme/palette'
import type { ChoiceType, OnChangeInput, OnButtonClink } from 'common/types'

export default function ChoiceView(props: {
    value: ChoiceType
    onChange: OnChangeInput
    onDelete: OnButtonClink
    showImage?: boolean
}) {
    const { value, onChange, onDelete, showImage = false } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = '',
        buttonTextColor = '',
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
                sx={(theme) => {
                    const lightColor = lightenColor(
                        theme,
                        buttonColor,
                        0.92,
                        ''
                    )

                    return {
                        width: '100%',
                        color: buttonTextColor,
                        borderColor: buttonColor,
                        flexDirection: 'column',
                        padding: showImage ? '0 0 5px' : '5px 15px',
                        overflow: 'hidden',
                        '&:hover': {
                            borderColor: buttonColor,
                            backgroundColor: lightColor,
                        },
                        '& .MuiTouchRipple-root': {
                            color: buttonColor,
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
                    vertical: 'bottom',
                    horizontal: 'left',
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
                        sx={{ mb: 3 }}
                    />

                    <Button variant="outlined" color="error" onClick={onDelete}>
                        刪除選項
                    </Button>
                </Box>
            </Popover>
        </>
    )
}
