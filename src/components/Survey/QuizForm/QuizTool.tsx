import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material'
import NumberFormat from 'react-number-format'
import TextField from '@mui/material/TextField'
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
import ModeSelector from 'components/Survey/QuizForm/ModeSelector'
import { useAppDispatch, useAppSelector } from 'hooks'
import {
    updateQuiz,
    deleteQuiz,
    updateSurvey,
    selectCurrentSurvey,
} from 'store/slices/survey'
import { QuizMode } from 'common/types'
import type { SelectionQuiz, OnChangeInput, QuizType } from 'common/types'
import CardHorizonImage from 'assets/images/CardHorizonImage'
import CardVerticalImage from 'assets/images/CardVerticalImage'

type QuizToolProps = {
    surveyId: string
    quiz?: QuizType
}

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

    const { id: quizId, mode, backgroundColor } = quiz ?? {}
    const { direction, showImage, maxChoices } = (quiz as SelectionQuiz) ?? {}

    const handleChange: OnChangeInput = (event) => {
        const { name, value } = event.target
        const newValue = {
            [name]: value,
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
                    surveyId: surveyId,
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
                    surveyId: surveyId,
                    quizId,
                })
            )
        }
    }

    const handleSwitchSetting = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target
        const newValue = {
            setting: {
                ...setting,
                [name]: checked,
            },
        }

        if (surveyId) {
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
                        <TableCell>背景顏色</TableCell>
                        <TableCell>
                            <StyledTextField
                                name="backgroundColor"
                                value={backgroundColor ?? ''}
                                variant="standard"
                                onChange={handleChange}
                                fullWidth
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>背景圖片</TableCell>
                        <TableCell>
                            <ImageUploader
                                onUploaded={(backgroundImage) => {
                                    handleUpdateQuiz({
                                        backgroundImage,
                                    })
                                }}
                                sx={{ display: 'grid' }}
                                hideImage
                                hideDeleteButton
                            />
                        </TableCell>
                    </TableRow>

                    {_.includes([QuizMode.selection, QuizMode.sort], mode) && (
                        <>
                            <Header title="答項設定" />

                            {mode === QuizMode.selection && (
                                <>
                                    <TableRow>
                                        <TableCell component="th">
                                            答項排序
                                        </TableCell>
                                        <TableCell component="th"></TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            position: 'relative',
                                            height: 80,
                                        }}
                                    >
                                        <TableCell
                                            className="absolute-center"
                                            sx={{
                                                p: 0,
                                                width: '100%',
                                                height: '100% !important',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-around"
                                                alignItems="center"
                                            >
                                                <Button
                                                    onClick={() =>
                                                        handleUpdateQuiz({
                                                            direction: 'row',
                                                        })
                                                    }
                                                    sx={{
                                                        width: '50%',
                                                        bgcolor: (theme) =>
                                                            direction === 'row'
                                                                ? theme.palette
                                                                      .grey[900]
                                                                : '',
                                                    }}
                                                >
                                                    <Stack direction="column">
                                                        <CardHorizonImage />
                                                        水平
                                                    </Stack>
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleUpdateQuiz({
                                                            direction: 'column',
                                                        })
                                                    }
                                                    sx={{
                                                        width: '50%',
                                                        bgcolor: (theme) =>
                                                            direction ===
                                                            'column'
                                                                ? theme.palette
                                                                      .grey[900]
                                                                : '',
                                                    }}
                                                >
                                                    <Stack direction="column">
                                                        <CardVerticalImage />
                                                        垂直
                                                    </Stack>
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                        <TableCell
                                            sx={{ borderBottom: 0 }}
                                        ></TableCell>
                                    </TableRow>
                                </>
                            )}
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
