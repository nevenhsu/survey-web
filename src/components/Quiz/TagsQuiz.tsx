import * as React from 'react'
import _ from 'lodash'
import CreatableSelect from 'react-select/creatable'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from 'mdi-react/AddIcon'
import PencilIcon from 'mdi-react/PencilIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setClasses, setId } from 'utils/helper'
import { selectCurrentForm, updateQuiz, updateForm } from 'store/slices/editor'
import type { SelectionQuiz, Tags, ChoiceType } from 'common/types'
import type { ActionMeta, OnChangeValue, MultiValue } from 'react-select'

interface TagsQuizProps {
    quiz?: SelectionQuiz
}

type TagsOption = Tags & {
    value: string
    isDisabled: boolean
}

type TagOption = {
    value: string
    label: string
}

const classes = setClasses('TagsQuiz', ['root', 'selectContainer'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
    [`& .${classes.selectContainer} > div`]: {
        backgroundColor: 'transparent',
    },
}))

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
) {
    return { name, calories, fat, carbs, protein }
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
]

export default function TagsQuiz(props: TagsQuizProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, choices = [], tagsId: ids = [] } = quiz ?? {}

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: formId, tags } = useAppSelector(selectCurrentForm)
    const tagsOptions = getTagsOptions(_.values(tags), ids)

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choices.length) : 0

    const tagsId: string[] = Array.from(ids)
    _.merge(tagsId, new Array(3))

    const handleTagsIdChange = (
        newValue: OnChangeValue<TagsOption, false>,
        index: number
    ) => {
        if (quizId) {
            const { id = '' } = newValue || {}
            const newTagsId = Array.from(tagsId)
            newTagsId[index] = id

            dispatch(
                updateQuiz({
                    formId,
                    quizId,
                    newValue: { tagsId: newTagsId },
                })
            )
        }
    }

    const handleCreateTags = (values: { value: string; index: number }) => {
        const { value, index } = values
        const id = setId()
        const newTags: Tags = {
            id,
            label: value,
            values: [],
        }

        dispatch(
            updateForm({
                id: formId,
                newValue: {
                    tags: {
                        ...tags,
                        [id]: newTags,
                    },
                },
            })
        )

        if (quizId) {
            const newTagsId = Array.from(tagsId)
            newTagsId[index] = id

            dispatch(
                updateQuiz({
                    formId,
                    quizId,
                    newValue: { tagsId: newTagsId },
                })
            )
        }
    }

    const handleTagsChange = (
        choice: ChoiceType,
        tagId: string,
        values: MultiValue<TagOption>,
        actionMeta: ActionMeta<TagOption>
    ) => {
        if (quizId) {
            const { id: choiceId } = choice
            const newValues = values.map((el) => el.value)

            const newChoices = choices.map((el) =>
                el.id === choiceId
                    ? {
                          ...el,
                          tags: {
                              ...el.tags,
                              [tagId]: newValues,
                          },
                      }
                    : el
            )

            if (actionMeta.action === 'create-option') {
                const tagGroup = tags[tagId]
                if (tagGroup) {
                    const newValue = {
                        tags: {
                            ...tags,
                            [tagId]: {
                                ...tagGroup,
                                values: _.uniq(
                                    _.concat(tagGroup.values, newValues)
                                ),
                            },
                        },
                    }

                    dispatch(
                        updateForm({
                            id: formId,
                            newValue,
                        })
                    )
                }
            }

            dispatch(
                updateQuiz({
                    formId,
                    quizId,
                    newValue: { choices: newChoices },
                })
            )
        }
    }

    return (
        <Root>
            <Toolbar>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    編輯標籤組
                </Typography>

                <Tooltip title="編輯標籤組">
                    <IconButton>
                        <PencilIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <TableContainer>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>選項名稱</TableCell>
                            {tagsId.map((id, index) => (
                                <TableCell key={id || `${index}`}>
                                    <CreatableSelect<TagsOption>
                                        menuPosition="fixed"
                                        className={classes.selectContainer}
                                        value={_.find(tagsOptions, { id })}
                                        onChange={(value) =>
                                            handleTagsIdChange(value, index)
                                        }
                                        options={tagsOptions}
                                        onCreateOption={(value) =>
                                            handleCreateTags({
                                                value,
                                                index,
                                            })
                                        }
                                        isClearable
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {choices
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((el) => (
                                <TableRow key={el.id}>
                                    <TableCell component="th" scope="row">
                                        {el.label}
                                    </TableCell>
                                    {tagsId.map((id, i) => (
                                        <TableCell key={id || `${i}`}>
                                            {id ? (
                                                <CreatableSelect<
                                                    TagOption,
                                                    true
                                                >
                                                    menuPosition="fixed"
                                                    className={
                                                        classes.selectContainer
                                                    }
                                                    value={getTagValues(
                                                        el.tags[id]
                                                    )}
                                                    onChange={(
                                                        values,
                                                        actionMeta
                                                    ) =>
                                                        handleTagsChange(
                                                            el,
                                                            id,
                                                            values,
                                                            actionMeta
                                                        )
                                                    }
                                                    options={getTagOptions(
                                                        tags[id]
                                                    )}
                                                    isMulti
                                                    isClearable
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: 71 * emptyRows }}>
                                <TableCell colSpan={4} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={choices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event: unknown, newPage: number) => {
                    setPage(newPage)
                }}
                onRowsPerPageChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                ) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                }}
            />
        </Root>
    )
}

function getTagsOptions(tags: Tags[], tagsIds: string[]): TagsOption[] {
    return _.map(tags, (el) => {
        const { id } = el
        const value = id
        const isDisabled = tagsIds.includes(value)
        return { ...el, value, isDisabled }
    })
}

function getTagOptions(tags: Tags): TagOption[] {
    const { values = [] } = tags ?? {}
    return values.map((value) => ({ value, label: value }))
}

function getTagValues(tags: string[]) {
    return _.map(tags, (value) => ({ value, label: value }))
}
