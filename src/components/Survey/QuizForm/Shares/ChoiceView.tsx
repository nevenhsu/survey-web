import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import ThemeProvider from 'theme/ThemeProvider'
import { Header, NoUnderlineTextField } from 'components/Survey/QuizForm/Shares'
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
        fontSize,
        padding,
        border,
        borderRadius,
    } = value

    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button
                variant="outlined"
                onClick={() => setOpen(true)}
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
                        border,
                        padding: toNumOrStr(padding),
                        fontSize: toNumOrStr(fontSize),
                        borderRadius: toNumOrStr(borderRadius),
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

            <ThemeProvider mode="dark">
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
                                    height: 48,
                                },
                            }}
                        >
                            <Table size="small">
                                <TableBody>
                                    <Header title="選項樣式" />

                                    <TableRow>
                                        <TableCell>選項文字</TableCell>
                                        <TableCell>
                                            <NoUnderlineTextField
                                                variant="standard"
                                                name="label"
                                                value={label ?? ''}
                                                onChange={onChange}
                                                placeholder="請輸入文字..."
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
                                                value={fontSize ?? ''}
                                                onChange={onChange}
                                                placeholder="16"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>邊框顏色</TableCell>
                                        <TableCell>
                                            <NoUnderlineTextField
                                                variant="standard"
                                                name="buttonColor"
                                                value={buttonColor ?? ''}
                                                onChange={onChange}
                                                placeholder="#3892FC"
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
                                                value={bgcolor ?? ''}
                                                onChange={onChange}
                                                placeholder="#fffffff"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>按鈕留白</TableCell>
                                        <TableCell>
                                            <NoUnderlineTextField
                                                variant="standard"
                                                name="padding"
                                                value={padding ?? ''}
                                                onChange={onChange}
                                                placeholder="22px 8px"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>按鈕邊框</TableCell>
                                        <TableCell>
                                            <NoUnderlineTextField
                                                variant="standard"
                                                name="border"
                                                value={border ?? ''}
                                                onChange={onChange}
                                                placeholder="0px solid #3892FC"
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
                                                value={borderRadius ?? ''}
                                                onChange={onChange}
                                                placeholder="1"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ p: 2 }}>
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
                    </Box>
                </Drawer>
            </ThemeProvider>
        </>
    )
}
