import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setClasses } from 'utils/helper'
import { selectCurrentSurvey, updateChoice } from 'store/slices/survey'
import type { SelectionQuiz } from 'common/types'

type NextTableProps = {
    quiz?: SelectionQuiz
}

const classes = setClasses('NextTable', ['root', 'selectContainer'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
    '& .MuiTableCell-root': {
        padding: '4px 16px',
    },
    '& .MuiTableHead-root': {
        height: 64,
    },
    '& .MuiTableCell-head': {
        padding: '0 16px',
    },
}))

export default function NextTable(props: NextTableProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, title, choices = [] } = quiz ?? {}
    const { text = '' } = title ?? {}

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: surveyId, quizzes = [] } = useAppSelector(selectCurrentSurvey)
    const nextQuizIndex = _.findIndex(quizzes, { id: quizId }) + 1

    const currentChoices = React.useMemo(
        () =>
            choices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, choices]
    )

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choices.length) : 0

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (quizId) {
            const { name: choiceId, value } = event.target
            const choice = _.find(choices, { id: choiceId })

            if (choice) {
                const newValue = {
                    ...choice,
                    next: _.trim(value),
                }

                dispatch(
                    updateChoice({
                        surveyId,
                        quizId,
                        newValue,
                    })
                )
            }
        }
    }

    return (
        <Root className={classes.root} elevation={0} square>
            <TableContainer
                sx={{
                    bgcolor: 'grey.200',
                }}
            >
                <Table
                    size="small"
                    sx={{
                        '& .MuiTableCell-root': {
                            height: 32,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">答項</Typography>
                            </TableCell>
                            <TableCell>跳答</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentChoices.map((choice) => (
                            <TableRow key={choice.id}>
                                <TableCell component="th" scope="row">
                                    <Typography
                                        sx={{
                                            color: Boolean(choice.label)
                                                ? 'grey.800'
                                                : 'grey.500',
                                        }}
                                    >
                                        {choice.label || '未命名答項'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name={choice.id}
                                        value={choice.next || ' '}
                                        onChange={handleChange}
                                        select
                                    >
                                        <MenuItem value={' '}>
                                            跳到下一題
                                        </MenuItem>
                                        {quizzes
                                            .map((quiz, i) =>
                                                quiz.id !== quizId &&
                                                i !== nextQuizIndex
                                                    ? quiz
                                                    : undefined
                                            )
                                            .map((quiz, i) =>
                                                quiz ? (
                                                    <MenuItem
                                                        key={quiz.id}
                                                        value={quiz.id}
                                                    >
                                                        跳到第{i + 1}題:{' '}
                                                        {quiz.title.text?.substring(
                                                            0,
                                                            18
                                                        )}
                                                    </MenuItem>
                                                ) : (
                                                    <></>
                                                )
                                            )}
                                    </TextField>
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: 72 * emptyRows }}>
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
                sx={{ bgcolor: 'grey.200' }}
            />
        </Root>
    )
}
