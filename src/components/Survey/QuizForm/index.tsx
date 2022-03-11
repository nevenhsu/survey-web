import * as React from 'react'
import _ from 'lodash'
import clsx from 'clsx'
import Joyride, { Step } from 'react-joyride'
import { useDimensionsRef } from 'rooks'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { styled, useTheme } from '@mui/material/styles'
import Stack, { StackProps } from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Badge from '@mui/material/Badge'
import Modal from '@mui/material/Modal'
import Popper from '@mui/material/Popper'
import LinearProgress from '@mui/material/LinearProgress'
import DeviceMode, { getRatio, getWidth } from 'components/common/DeviceMode'
import AspectRatioBox from 'components/common/AspectRatioBox'
import ScaleBox from 'components/common/ScaleBox'
import QuizTool from 'components/Survey/QuizForm/QuizTool'
import ModeSelector from 'components/Survey/QuizForm/Shares/ModeSelector'
import CloseIcon from 'mdi-react/CloseIcon'
import AlertCircleIcon from 'mdi-react/AlertCircleIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import {
    selectDevice,
    selectJoyride,
    setJoyride,
} from 'store/slices/userDefault'
import {
    selectCurrentSurvey,
    setQuizzes,
    addQuiz,
    setStep,
} from 'store/slices/survey'
import { reorder, setId, getDefaultQuiz, setClasses } from 'utils/helper'
import { QuizMode, QuizType, SurveyStep } from 'common/types'
import type {
    SelectionQuiz,
    DraggerQuiz,
    OneInTwoQuiz,
    Tags,
} from 'common/types'

export const classes = setClasses('QuizForm', ['1', '2', '3', '4', '5', '6'])

const Grow = styled('div')({
    flexGrow: 1,
})

const Editor = React.lazy(
    () => import('components/Survey/QuizForm/View/Editor')
)
const TagTable = React.lazy(
    () => import('components/Survey/QuizForm/View/TagTable')
)
const AnswerTable = React.lazy(
    () => import('components/Survey/QuizForm/View/AnswerTable')
)
const NextTable = React.lazy(
    () => import('components/Survey/QuizForm/View/NextTable')
)

type QuizProps = StackProps & {
    isDragging: boolean
    isEditing: boolean
}

const QuizItem = styled(Stack, {
    shouldForwardProp: (prop) => !_.includes(['isDragging', 'isEditing'], prop),
})<QuizProps>(({ isDragging, isEditing, theme }) => ({
    userSelect: 'none',
    marginBottom: 8,
    padding: '2px 8px',
    color: isEditing ? theme.palette.common.white : theme.palette.grey[800],
    backgroundColor: isEditing ? theme.palette.grey[800] : 'transparent',
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: 1,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.grey[500],
    },
    '& .MuiTab-root': {
        color: theme.palette.grey[500],
        borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
    '& .Mui-selected': {
        color: theme.palette.grey[800],
        '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: 1,
            bottom: 0,
            left: 0,
            borderBottom: `1px solid ${theme.palette.grey[200]}`,
            zIndex: 1,
        },
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .Mui-disabled': {
        color: theme.palette.grey[300],
    },
}))

const steps: Array<Step> = [
    {
        placement: 'center',
        target: 'body',
        title: '第一次使用超市調？',
        content: '跟著我們的小小導覽，帶您熟悉如何建立第一個自己的測驗！',
    },
    {
        placement: 'bottom',
        target: `.${classes[1]}`,
        title: '這裡是導覽列',
        content:
            '導覽列會告訴您完成一個測驗所需要的步驟，也會顯示現在所在的步驟以及說明',
    },
    {
        placement: 'right',
        target: `.${classes[2]}`,
        title: '題目列表',
        content: '點擊可以編輯測驗中的不同題目，拖曳可以改變順序',
    },
    {
        disableBeacon: true,
        placement: 'bottom',
        offset: -240,
        target: `.${classes[3]}`,
        title: '題目編輯區域',
        content:
            '在這裡你可以編輯測驗的不同題目以及調整設定，在畫面中可以即時預覽',
    },
    {
        placement: 'left',
        target: `.${classes[4]}`,
        title: '題目設定區域',
        content:
            '在這裡你可以編輯測驗的不同題目以及調整設定，在畫面中可以即時預覽',
    },
    {
        placement: 'bottom',
        target: `.${classes[5]}`,
        title: '設定功能切換',
        content:
            '這邊的 tab 可以選擇要編輯該題目答案的標籤，或是選擇不同答案之後的跳題邏輯',
    },
    {
        placement: 'bottom',
        target: `.${classes[6]}`,
        title: '預覽測驗/下一步',
        content:
            '編輯測驗中，隨時可以預覽。點擊此按鈕會開新視窗讓您測試目前的測驗。確定都沒問題後，就可以到下一步囉！',
    },
]

