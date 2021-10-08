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
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setClasses } from 'utils/helper'
import { selectCurrentForm, updateQuiz } from 'store/slices/editor'
import type { SelectionQuiz } from 'common/types'

interface NextQuizProps {
    quiz?: SelectionQuiz
}

const classes = setClasses('NextQuiz', ['root', 'selectContainer'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
}))

export default function NextQuiz(props: NextQuizProps) {
    const dispatch = useAppDispatch()

    const { quiz } = props
    const { id: quizId, choices = [] } = quiz ?? {}

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: formId, quizzes = [] } = useAppSelector(selectCurrentForm)
    const nextQuizIndex = _.findIndex(quizzes, { id: quizId }) + 1

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
                    formId,
                    quizId,
                    newValue: { choices: newChoices },
                })
            )
        }
    }

    return (
        <Root className={classes.root}>
            <Toolbar>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    編輯跳答邏輯
                </Typography>
            </Toolbar>
            <TableContainer>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>答項</TableCell>
                            <TableCell>跳答</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {choices
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((choice) => (
                                <TableRow key={choice.id}>
                                    <TableCell component="th" scope="row">
                                        {choice.label}
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
                                            {quizzes.map((quiz, i) =>
                                                quiz.id !== quizId &&
                                                i !== nextQuizIndex ? (
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
                                                ) : (
                                                    <></>
                                                )
                                            )}
                                        </TextField>
                                    </TableCell>
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
