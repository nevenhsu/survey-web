import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material'
import NumberFormat from 'react-number-format'
import { GridSize } from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import ImageUploader from 'components/common/ImageUploader'
import ModeSelector from 'components/Survey/QuizForm/Shares/ModeSelector'
import { useAppDispatch, useAppSelector } from 'hooks'
import {
    updateQuiz,
    deleteQuiz,
    updateSurvey,
    selectCurrentSurvey,
} from 'store/slices/survey'
import { toNumber, toNumOrStr } from 'utils/helper'
import { QuizMode } from 'common/types'
import type {
    SelectionQuiz,
    OnChangeInput,
    QuizType,
    DraggerQuiz,
    Setting,
} from 'common/types'

type QuizToolProps = {
    surveyId: string
    quiz?: QuizType
}

const responsiveOptions: { value: GridSize; label: string }[] = [
    { value: 'auto', label: '自動' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
]

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
                bgcolor: (theme) => theme.palette.grey[900],
            }}
        >
            <TableCell
                className="absolute-center"
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

export default function QuizTool(props: QuizToolProps) {
    const dispatch = useAppDispatch()

    const { surveyId, quiz } = props

    const survey = useAppSelector(selectCurrentSurvey)
    const { setting } = survey

    const {
        id: quizId,
        mode,
        cover,
        backgroundImage,
        backgroundColor,
    } = quiz ?? {}

    const { responsive, px, showImage, maxChoices } =
        (quiz as SelectionQuiz) ?? {}

    const { countDown, left, right } = (quiz as DraggerQuiz) ?? {}

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target

        const val = toNumOrStr(value)

        const newValue = {
            [name]: val,
        }
        handleUpdateQuiz(newValue)
    }

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        const newValue = {
            [name]: checked,
        }
        handleUpdateQuiz(newValue)
    }

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (surveyId && quizId) {
            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue,
                })
            )
        }
    }

    const handleDelete = () => {
        if (surveyId && quizId) {
            dispatch(
                deleteQuiz({
                    surveyId,
                    quizId,
                })
            )
        }
    }

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

    const handleSwitchSetting = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target
        handleChangeSetting(name, checked)
    }

    const handleUpdateResponsive = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target
        const val = value === 'auto' ? value : toNumber(value)
        const resp = {
            ...responsive,
            [name]: val,
        }

        handleUpdateQuiz({ responsive: resp })
    }

    const handleUpdatePadding = (data: { value: number; name: string }) => {
        const { value, name } = data
        const newPx = {
            ...px,
            [name]: value,
        }

        handleUpdateQuiz({ px: newPx })
    }

    return (
        <TableContainer
            sx={{
                '& td': {
                    height: 48,
                },
            }}
        >
            <Table size="small">
                <TableBody>
                    <Header title="題目設定" />
                    <TableRow>
                        <TableCell>題目類型</TableCell>
                        <TableCell>
                            <ModeSelector surveyId={surveyId} quiz={quiz} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>必填</TableCell>
                        <TableCell>
                            <Switch
                                name="required"
                                color="primary"
                                checked={quiz?.required ?? false}
                                onChange={handleSwitch}
                                disabled={!quiz}
                            />
                        </TableCell>
                    </TableRow>

                    <Header title="外觀設定" />

                    <TableRow>
                        <TableCell>進度條</TableCell>
                        <TableCell>
                            <Switch
                                name="showProgress"
                                color="primary"
                                checked={setting?.showProgress ?? false}
                                onChange={handleSwitchSetting}
                                disabled={!quiz}
                            />
                        </TableCell>
                    </TableRow>

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

                    {mode === QuizMode.dragger && (
                        <>
                            <TableRow>
                                <TableCell>倒數計時</TableCell>
                                <TableCell>
                                    <NumberFormat
                                        customInput={StyledTextField}
                                        variant="standard"
                                        value={countDown}
                                        onValueChange={({ value }) => {
                                            handleUpdateQuiz({
                                                countDown: value
                                                    ? Number(value)
                                                    : NaN,
                                            })
                                        }}
                                        placeholder="30000"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        '& p': {
                                                            fontSize: 14,
                                                        },
                                                    }}
                                                >
                                                    毫秒
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </>
                    )}
                    {mode !== QuizMode.dragger && (
                        <>
                            <TableRow>
                                <TableCell component="th">封面寬度</TableCell>
                                <TableCell component="th"></TableCell>
                            </TableRow>

                            <TableRow
                                sx={{
                                    position: 'relative',
                                    height: 64,
                                }}
                            >
                                <TableCell
                                    className="absolute-center"
                                    sx={{
                                        px: 2,
                                        pt: 1.5,
                                        width: '100%',
                                        height: '100% !important',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="手機"
                                                placeholder="auto"
                                                value={cover?.width?.xs ?? ''}
                                                variant="standard"
                                                onChange={(event) =>
                                                    handleChange({
                                                        target: {
                                                            name: 'cover',
                                                            value: {
                                                                ...cover,
                                                                width: {
                                                                    ...cover?.width,
                                                                    xs: toNumOrStr(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    ),
                                                                },
                                                            },
                                                        },
                                                    } as any)
                                                }
                                                fullWidth
                                            />
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="平板"
                                                placeholder="auto"
                                                value={cover?.width?.sm ?? ''}
                                                variant="standard"
                                                onChange={(event) =>
                                                    handleChange({
                                                        target: {
                                                            name: 'cover',
                                                            value: {
                                                                ...cover,
                                                                width: {
                                                                    ...cover?.width,
                                                                    sm: toNumOrStr(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    ),
                                                                },
                                                            },
                                                        },
                                                    } as any)
                                                }
                                                fullWidth
                                            />
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="電腦"
                                                placeholder="auto"
                                                value={cover?.width?.lg ?? ''}
                                                variant="standard"
                                                onChange={(event) =>
                                                    handleChange({
                                                        target: {
                                                            name: 'cover',
                                                            value: {
                                                                ...cover,
                                                                width: {
                                                                    ...cover?.width,
                                                                    lg: toNumOrStr(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    ),
                                                                },
                                                            },
                                                        },
                                                    } as any)
                                                }
                                                fullWidth
                                            />
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 0 }}></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>封面高度</TableCell>
                                <TableCell>
                                    <StyledTextField
                                        placeholder="auto"
                                        value={cover?.height ?? ''}
                                        variant="standard"
                                        onChange={(event) =>
                                            handleChange({
                                                target: {
                                                    name: 'cover',
                                                    value: {
                                                        ...cover,
                                                        height: toNumOrStr(
                                                            event.target.value
                                                        ),
                                                    },
                                                },
                                            } as any)
                                        }
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        </>
                    )}

                    <TableRow sx={{ position: 'relative' }}>
                        <TableCell>背景圖片</TableCell>
                        <TableCell>
                            <ImageUploader
                                onUploaded={(backgroundImage) => {
                                    handleUpdateQuiz({
                                        backgroundImage,
                                    })
                                }}
                                sx={{ width: 104 }}
                                hideImage
                                hideDeleteButton
                            />
                            <Button
                                className="absolute-vertical"
                                color="error"
                                sx={{ right: 8 }}
                                disabled={!backgroundImage}
                                onClick={() => {
                                    handleUpdateQuiz({
                                        backgroundImage: undefined,
                                    })
                                }}
                            >
                                清除
                            </Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>背景顏色</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="backgroundColor"
                                placeholder="#ffffff"
                                value={backgroundColor ?? ''}
                                variant="standard"
                                onChange={handleChange}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>

                    {_.includes(
                        [QuizMode.selection, QuizMode.sort, QuizMode.oneInTwo],
                        mode
                    ) && (
                        <>
                            <Header title="答項設定" />

                            <TableRow>
                                <TableCell component="th">答項寬度</TableCell>
                                <TableCell component="th"></TableCell>
                            </TableRow>
                            <TableRow
                                sx={{
                                    position: 'relative',
                                    height: 64,
                                }}
                            >
                                <TableCell
                                    className="absolute-center"
                                    sx={{
                                        px: 2,
                                        pt: 1.5,
                                        width: '100%',
                                        height: '100% !important',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="手機"
                                                name="xs"
                                                placeholder="auto"
                                                value={responsive?.xs ?? 'auto'}
                                                variant="standard"
                                                onChange={
                                                    handleUpdateResponsive
                                                }
                                                fullWidth
                                                select
                                            >
                                                {responsiveOptions.map((el) => (
                                                    <MenuItem
                                                        key={el.value}
                                                        value={el.value}
                                                    >
                                                        {el.label}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="平板"
                                                name="sm"
                                                placeholder="auto"
                                                value={responsive?.sm ?? 'auto'}
                                                variant="standard"
                                                onChange={
                                                    handleUpdateResponsive
                                                }
                                                fullWidth
                                                select
                                            >
                                                {responsiveOptions.map((el) => (
                                                    <MenuItem
                                                        key={el.value}
                                                        value={el.value}
                                                    >
                                                        {el.label}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <StyledTextField
                                                label="電腦"
                                                name="lg"
                                                placeholder="auto"
                                                value={responsive?.lg ?? 'auto'}
                                                variant="standard"
                                                onChange={
                                                    handleUpdateResponsive
                                                }
                                                fullWidth
                                                select
                                            >
                                                {responsiveOptions.map((el) => (
                                                    <MenuItem
                                                        key={el.value}
                                                        value={el.value}
                                                    >
                                                        {el.label}
                                                    </MenuItem>
                                                ))}
                                            </StyledTextField>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 0 }}></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell component="th">答項留白</TableCell>
                                <TableCell component="th"></TableCell>
                            </TableRow>

                            <TableRow
                                sx={{
                                    position: 'relative',
                                    height: 64,
                                }}
                            >
                                <TableCell
                                    className="absolute-center"
                                    sx={{
                                        px: 2,
                                        pt: 1.5,
                                        width: '100%',
                                        height: '100% !important',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Box sx={{ width: 1 / 3 }}>
                                            <NumberFormat
                                                label="手機"
                                                customInput={StyledTextField}
                                                variant="standard"
                                                placeholder="1"
                                                value={px.xs}
                                                onValueChange={({ value }) => {
                                                    handleUpdatePadding({
                                                        value: value
                                                            ? Number(value)
                                                            : NaN,
                                                        name: 'xs',
                                                    })
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <NumberFormat
                                                label="平板"
                                                customInput={StyledTextField}
                                                variant="standard"
                                                placeholder="1"
                                                value={px.sm}
                                                onValueChange={({ value }) => {
                                                    handleUpdatePadding({
                                                        value: value
                                                            ? Number(value)
                                                            : NaN,
                                                        name: 'sm',
                                                    })
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                        <Box sx={{ width: 1 / 3 }}>
                                            <NumberFormat
                                                label="電腦"
                                                customInput={StyledTextField}
                                                variant="standard"
                                                placeholder="1"
                                                value={px.lg}
                                                onValueChange={({ value }) => {
                                                    handleUpdatePadding({
                                                        value: value
                                                            ? Number(value)
                                                            : NaN,
                                                        name: 'lg',
                                                    })
                                                }}
                                                fullWidth
                                            />
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 0 }}></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>圖片</TableCell>
                                <TableCell>
                                    <Switch
                                        name="showImage"
                                        color="primary"
                                        checked={showImage ?? false}
                                        onChange={handleSwitch}
                                        disabled={!quiz}
                                    />
                                </TableCell>
                            </TableRow>
                            {mode !== QuizMode.oneInTwo && (
                                <>
                                    <TableRow>
                                        <TableCell>最高可選</TableCell>
                                        <TableCell>
                                            <NumberFormat
                                                customInput={StyledTextField}
                                                variant="standard"
                                                value={maxChoices ?? 1}
                                                onValueChange={({ value }) => {
                                                    handleUpdateQuiz({
                                                        maxChoices: value
                                                            ? Number(value)
                                                            : NaN,
                                                    })
                                                }}
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </>
                    )}
                </TableBody>
            </Table>

            <Box sx={{ textAlign: 'center', py: 2 }}>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                    刪除題目
                </Button>
            </Box>
        </TableContainer>
    )
}
