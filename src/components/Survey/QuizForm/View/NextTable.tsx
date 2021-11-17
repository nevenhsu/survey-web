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
import { selectCurrentSurvey, updateQuiz } from 'store/slices/survey'
import type { SelectionQuiz } from 'common/types'

type NextTableProps = {
    quiz?: SelectionQuiz
}

const classes = setClasses('NextTable', ['root', 'selectContainer'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
}))

export default function NextTable(props: NextTableProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, choices = [] } = quiz ?? {}

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: surveyId, quizzes = [] } = useAppSelector(selectCurrentSurvey)
    const nextQuizIndex = _.findIndex(quizzes, { id: quizId }) + 1

    const currentChoices = React.useMemo(
        () =>
            choices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage]
    )

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choices.length) : 0

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (quizId) {
            const { name, value } = event.target
            const newChoices = choices.map((el) =>
                el.id !== name ? el : { ...el, next: _.trim(value) }
            )
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
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>答項</TableCell>
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
                                                ? 'common.white'
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
                                            .filter(
                                                (quiz, i) =>
                                                    quiz.id !== quizId &&
                                                    i !== nextQuizIndex
                                            )
                                            .map((quiz, i) => (
                                                <MenuItem
                                                    key={quiz.id}
                                                    value={quiz.id}
                                                >
                                                    跳到第{i + 1}題:{' '}
                                                    {quiz.title.substring(
                                                        0,
                                                        18
                                                    )}
                                                    {quiz.title.length > 18
                                                        ? '...'
                                                        : ''}
                                                </MenuItem>
                                            ))}
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
            />
        </Root>
    )
}