export default function QuizForm() {
    const theme = useTheme()
    const dispatch = useAppDispatch()

    const [ref, dimensions] = useDimensionsRef()
    const survey = useAppSelector(selectCurrentSurvey)
    const { uploading, handlePreview } = usePreview(survey)

    const { id: surveyId, quizzes = [], setting, tags } = survey ?? {}
    const { showProgress, maxWidth } = setting ?? {}

    const [selectedId, setSelectedId] = React.useState('')
    const [tab, setTab] = React.useState(0)
    const [progress, setProgress] = React.useState(0)
    const [invalidTag, setInvalidTag] = React.useState<string[]>([])
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [open, setOpen] = React.useState(false)
    const [mode, setMode] = React.useState<QuizMode>(QuizMode.page)

    const run = useAppSelector(selectJoyride)
    const device = useAppSelector(selectDevice)
    const deviceWidth = getWidth(device, dimensions)

    const selectedQuiz: QuizType | undefined = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [selectedId, quizzes])

    const disabledTab = ![
        QuizMode.selection,
        QuizMode.sort,
        QuizMode.oneInTwo,
        QuizMode.dragger,
    ].includes(selectedQuiz?.mode as any)

    const disabledNext =
        ![QuizMode.selection, QuizMode.sort].includes(
            selectedQuiz?.mode as any
        ) || (selectedQuiz as SelectionQuiz)?.maxChoices > 1

    const tabValue = disabledTab ? 0 : disabledNext && tab === 2 ? 0 : tab

    const closeJoyRide = () => {
        dispatch(setJoyride(false))
    }

    const nextStep = () => {
        dispatch(setStep(SurveyStep.result))
    }

    const updateQuizzes = (quizzes: QuizType[]) => {
        dispatch(setQuizzes({ id: surveyId, quizzes }))
    }

    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        updateQuizzes(
            reorder(quizzes, result.source.index, result.destination.index)
        )
    }

    const handleAdd = () => {
        const quizId = setId()
        const newValue = getDefaultQuiz(quizId, mode)
        dispatch(addQuiz({ id: surveyId, newValue }))
        setSelectedId(quizId)
        setOpen(false)
    }

    const renderView = () => {
        switch (tabValue) {
            case 0: {
                return (
                    <>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                py: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    mx: 'auto',
                                    width: deviceWidth,
                                }}
                            >
                                <AspectRatioBox
                                    ratio={getRatio(device)}
                                    sx={{
                                        bgcolor:
                                            selectedQuiz?.backgroundColor ||
                                            'white',
                                    }}
                                >
                                    <ScaleBox
                                        device={device}
                                        containerWidth={deviceWidth}
                                    >
                                        <Editor
                                            surveyId={surveyId}
                                            quiz={selectedQuiz}
                                        />
                                    </ScaleBox>
                                </AspectRatioBox>

                                {showProgress && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <DeviceMode sx={{ mb: 2 }} />
                    </>
                )
            }
            case 1: {
                return (
                    <>
                        {selectedQuiz?.mode === QuizMode.dragger ? (
                            <AnswerTable quiz={selectedQuiz as DraggerQuiz} />
                        ) : (
                            <TagTable quiz={selectedQuiz as SelectionQuiz} />
                        )}
                    </>
                )
            }
            case 2: {
                return (
                    <>
                        <NextTable quiz={selectedQuiz as SelectionQuiz} />
                    </>
                )
            }
        }
    }

    React.useEffect(() => {
        setSelectedId(_.get(quizzes, '0.id', ''))
    }, [])

    React.useEffect(() => {
        if (selectedQuiz && quizzes.length) {
            const { id } = selectedQuiz
            const num = _.findIndex(quizzes, { id }) + 1
            const val = _.round((num / quizzes.length) * 100)
            setProgress(val)
            return
        }
        setProgress(0)
    }, [selectedQuiz, quizzes])

    React.useEffect(() => {
        if (selectedId) {
            const quiz = _.find(quizzes, { id: selectedId })
            if (_.isEmpty(quiz) && quizzes.length) {
                setSelectedId(_.get(quizzes, '0.id', ''))
            }
        }
    }, [selectedId, quizzes])

    React.useEffect(() => {
        if (selectedQuiz?.mode === QuizMode.oneInTwo) {
            const quiz = selectedQuiz as OneInTwoQuiz
            const invalid = checkInvalidTag(quiz, tags)
            setInvalidTag(invalid)
        } else {
            setInvalidTag([])
        }
    }, [selectedQuiz, tags])

    const renderInvalidContent = () => {
        const [tagId] = invalidTag
        const { label, values = [] } = tags[tagId] ?? {}
        const num = values.length

        return (
            <Paper
                elevation={4}
                sx={{
                    width: 540,
                    borderRadius: 2,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="start"
                    justifyContent="stretch"
                    spacing={2}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            color: (theme) => theme.palette.error.main,
                            height: 180,
                            flex: '0 0 80px',
                        }}
                    >
                        <AlertCircleIcon
                            className="absolute-center"
                            size={32}
                        />
                    </Box>
                    <Box sx={{ py: 3 }}>
                        <Typography fontWeight="bold" sx={{ mb: 2 }}>
                            偵測到每個標籤的答項數量不同
                        </Typography>

                        <Typography sx={{ mb: 3 }}>
                            我們偵測到{' '}
                            {invalidTag.map((tagId, index) => {
                                const label = _.get(tags, [tagId, 'label'], '')
                                return (
                                    <Box key={tagId} component="span">
                                        <Box
                                            component="span"
                                            sx={{
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            {label}
                                        </Box>
                                        {index !== invalidTag.length - 1 && (
                                            <span>、</span>
                                        )}
                                    </Box>
                                )
                            })}{' '}
                            類別的標籤，對應到不同數量的答項。
                        </Typography>

                        <Typography variant="caption">
                            以 {label} 為例，有 {num} 個標籤，應該就要有為 {num}{' '}
                            之倍數的答項總數。假設每個標籤有 2
                            個答項，總共就應該有 {num * 2} 個答項。
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <IconButton
                            color="error"
                            onClick={() => setAnchorEl(null)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Stack>
            </Paper>
        )
    }

    return (
        <>
            <Joyride
                run={run}
                steps={steps}
                continuous={true}
                styles={{
                    tooltip: {
                        width: 540,
                        padding: 24,
                    },
                }}
                tooltipComponent={({
                    continuous,
                    index,
                    step,
                    backProps,
                    closeProps,
                    primaryProps,
                    tooltipProps,
                }) => (
                    <Paper
                        {...tooltipProps}
                        sx={{
                            width: 540,
                            borderRadius: 2,
                            p: 3,
                        }}
                    >
                        <Box textAlign="center" pb={5}>
                            {step.title && (
                                <Typography
                                    variant={index === 0 ? 'h4' : 'h5'}
                                    gutterBottom
                                >
                                    {step.title}
                                </Typography>
                            )}
                            <Typography variant="body1" px={9} gutterBottom>
                                {step.content}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="text"
                                onClick={() => closeJoyRide()}
                            >
                                跳過
                            </Button>
                            <Grow />
                            {index > 0 && (
                                <Button {...backProps} variant="outlined">
                                    回上一步
                                </Button>
                            )}
                            {index < steps.length - 1 && (
                                <Button {...primaryProps} variant="contained">
                                    {`下一步 ${index + 1}/${steps.length}`}
                                </Button>
                            )}
                            {index === steps.length - 1 && (
                                <Button
                                    {...closeProps}
                                    variant="contained"
                                    onClick={() => closeJoyRide()}
                                >
                                    {`完成 ${index + 1}/${steps.length}`}
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                )}
            />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 3, height: 80, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h5" gutterBottom>
                        編輯測驗內容
                    </Typography>
                    <Typography variant="body1">
                        直接從預覽畫面中編輯測驗內容
                    </Typography>
                </Box>
                <Box className={classes[6]}>
                    <LoadingButton
                        variant="outlined"
                        loading={uploading}
                        disabled={uploading}
                        onClick={handlePreview}
                    >
                        預覽測驗
                    </LoadingButton>

                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained" onClick={nextStep}>
                        編輯個人化測驗結果
                    </Button>
                </Box>
            </Stack>

            <Stack direction="row">
                <Box
                    className={classes[2]}
                    sx={{
                        flex: '0 0 304px',
                        height: '100vh',
                        overflowY: 'auto',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                        borderRight: `1px solid ${theme.palette.grey[500]}`,
                    }}
                >
                    <Typography py={2} px={2} marginBottom={1}>
                        題目列表
                    </Typography>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {quizzes.map((el, index) => (
                                        <Draggable
                                            key={el.id}
                                            draggableId={el.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <QuizItem
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    isDragging={
                                                        snapshot.isDragging
                                                    }
                                                    isEditing={
                                                        el.id === selectedId
                                                    }
                                                    style={{
                                                        ...provided
                                                            .draggableProps
                                                            .style,
                                                    }}
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    onClick={() =>
                                                        setSelectedId(el.id)
                                                    }
                                                >
                                                    <Box
                                                        sx={{
                                                            position:
                                                                'relative',
                                                            width: `calc(100% - 56px)`,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                px: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                color="inherit"
                                                                sx={{
                                                                    display:
                                                                        'inline',
                                                                }}
                                                                noWrap
                                                            >
                                                                {_.get(
                                                                    el,
                                                                    'title.text'
                                                                ) ||
                                                                    '未命名題目'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        <ModeSelector
                                                            surveyId={surveyId}
                                                            quiz={el}
                                                            formControlProps={{
                                                                sx: {
                                                                    '& .MuiSelect-select':
                                                                        {
                                                                            px: '4px !important',
                                                                        },
                                                                },
                                                            }}
                                                            showArrow={false}
                                                        />
                                                    </Box>
                                                </QuizItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Box sx={{ px: 2, py: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(true)
                            }}
                        >
                            增加題目
                        </Button>
                    </Box>
                </Box>

                <Box
                    className={classes[3]}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100vh',
                        bgcolor: 'grey.200',
                    }}
                >
                    <Box className={classes[5]} sx={{ position: 'relative' }}>
                        <StyledTabs
                            value={tabValue}
                            onChange={(_, v) => setTab(v)}
                        >
                            <Tab label="編輯題目" />

                            <Tab
                                label={
                                    <Box
                                        onClick={(event) => {
                                            if (!_.isEmpty(invalidTag)) {
                                                setAnchorEl(event.currentTarget)
                                            }
                                        }}
                                    >
                                        <Badge
                                            color="error"
                                            variant="dot"
                                            invisible={_.isEmpty(invalidTag)}
                                        >
                                            {selectedQuiz?.mode ===
                                            QuizMode.dragger
                                                ? '題目邏輯'
                                                : '答項標籤'}
                                        </Badge>
                                    </Box>
                                }
                                disabled={disabledTab}
                                className={clsx({
                                    'c-disabled': disabledTab,
                                })}
                            />

                            <Tab
                                label="跳題邏輯"
                                disabled={disabledTab || disabledNext}
                                className={clsx({
                                    'c-disabled': disabledTab || disabledNext,
                                })}
                            />
                        </StyledTabs>
                    </Box>

                    <Box
                        ref={ref as any}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: 'calc(100vh - 48px)',
                            borderRight: `1px solid ${theme.palette.grey[500]}`,
                        }}
                    >
                        <React.Suspense fallback={<div />}>
                            {renderView()}
                        </React.Suspense>
                    </Box>
                </Box>

                {tab === 0 && (
                    <Box
                        className={classes[4]}
                        sx={{
                            position: 'relative',
                            flex: '0 0 312px',
                            height: '100vh',
                            overflowY: 'auto',
                            bgcolor: 'grey.200',
                            '::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                height: 48,
                                borderBottom: `1px solid ${theme.palette.grey[500]}`,
                            }}
                        />

                        <QuizTool surveyId={surveyId} quiz={selectedQuiz} />
                    </Box>
                )}
            </Stack>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
            >
                <Box
                    className="absolute-center"
                    sx={{
                        width: 480,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        新增題目類型
                    </Typography>

                    <ModeSelector
                        quiz={{ mode } as any}
                        formControlProps={{
                            variant: 'outlined',
                            sx: {
                                my: 2,
                            },
                        }}
                        onChange={(event) =>
                            setMode(event.target.value as QuizMode)
                        }
                    />

                    <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" onClick={handleAdd}>
                            新增
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl}>
                {renderInvalidContent()}
            </Popper>
        </>
    )
}

function checkInvalidTag(
    quiz: OneInTwoQuiz,
    tags: { [tagId: string]: Tags }
): string[] {
    const { choices = [], tagsId = [] } = quiz

    const countTags: {
        [tagId: string]: {
            [tag: string]: number
        }
    } = {}

    const invalidTag: string[] = []

    if (_.isEmpty(choices) || _.isEmpty(tagsId)) {
        return invalidTag
    }

    _.forEach(tagsId, (tagId) => {
        const tagData = tags[tagId]
        if (!_.isEmpty(tagData)) {
            // check choice number
            const { values = [] } = tagData
            const val = choices.length % values.length
            if (val !== 0) {
                invalidTag.push(tagId)
            }

            const selectedTag = _.flatten(
                _.map(choices, (el) => el.tags[tagId])
            )
            countTags[tagId] = _.countBy(selectedTag)
        }
    })

    // check tag count
    _.forEach(countTags, (count, tagId) => {
        const tagData = tags[tagId]

        if (!_.isEmpty(tagData)) {
            const { values = [] } = tagData
            let num: number

            _.forEach(values, (tag) => {
                const number = count[tag]

                if (!_.includes(invalidTag, tagId)) {
                    if (!Boolean(number)) {
                        invalidTag.push(tagId)
                        return
                    }

                    if (num === undefined) {
                        num = number
                    } else if (num !== number) {
                        invalidTag.push(tagId)
                        return
                    }
                }
            })
        }
    })

    return _.uniq(invalidTag)
}
