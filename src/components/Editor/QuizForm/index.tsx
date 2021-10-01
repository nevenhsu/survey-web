import * as React from 'react'
import _ from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { styled } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuSwapIcon from 'mdi-react/DragHorizontalVariantIcon'
import AddIcon from 'mdi-react/AddIcon'
import { reorder, setId } from 'utils/helper'
import Forms from 'utils/forms'
import { QuizMode, Quiz, SelectionQuiz, Quizzes } from 'types/customTypes'

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
        label: '選擇題',
    },
    [QuizMode.slider]: {
        value: QuizMode.slider,
        label: '拉桿',
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

export default function QuizForm() {
    const forms = Forms.getInstance()

    const [editing, setEditing] = React.useState('')

    const [quizzes, setQuizzes] = React.useState<Array<Quizzes>>([
        {
            id: setId(),
            mode: QuizMode.cover,
            title: '問券標題',
        },
    ])

    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }
        setQuizzes((state) =>
            reorder(state, result.source.index, result.destination.index)
        )
    }

    const updateQuiz = (
        newValue: Partial<Quizzes>,
        predicate: (el: Quizzes) => boolean
    ) => {
        setQuizzes((state) =>
            Array.from(state).map((el) =>
                predicate(el)
                    ? {
                          ...el,
                          ...newValue,
                      }
                    : el
            )
        )
    }

    const handleAdd = () => {
        const newQuiz: SelectionQuiz = {
            id: setId(),
            title: '新題目',
            mode: QuizMode.selection,
            choices: [],
            selected: [],
            maxChoices: 1,
            showLabel: true,
            showImage: false,
        }
        setQuizzes((state) => [...state, newQuiz])
    }

    const handleModeChange = (event: SelectChangeEvent) => {
        updateQuiz(
            { mode: event.target.value as QuizMode },
            (el) => el.id === event.target.name
        )
    }

    React.useEffect(() => {
        setEditing(_.get(quizzes, '0.id', ''))
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
                                                        el.id === editing
                                                    }
                                                    style={
                                                        provided.draggableProps
                                                            .style
                                                    }
                                                    alignItems="center"
                                                    alignContent="space-between"
                                                    onClick={() =>
                                                        setEditing(el.id)
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
                                                                {el.title}
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
                                                        <FormControl
                                                            variant="standard"
                                                            sx={{
                                                                right: 8,
                                                                maxWidth: 80,
                                                            }}
                                                        >
                                                            <Select
                                                                name={el.id}
                                                                value={el.mode}
                                                                onChange={
                                                                    handleModeChange
                                                                }
                                                                autoWidth
                                                            >
                                                                {_.map(
                                                                    quizModes,
                                                                    (el) => (
                                                                        <MenuItem
                                                                            key={
                                                                                el.value
                                                                            }
                                                                            value={
                                                                                el.value
                                                                            }
                                                                        >
                                                                            {
                                                                                el.label
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </FormControl>
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
                    ></Box>
                </Grid>
            </Grid>
        </>
    )
}
