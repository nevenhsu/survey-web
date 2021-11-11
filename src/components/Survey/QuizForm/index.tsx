import * as React from 'react'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack, { StackProps } from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Box, { BoxProps } from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import LinearProgress from '@mui/material/LinearProgress'
import DeviceMode from 'components/common/DeviceMode'
import QuizTool from 'components/Survey/QuizForm/QuizTool'
import ModeSelector from 'components/Survey/QuizForm/Shares/ModeSelector'
import MenuSwapIcon from 'mdi-react/DragHorizontalVariantIcon'
import AddIcon from 'mdi-react/AddIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import usePreview from 'hooks/usePreview'
import { selectDevice } from 'store/slices/userDefault'
import {
    selectCurrentSurvey,
    setQuizzes,
    addQuiz,
    setStep,
} from 'store/slices/survey'
import { reorder, setId, getDefaultQuiz } from 'utils/helper'
import ThemeProvider from 'theme/ThemeProvider'
import { QuizMode, QuizType, SurveyStep } from 'common/types'
import type { SelectionQuiz, DeviceType } from 'common/types'

const Editor = React.lazy(
    () => import('components/Survey/QuizForm/View/Editor')
)
const TagTable = React.lazy(
    () => import('components/Survey/QuizForm/View/TagTable')
)
const NextTable = React.lazy(
    () => import('components/Survey/QuizForm/View/NextTable')
)

type QuizProps = StackProps & {
    isDragging: boolean
    isEditing: boolean
}

type StyledBoxProps = BoxProps & {
    device: DeviceType
}

const QuizItem = styled(Stack, {
    shouldForwardProp: (prop) => !_.includes(['isDragging', 'isEditing'], prop),
})<QuizProps>(({ isDragging, isEditing, theme }) => ({
    userSelect: 'none',
    padding: 8,
    marginBottom: 8,
    color: isDragging ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: isEditing
        ? theme.palette.grey[100]
        : theme.palette.common.white,
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        color: theme.palette.common.white,
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.grey[700],
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .Mui-disabled': {
        color: theme.palette.grey[700],
    },
}))

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'device',
})<StyledBoxProps>(({ theme, device }) => {
    const style = getDeviceStyle(device)

    return {
        ...style,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        '& > div': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
        },
    }
})

export default function QuizForm() {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectCurrentSurvey)
    const { uploading, handlePreview } = usePreview(survey)

    const { id: surveyId, quizzes = [], setting } = survey ?? {}
    const { showProgress } = setting ?? {}

    const [selectedId, setSelectedId] = React.useState('')
    const [tab, setTab] = React.useState(0)
    const [progress, setProgress] = React.useState(0)

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [mode, setMode] = React.useState<QuizMode>(QuizMode.page)

    const device = useAppSelector(selectDevice)

    const selectedQuiz: QuizType | undefined = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [selectedId, quizzes])

    const disabledTab = ![
        QuizMode.selection,
        QuizMode.sort,
        QuizMode.oneInTwo,
    ].includes(selectedQuiz?.mode as any)

    const disabledNext =
        ![QuizMode.selection, QuizMode.sort].includes(
            selectedQuiz?.mode as any
        ) || (selectedQuiz as SelectionQuiz)?.maxChoices > 1

    const tabValue = disabledTab ? 0 : disabledNext && tab === 2 ? 0 : tab

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
        handleClose()
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
                                my: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: getDeviceWidth(device),
                                    mx: 'auto',
                                }}
                            >
                                <StyledBox device={device}>
                                    <div>
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

                                        <Editor
                                            surveyId={surveyId}
                                            quiz={selectedQuiz}
                                        />
                                    </div>
                                </StyledBox>
                            </Box>
                        </Box>

                        <DeviceMode sx={{ mb: 2 }} />
                    </>
                )
            }
            case 1: {
                return (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'grey.300',
                        }}
                    >
                        <TagTable quiz={selectedQuiz as SelectionQuiz} />
                    </Box>
                )
            }
            case 2: {
                return (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'grey.300',
                        }}
                    >
                        <NextTable quiz={selectedQuiz as SelectionQuiz} />
                    </Box>
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

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Box>
                    <Typography variant="h6">編輯測驗內容</Typography>
                    <Typography variant="body1">
                        直接從預覽畫面中編輯測驗內容
                    </Typography>
                </Box>
                <Box>
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
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                >
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    sx={{
                                        backgroundColor: 'common.white',
                                        p: 2,
                                    }}
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
                                                    style={
                                                        provided.draggableProps
                                                            .style
                                                    }
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
                                                        <MenuSwapIcon
                                                            className="absolute-vertical"
                                                            size={16}
                                                        />

                                                        <Box
                                                            sx={{
                                                                pl: 3,
                                                                display: 'flex',
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
                                                                {el.title ||
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

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                        >
                            增加題目
                        </Button>
                    </Box>
                </Grid>
                <ThemeProvider mode="dark">
                    <Grid item xs>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                bgcolor: (theme) => theme.palette.grey[700],
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: (theme) => theme.palette.grey[800],
                                }}
                            >
                                <StyledTabs
                                    value={tabValue}
                                    onChange={(_, v) => setTab(v)}
                                >
                                    <Tab label="編輯題目" />
                                    <Tab
                                        label="答項標籤"
                                        disabled={disabledTab}
                                    />
                                    <Tab
                                        label="邏輯"
                                        disabled={disabledTab || disabledNext}
                                    />
                                </StyledTabs>
                            </Box>

                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <React.Suspense fallback={<div />}>
                                    {renderView()}
                                </React.Suspense>
                            </Box>
                        </Box>
                    </Grid>

                    {tab === 0 && (
                        <Grid
                            item
                            sx={{
                                width: 288,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: (theme) => theme.palette.grey[800],
                                }}
                            >
                                <QuizTool
                                    surveyId={surveyId}
                                    quiz={selectedQuiz}
                                />
                            </Box>
                        </Grid>
                    )}
                </ThemeProvider>
            </Grid>

            <Modal open={open} onClose={handleClose}>
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
                            sx: { my: 2 },
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
        </>
    )
}

function getDeviceStyle(device: DeviceType) {
    switch (device) {
        case 'mobile': {
            return {
                width: '100%',
                paddingTop: '177%',
                height: 0,
            }
        }
        case 'laptop': {
            return {
                width: '100%',
                paddingTop: '75%',
                height: 0,
            }
        }
        case 'desktop': {
            return {
                width: '100%',
                paddingTop: '56.25%',
                height: 0,
            }
        }
    }
}

function getDeviceWidth(device: DeviceType) {
    switch (device) {
        case 'mobile': {
            return 375
        }
        case 'laptop': {
            return 'calc(100vw - 656px)'
        }
        case 'desktop': {
            return 'calc(100vw - 656px)'
        }
    }
}
