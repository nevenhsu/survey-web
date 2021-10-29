import * as React from 'react'
import _ from 'lodash'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Badge from '@mui/material/Badge'
import ChoiceView from 'components/Answer/ChoiceView'
import QuizButton, { QuizButtonProps } from 'components/Answer/QuizButton'
import { reorder } from 'utils/helper'
import type { OnChangeInput, SelectionType, ChoiceType } from 'common/types'

type SortViewProps = {
    title: string
    selectionProps: SelectionType
    quizButtonProps: QuizButtonProps
    onChange: OnChangeInput
}

enum DropId {
    selected = 'selected',
    unselected = 'unselected',
}

type OptionsType = {
    selected: ChoiceType[]
    unselected: ChoiceType[]
}

export default function SortView(props: SortViewProps) {
    const matches = useMediaQuery('(min-width:600px)')

    const { title, selectionProps, quizButtonProps, onChange } = props
    const { values = [], choices = [], maxChoices, showImage } = selectionProps

    const [options, setOptions] = React.useState<OptionsType>({
        selected: [],
        unselected: [],
    })

    const { selected, unselected } = options

    const toggleSelected = (id: string, isSelected: boolean) => {
        if (id) {
            if (isSelected) {
                const option = _.find(selected, { id })
                const newSelected = selected.filter((el) => el.id !== id)
                const newUnselected = _.compact([...unselected, option])

                setOptions({
                    selected: newSelected,
                    unselected: newUnselected,
                })

                onChange({
                    target: {
                        name: 'values',
                        value: newSelected.map((el) => el.id),
                    },
                } as any)
            } else {
                if (selected.length < maxChoices) {
                    const option = _.find(unselected, { id })
                    const newUnselected = unselected.filter(
                        (el) => el.id !== id
                    )
                    const newSelected = _.compact([...selected, option])

                    setOptions({
                        selected: newSelected,
                        unselected: newUnselected,
                    })

                    onChange({
                        target: {
                            name: 'values',
                            value: newSelected.map((el) => el.id),
                        },
                    } as any)
                }
            }
        }
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result ?? {}
        // dropped outside the list
        if (!destination) {
            return
        }

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        const start = DropId[source.droppableId as DropId]
        const end = DropId[destination.droppableId as DropId]

        if (start === end) {
            const choices = end === DropId.unselected ? unselected : selected
            const values: ChoiceType[] = reorder(
                choices,
                source.index,
                destination.index
            )

            setOptions((state) => ({ ...state, [end]: values }))

            if (end === DropId.selected) {
                onChange({
                    target: {
                        name: 'values',
                        value: values.map((el) => el.id),
                    },
                } as any)
            }

            return
        } else {
            if (end === DropId.selected && selected.length >= maxChoices) {
                return
            }

            const option = options[start][source.index]
            const newStart = options[start].filter(
                (el, i) => i !== source.index
            )
            const newEnd = [...options[end]]
            newEnd.splice(destination.index, 0, option)

            setOptions({ [start]: newStart, [end]: newEnd } as any)

            onChange({
                target: {
                    name: 'values',
                    value: newEnd.map((el) => el.id),
                },
            } as any)
        }
    }

    React.useEffect(() => {
        if (
            choices.length !== 0 &&
            selected.length === 0 &&
            unselected.length === 0
        ) {
            setOptions({ selected: [], unselected: choices })
        }
    }, [choices, selected, unselected])

    const renderChoice = (
        choice: ChoiceType,
        index: number,
        isSelected: boolean
    ) => (
        <Badge
            key={choice.id}
            badgeContent={index + 1}
            invisible={!isSelected}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            sx={(theme) => ({
                '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.grey[900],
                    color: theme.palette.common.white,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    fontSize: 16,
                },
            })}
        >
            <ChoiceView
                choice={choice}
                showImage={showImage}
                onClick={(event) => {
                    toggleSelected(choice.id, isSelected)
                }}
                variant={isSelected ? 'contained' : 'outlined'}
            />
        </Badge>
    )

    const renderMobile = () => (
        <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
            >
                {selected.map((el, index) => renderChoice(el, index, true))}
                {unselected.map((el, index) => renderChoice(el, index, false))}
            </Stack>
        </Box>
    )

    const renderDnD = (droppableId: string, isSelected: boolean) => (
        <Droppable droppableId={droppableId}>
            {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                    <Typography variant="subtitle1">
                        {isSelected ? '已選取' : '未選取'}
                    </Typography>
                    <Box
                        sx={{
                            p: 3,
                            minHeight: '50vh',
                            minWidth: '25vw',
                            borderRadius: 1,
                            border: (theme) =>
                                `1px solid ${theme.palette.grey[800]}`,
                        }}
                    >
                        {(isSelected ? selected : unselected).map(
                            (el, index) => (
                                <Draggable
                                    key={el.id}
                                    draggableId={el.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <Box
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            style={
                                                provided.draggableProps.style
                                            }
                                            sx={{
                                                py: 1,
                                                opacity: snapshot.isDragging
                                                    ? 0.8
                                                    : 1,
                                            }}
                                        >
                                            {renderChoice(
                                                el,
                                                index,
                                                isSelected
                                            )}
                                        </Box>
                                    )}
                                </Draggable>
                            )
                        )}
                        {provided.placeholder}
                    </Box>
                </Box>
            )}
        </Droppable>
    )

    const renderDesktop = () => (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    {renderDnD(DropId.unselected, false)}
                    <Box sx={{ width: 48 }} />
                    {renderDnD(DropId.selected, true)}
                </Stack>
            </Box>
        </DragDropContext>
    )

    return (
        <>
            <Typography variant="h6"> {title} </Typography>
            <Typography variant="caption" color="GrayText">
                最多可排序{maxChoices}項
            </Typography>

            <Box sx={{ height: 16 }} />

            {matches ? renderDesktop() : renderMobile()}

            <Box sx={{ height: 16 }} />

            <QuizButton {...quizButtonProps} />
        </>
    )
}
