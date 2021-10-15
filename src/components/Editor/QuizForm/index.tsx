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
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import MenuSwapIcon from 'mdi-react/DragHorizontalVariantIcon'
import AddIcon from 'mdi-react/AddIcon'
import EditingQuiz from 'components/Quiz/EditingQuiz'
import TagsQuiz from 'components/Quiz/TagsQuiz'
import NextQuiz from 'components/Quiz/NextQuiz'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    selectCurrentForm,
    setQuizzes,
    updateQuiz,
    addQuiz,
} from 'store/slices/editor'
import { reorder, setId, getDefaultQuiz } from 'utils/helper'
import { QuizMode, QuizType } from 'common/types'
import type { SelectionQuiz } from 'common/types'
import { boxSizing } from '@mui/system'

type QuizProps = StackProps & {
    isDragging: boolean
    isEditing: boolean
}

const quizModes = {
    [QuizMode.page]: {
        value: QuizMode.page,
        label: '圖文',
    },
    [QuizMode.selection]: {
        value: QuizMode.selection,
        label: '複選',
    },
    [QuizMode.slider]: {
        value: QuizMode.slider,
        label: '拉桿',
    },
    [QuizMode.fill]: {
        value: QuizMode.fill,
        label: '填空',
    },
    [QuizMode.sort]: {
        value: QuizMode.sort,
        label: '排序',
    },
} as const

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

const StyledBar = styled(Grid)(({ theme }) => {
    const color = theme.palette.common.white

    return {
        color,
        backgroundColor: theme.palette.grey[800],
        position: 'relative',
        height: 48,
        '& .MuiSelect-select': {
            color,
        },
        '& .MuiSelect-icon': {
            color,
        },
        '& .MuiInput-root:before, & .MuiInput-root:after': {
            opacity: 0,
        },
    }
})

const QuizTabs = styled(Tabs)(({ theme }) => ({
    '& .Mui-selected': {
        backgroundColor: theme.palette.grey[700],
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .MuiTab-root': {
        color: theme.palette.common.white,
    },
    '& .Mui-disabled': {
        color: theme.palette.grey[700],
    },
}))

const ModeSelector = (props: {
    quiz?: QuizType
    formControlProps?: FormControlProps
    onChange: (event: SelectChangeEvent) => void
}) => {
    const { quiz, formControlProps, onChange } = props
    const { id = '', mode = '' } = quiz ?? {}
    return (
        <FormControl variant="standard" {...formControlProps}>
            <Select name={id} value={mode} onChange={onChange} autoWidth>
                {_.map(quizModes, (el) => (
                    <MenuItem key={el.value} value={el.value}>
                        {el.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default function QuizForm() {
    const dispatch = useAppDispatch()
    const form = useAppSelector(selectCurrentForm)
    const { id: formId, quizzes = [] } = form ?? {}

    const [selectedId, setSelectedId] = React.useState('')
    const [tab, setTab] = React.useState(0)

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

    const handleModeChange = (event: SelectChangeEvent) => {
        const quizId = event.target.name
        if (!quizId) {
            return
        }
        const mode = event.target.value as QuizMode

        dispatch(
            updateQuiz({
                formId,
                quizId,
                newValue: getDefaultQuiz(quizId, mode),
            })
        )
    }

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const quizId = event.target.name
        if (!quizId) {
            return
        }
        dispatch(
            updateQuiz({
                formId,
                quizId,
                newValue: { required: event.target.checked },
            })
        )
    }

    const renderView = () => {
        switch (tabValue) {
            case 0: {
                return (
                    <Box sx={{ p: 4 }}>
                        <Box
                            sx={{
                                p: 4,
                                backgroundColor: 'common.white',
                            }}
                        >
                            <EditingQuiz formId={formId} quiz={selectedQuiz} />
                        </Box>
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
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 3, borderBottom: '1px solid' }}
            >
                <Grid item>
                    <Typography variant="h6">編輯測驗內容</Typography>
                    <Typography variant="body1">
                        直接從預覽畫面中編輯測驗內容
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="outlined">預覽測驗</Button>
                    <Box
                        component="span"
                        sx={{ display: 'inline-block', width: 8 }}
                    />
                    <Button variant="contained">編輯個人化測驗結果</Button>
                </Grid>
            </Grid>
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
                                                            quiz={el}
                                                            onChange={
                                                                handleModeChange
                                                            }
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
                <Grid
                    item
                    sx={{
                        width: 'calc(100vw - 288px)',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'grey.700',
                        }}
                    >
                        <StyledBar container alignItems="center" sx={{ px: 2 }}>
                            <Typography
                                variant="subtitle1"
                                color="inherit"
                                sx={{
                                    display: 'inline',
                                    maxWidth: '20vw',
                                    mr: 4,
                                }}
                                noWrap
                            >
                                {selectedQuiz?.title || '未命名題目'}
                            </Typography>

                            <Grid item sx={{ mr: 2 }}>
                                <ModeSelector
                                    quiz={selectedQuiz}
                                    onChange={handleModeChange}
                                />
                            </Grid>

                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name={selectedQuiz?.id}
                                            color="primary"
                                            checked={
                                                selectedQuiz?.required ?? false
                                            }
                                            onChange={handleSwitchChange}
                                            disabled={!selectedQuiz}
                                        />
                                    }
                                    label="必填"
                                    labelPlacement="start"
                                />
                            </Grid>

                            <Box
                                className="absolute-vertical"
                                sx={{ right: 0 }}
                            >
                                <QuizTabs
                                    value={tabValue}
                                    onChange={(_, v) => setTab(v)}
                                >
                                    <Tab label="編輯題目" />
                                    <Tab
                                        label="答項標籤"
                                        disabled={disabledTab}
                                    />
                                    <Tab label="邏輯" disabled={disabledTab} />
                                </QuizTabs>
                            </Box>
                        </StyledBar>

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
