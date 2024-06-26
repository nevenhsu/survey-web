import * as React from 'react'
import _ from 'lodash'
import NumberFormat from 'react-number-format'
import { styled, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import ImageUploader from 'components/common/ImageUploader'
import { typoOptions, fontWeightOptions } from 'components/common/options'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateSurvey, selectCurrentSurvey } from 'store/slices/survey'
import { toNumOrStr } from 'utils/helper'
import { ComponentType } from 'common/types'
import type { Component } from 'common/types'

type Page = {
    bgcolor?: string
}

type ComponentToolProps = {
    page?: Page
    component?: Component
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
    handleChangePage: React.ChangeEventHandler<HTMLInputElement>
}

const displayOptions = [
    { value: 'block', label: '獨行' },
    { value: 'inline-block', label: '併行' },
]

const alignOptions = [
    { value: 'left', label: '置左' },
    { value: 'center', label: '置中' },
    { value: 'right', label: '置右' },
    { value: 'justify', label: '齊行' },
]

const linkStyleOptions = [
    { value: 'button', label: '按鈕' },
    { value: 'text', label: '文字' },
] as const

const StyledTextField = styled(TextField)({
    '& .MuiInput-root:before': {
        opacity: 0,
    },
    '& .MuiInput-root:after': {
        opacity: 0,
    },
})

const Header = (props: { title: string }) => {
    const { title } = props
    return (
        <TableRow
            sx={{
                position: 'relative',
                height: 48,
            }}
        >
            <TableCell
                sx={{
                    borderBottom: 0,
                }}
                component="th"
            >
                {title}
            </TableCell>
            <TableCell sx={{ borderBottom: 0 }}></TableCell>
        </TableRow>
    )
}

