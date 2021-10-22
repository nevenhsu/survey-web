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
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Box, { BoxProps } from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import QuizTool from 'components/Editor/QuizForm/QuizTool'
import ModeSelector from 'components/Editor/QuizForm/ModeSelector'
import EditingQuiz from 'components/Quiz/EditingQuiz'
import TagsQuiz from 'components/Quiz/TagsQuiz'
import NextQuiz from 'components/Quiz/NextQuiz'
import MenuSwapIcon from 'mdi-react/DragHorizontalVariantIcon'
import AddIcon from 'mdi-react/AddIcon'
import LaptopIcon from 'mdi-react/LaptopIcon'
import CellphoneIcon from 'mdi-react/CellphoneIcon'
import DesktopMacIcon from 'mdi-react/DesktopMacIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectCurrentForm, setQuizzes, addQuiz } from 'store/slices/editor'
import { reorder, setId, getDefaultQuiz } from 'utils/helper'
import ThemeProvider from 'theme/ThemeProvider'
import { QuizMode, QuizType } from 'common/types'
import type { SelectionQuiz, DeviceType } from 'common/types'

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
    const form = useAppSelector(selectCurrentForm)
    const { id: formId, quizzes = [], setting } = form ?? {}

    const [selectedId, setSelectedId] = React.useState('')
    const [tab, setTab] = React.useState(0)
    const [device, setDevice] = React.useState<DeviceType>('mobile')

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [mode, setMode] = React.useState<QuizMode>(QuizMode.page)

    const selectedQuiz: QuizType | undefined = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [selectedId, quizzes])

    const disabledTab = ![QuizMode.selection, QuizMode.sort].includes(
        selectedQuiz?.mode as any
    )
    const tabValue = disabledTab ? 0 : tab

    const updateQuizzes = (quizzes: QuizType[]) => {
        dispatch(setQuizzes({ id: formId, quizzes }))
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
        const newValue = getDefaultQuiz(setId(), mode)
        dispatch(addQuiz({ id: formId, newValue }))
        handleClose()
    }

    const renderView = () => {
        switch (tabValue) {
            case 0: {
                return (
                    <Box
                        sx={{ p: 4, width: getDeviceWidth(device), mx: 'auto' }}
                    >
                        <StyledBox device={device}>
                            <div>
                                <EditingQuiz
                                    formId={formId}
                                    quiz={selectedQuiz}
                                />
                            </div>
                        </StyledBox>

                        <Stack
                            direction="row"
                            justifyContent="center"
                            spacing={2}
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            sx={{
                                position: 'fixed',
                                bottom: 8,
                                left: 'calc(50vw - 84px)',
                            }}
                        >
                            <IconButton
                                color={
                                    device === 'mobile' ? 'primary' : undefined
                                }
                                onClick={() => setDevice('mobile')}
                                size="small"
                            >
                                <CellphoneIcon />
                            </IconButton>
                            <IconButton
                                color={
                                    device === 'laptop' ? 'primary' : undefined
                                }
                                onClick={() => setDevice('laptop')}
                                size="small"
                            >
                                <LaptopIcon />
                            </IconButton>
                            <IconButton
                                color={
                                    device === 'desktop' ? 'primary' : undefined
                                }
                                onClick={() => setDevice('desktop')}
                                size="small"
                            >
                                <DesktopMacIcon />
                            </IconButton>
                        </Stack>
                    </Box>
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
                        <TagsQuiz quiz={selectedQuiz as SelectionQuiz} />
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
                        <NextQuiz quiz={selectedQuiz as SelectionQuiz} />
                    </Box>
                )
            }
        }
    }

    React.useEffect(() => {
        setSelectedId(_.get(quizzes, '0.id', ''))
    }, [])

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
                    <Button variant="outlined">預覽測驗</Button>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained">編輯個人化測驗結果</Button>
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
                                                            formId={formId}
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
                                    <Tab label="邏輯" disabled={disabledTab} />
                                </StyledTabs>
                            </Box>

                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                {renderView()}
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
                                <QuizTool formId={formId} quiz={selectedQuiz} />
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
            return 'calc(100vw - 576px)'
        }
        case 'desktop': {
            return 'calc(100vw - 576px)'
        }
    }
}
