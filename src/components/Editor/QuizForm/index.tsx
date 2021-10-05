import * as React from 'react'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { styled } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import MenuSwapIcon from 'mdi-react/DragHorizontalVariantIcon'
import AddIcon from 'mdi-react/AddIcon'
import QuizWrapper from 'components/Quiz/QuizWrapper'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    selectForm,
    setQuizzes,
    updateQuiz,
    addQuiz,
} from 'store/slices/editor'
import { reorder, setId } from 'utils/helper'
import { QuizMode, SelectionQuiz, QuizType } from 'types/customTypes'

type QuizProps = GridProps & {
    isDragging: boolean
    isEditing: boolean
}

const quizModes = {
    [QuizMode.cover]: {
        value: QuizMode.cover,
        label: '封面',
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
    [QuizMode.transition]: {
        value: QuizMode.transition,
        label: '過場',
    },
} as const

const QuizItem = styled(Grid, {
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

const QuizBar = styled(Grid)(({ theme }) => {
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
}))

const QuizSelector = (props: {
    quiz?: QuizType
    handleChange: (event: SelectChangeEvent) => void
}) => {
    const { quiz, handleChange } = props
    const { id = '', mode = '' } = quiz ?? {}
    return (
        <FormControl
            variant="standard"
            sx={{
                maxWidth: 80,
            }}
        >
            <Select
                name={id}
                value={mode}
                onChange={id ? handleChange : undefined}
                autoWidth
            >
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
    const currentId = useAppSelector((state) => state.editor.currentId)
    const form = useAppSelector((state) => selectForm(state, currentId))

    const { quizzes = [] } = form ?? {}

    const [selectedId, setSelectedId] = React.useState('')
    const [tab, setTab] = React.useState(0)

    const selectedQuiz: QuizType | undefined = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [selectedId, quizzes])

    const updateQuizzes = (quizzes: QuizType[]) => {
        dispatch(setQuizzes({ id: currentId, quizzes }))
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
        const newValue: SelectionQuiz = {
            id: setId(),
            title: '新題目',
            mode: QuizMode.selection,
            choices: [],
            values: [],
            maxChoices: 1,
            showLabel: true,
            showImage: false,
        }

        dispatch(addQuiz({ id: currentId, newValue }))
    }

    const handleModeChange = (event: SelectChangeEvent) => {
        dispatch(
            updateQuiz({
                id: currentId,
                newValue: { mode: event.target.value as QuizMode },
                predicate: (el) => el.id === event.target.name,
            })
        )
    }

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            updateQuiz({
                id: currentId,
                newValue: { required: event.target.checked },
                predicate: (el) => el.id === event.target.name,
            })
        )
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
            <Grid container sx={{ height: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{ width: 288, height: '100%', overflowY: 'auto' }}
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
                                                    container
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
                                                    alignItems="center"
                                                    alignContent="space-between"
                                                    onClick={() =>
                                                        setSelectedId(el.id)
                                                    }
                                                >
                                                    <Grid
                                                        item
                                                        xs={8}
                                                        sx={{
                                                            position:
                                                                'relative',
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
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs
                                                        sx={{
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        <QuizSelector
                                                            quiz={el}
                                                            handleChange={
                                                                handleModeChange
                                                            }
                                                        />
                                                    </Grid>
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
                            onClick={handleAdd}
                        >
                            增加頁面
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'grey.700',
                        }}
                    >
                        <QuizBar container alignItems="center" sx={{ px: 2 }}>
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
                                <QuizSelector
                                    quiz={selectedQuiz}
                                    handleChange={handleModeChange}
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
                                    value={tab}
                                    onChange={(_, v) => setTab(v)}
                                >
                                    <Tab label="編輯題目" />
                                    <Tab label="答項標籤" />
                                    <Tab label="邏輯" />
                                </QuizTabs>
                            </Box>
                        </QuizBar>

                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: 'calc(100% - 48px)',
                            }}
                        >
                            <Box
                                className="absolute-center"
                                sx={{ width: '80%', height: 0, pt: '60%' }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'common.white',
                                    }}
                                >
                                    <QuizWrapper quiz={selectedQuiz} editing />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