export default function ComponentTool(props: ComponentToolProps) {
    const theme = useTheme()
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectCurrentSurvey)
    const { id: surveyId, setting } = survey ?? {}

    const { page, component, onChange, onDelete, handleChangePage } = props

    const {
        id,
        type,
        value,
        link,
        linkStyle,
        display,
        align,
        typoVariant,
        fontWeight,
        width,
        height,
        color,
        bgcolor,
        buttonColor,
    } = component ?? {}

    const handleChangeSetting = (name: string, value: any) => {
        if (surveyId) {
            const newValue = {
                setting: {
                    ...setting,
                    [name]: value,
                },
            }

            dispatch(
                updateSurvey({
                    id: surveyId,
                    newValue,
                })
            )
        }
    }

    return (
        <TableContainer
            sx={{
                '& td': {
                    height: 36,
                    minWidth: 96,
                    maxWidth: 192,
                    py: 0,
                    border: 'none',
                },
            }}
        >
            <Table size="small">
                <TableBody>
                    <Header title="頁面設定" />

                    <TableRow>
                        <TableCell>最大寬度</TableCell>
                        <TableCell>
                            <NumberFormat
                                customInput={StyledTextField}
                                variant="standard"
                                value={setting?.maxWidth ?? ''}
                                onValueChange={({ value }) => {
                                    handleChangeSetting(
                                        'maxWidth',
                                        toNumOrStr(value)
                                    )
                                }}
                                placeholder="800"
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>頁面顏色</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="bgcolor"
                                value={page?.bgcolor ?? ''}
                                variant="standard"
                                placeholder="#ffffff"
                                onChange={handleChangePage}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow
                        sx={{
                            borderBottom: `1px solid ${theme.palette.grey[500]}`,
                        }}
                    />

                    <Header title="元件設定" />

                    {type === ComponentType.image && (
                        <TableRow>
                            <TableCell>背景圖片</TableCell>
                            <TableCell>
                                <ImageUploader
                                    onUploaded={(value) => {
                                        onChange({
                                            target: { name: 'value', value },
                                        } as any)
                                    }}
                                    sx={{ display: 'grid' }}
                                    hideImage
                                    hideDeleteButton
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {!_.includes(
                        [ComponentType.card, ComponentType.image],
                        type
                    ) && (
                        <TableRow>
                            <TableCell>內容</TableCell>
                            <TableCell>
                                <StyledTextField
                                    name="value"
                                    value={value ?? ''}
                                    variant="standard"
                                    placeholder="請輸入文字..."
                                    onChange={onChange}
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {type === ComponentType.link && (
                        <>
                            <TableRow>
                                <TableCell>超連結</TableCell>
                                <TableCell>
                                    <StyledTextField
                                        name="link"
                                        value={link ?? ''}
                                        variant="standard"
                                        placeholder="https://..."
                                        onChange={onChange}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>連結樣式</TableCell>
                                <TableCell>
                                    <StyledTextField
                                        name="linkStyle"
                                        value={linkStyle || 'button'}
                                        variant="standard"
                                        onChange={onChange}
                                        select
                                        fullWidth
                                    >
                                        {linkStyleOptions.map((el) => (
                                            <MenuItem
                                                key={el.value}
                                                value={el.value}
                                            >
                                                {el.label}
                                            </MenuItem>
                                        ))}
                                    </StyledTextField>
                                </TableCell>
                            </TableRow>
                        </>
                    )}

                    <TableRow>
                        <TableCell>區塊展示</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="display"
                                value={display || 'block'}
                                variant="standard"
                                onChange={onChange}
                                select
                                fullWidth
                            >
                                {displayOptions.map((el) => (
                                    <MenuItem key={el.value} value={el.value}>
                                        {el.label}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>內容對齊</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="align"
                                value={align || 'center'}
                                variant="standard"
                                onChange={onChange}
                                select
                                fullWidth
                            >
                                {alignOptions.map((el) => (
                                    <MenuItem key={el.value} value={el.value}>
                                        {el.label}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>寬度</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="width"
                                value={width ?? ''}
                                variant="standard"
                                placeholder="100%"
                                onChange={onChange}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>高度</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="height"
                                value={height ?? ''}
                                variant="standard"
                                placeholder="auto"
                                onChange={onChange}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>

                    {!_.includes(
                        [ComponentType.card, ComponentType.image],
                        type
                    ) && (
                        <>
                            <TableRow>
                                <TableCell>文字大小</TableCell>
                                <TableCell>
                                    <StyledTextField
                                        name="typoVariant"
                                        value={typoVariant || 'body1'}
                                        variant="standard"
                                        onChange={onChange}
                                        InputProps={{
                                            sx: (theme) => ({
                                                '& .MuiTypography-root': {
                                                    ...theme.typography.body1,
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
                                    </StyledTextField>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>文字粗細</TableCell>
                                <TableCell>
                                    <StyledTextField
                                        name="fontWeight"
                                        value={fontWeight || 'regular'}
                                        variant="standard"
                                        onChange={onChange}
                                        select
                                        fullWidth
                                    >
                                        {fontWeightOptions.map((el) => (
                                            <MenuItem
                                                key={el.value}
                                                value={el.value}
                                            >
                                                <Typography
                                                    fontWeight={el.value}
                                                    noWrap
                                                >
                                                    {el.label}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </StyledTextField>
                                </TableCell>
                            </TableRow>
                        </>
                    )}

                    {type !== ComponentType.image && (
                        <TableRow>
                            <TableCell>
                                {type === ComponentType.card
                                    ? '邊框顏色'
                                    : '文字顏色'}
                            </TableCell>
                            <TableCell>
                                <StyledTextField
                                    name="color"
                                    value={color ?? ''}
                                    variant="standard"
                                    placeholder="#000000"
                                    onChange={onChange}
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {(_.includes(
                        [ComponentType.clipboard, ComponentType.button],
                        type
                    ) ||
                        (type === ComponentType.link &&
                            linkStyle === 'button')) && (
                        <TableRow>
                            <TableCell>按鈕顏色</TableCell>
                            <TableCell>
                                <StyledTextField
                                    name="buttonColor"
                                    value={buttonColor ?? ''}
                                    variant="standard"
                                    placeholder="#3892FC"
                                    onChange={onChange}
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    <TableRow>
                        <TableCell>背景顏色</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="bgcolor"
                                value={bgcolor ?? ''}
                                variant="standard"
                                placeholder="#ffffff"
                                onChange={onChange}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Box sx={{ pt: 4, pb: 8 }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onDelete}
                    sx={{
                        position: 'relative',
                        left: 16,
                    }}
                >
                    刪除元件
                </Button>
            </Box>
        </TableContainer>
    )
}
