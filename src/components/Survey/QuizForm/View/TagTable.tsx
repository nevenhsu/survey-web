import * as React from 'react'
import _ from 'lodash'
import CreatableSelect from 'react-select/creatable'
import { styled, useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import components, { setStyles } from 'components/common/MuiSelectComponents'
import { useAppSelector, useAppDispatch } from 'hooks'
import { getMuiColor, getContrastText } from 'theme/palette'
import { setClasses, getDefaultTags } from 'utils/helper'
import {
    selectCurrentSurvey,
    updateQuiz,
    updateSurvey,
} from 'store/slices/survey'
import AddIcon from 'mdi-react/AddIcon'
import type {
    SelectionQuiz,
    Tags,
    ChoiceType,
    OnChangeInput,
} from 'common/types'
import type { ActionMeta, OnChangeValue, MultiValue } from 'react-select'

type TagTableProps = {
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

const classes = setClasses('TagTable', ['root', 'selectContainer'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
    [`& .${classes.selectContainer} > div`]: {
        backgroundColor: 'transparent',
    },
}))

export default function TagTable(props: TagTableProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, choices = [], tagsId: ids = [] } = quiz ?? {}

    const tagsId = _.isEmpty(ids) ? [''] : Array.from(ids)
    const disabledAdd = tagsId.length >= 3

    const theme = useTheme()
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: surveyId, tags } = useAppSelector(selectCurrentSurvey)
    const tagsOptions = getTagsOptions(_.values(tags), ids)

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choices.length) : 0

    const handleAddTag = () => {
        if (quizId && tagsId.length < 3) {
            const newTagsId = [...tagsId, '']
            const newValue = { tagsId: newTagsId }

            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue,
                })
            )
        }
    }

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
                    surveyId,
                    quizId,
                    newValue: { tagsId: newTagsId },
                })
            )
        }
    }

    const handleChangeLabel: OnChangeInput = (event) => {
        if (quizId) {
            const { name: choiceId, value: label } = event.target

            const newChoices = _.map(choices, (el) =>
                el.id === choiceId
                    ? {
                          ...el,
                          label,
                      }
                    : el
            )

            const newValue = {
                choices: newChoices,
            }

            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue,
                })
            )
        }
    }

    const handleCreateTags = (values: { value: string; index: number }) => {
        const { value: rawValue, index } = values
        const value = _.trim(rawValue)

        if (value) {
            const newTags = getDefaultTags(value)

            dispatch(
                updateSurvey({
                    id: surveyId,
                    newValue: {
                        tags: {
                            ...tags,
                            [newTags.id]: newTags,
                        },
                    },
                })
            )

            if (quizId) {
                const newTagsId = Array.from(tagsId)
                newTagsId[index] = newTags.id

                dispatch(
                    updateQuiz({
                        surveyId,
                        quizId,
                        newValue: { tagsId: newTagsId },
                    })
                )
            }
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
            const newValues = values
                .map((el) => _.trim(el.value))
                .filter((el) => !_.isEmpty(el))

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
                        updateSurvey({
                            id: surveyId,
                            newValue,
                        })
                    )
                }
            }

            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue: { choices: newChoices },
                })
            )
        }
    }

    return (
        <Root className={classes.root} elevation={6} square>
            <Toolbar sx={{ minHeight: '48px !important' }}>
                <div style={{ flex: 1 }} />
                <Tooltip title={disabledAdd ? '類別已達上限' : '增加類別'}>
                    <span>
                        <IconButton
                            onClick={handleAddTag}
                            disabled={disabledAdd}
                        >
                            <AddIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Toolbar>
            <TableContainer>
                <Table
                    sx={{
                        '& .MuiTableCell-root': {
                            height: 72,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>名稱</TableCell>
                            {tagsId.map((id, index) => (
                                <TableCell key={id || `${index}`}>
                                    <CreatableSelect<TagsOption>
                                        components={components}
                                        styles={setStyles(theme) as any}
                                        menuPosition="fixed"
                                        placeholder="標籤類別"
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
                                        <TextField
                                            name={el.id}
                                            value={el.label}
                                            placeholder="請命名答項"
                                            onChange={handleChangeLabel}
                                        />
                                    </TableCell>

                                    {tagsId.map((id, i) => {
                                        const backgroundColor = getMuiColor(
                                            tags[id]?.color
                                        ).color[500]

                                        const { textColor } = getContrastText(
                                            theme,
                                            backgroundColor,
                                            '#333'
                                        )
                                        return (
                                            <TableCell key={id || `${i}`}>
                                                {id ? (
                                                    <CreatableSelect<
                                                        TagOption,
                                                        true
                                                    >
                                                        components={components}
                                                        styles={{
                                                            ...(setStyles(
                                                                theme
                                                            ) as any),
                                                            multiValue: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                borderRadius: 99,
                                                                color: textColor,
                                                                backgroundColor,
                                                            }),
                                                            multiValueRemove: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                borderRadius: 99,
                                                                opacity: 0.6,
                                                                color: textColor,
                                                                ':hover': {
                                                                    opacity: 1,
                                                                    backgroundColor:
                                                                        'unset',
                                                                },
                                                            }),
                                                        }}
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
                                        )
                                    })}
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: 71 * emptyRows }}>
                                <TableCell colSpan={1 + tagsId.length} />
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