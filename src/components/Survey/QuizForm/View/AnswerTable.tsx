import * as React from 'react'
import _ from 'lodash'
import { styled, useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AddIcon from 'mdi-react/AddIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setClasses, getDefaultDraggerChoice } from 'utils/helper'
import { selectCurrentSurvey, updateQuiz } from 'store/slices/survey'
import type { DraggerQuiz, OnChangeInput } from 'common/types'

type AnswerTableProps = {
    quiz?: DraggerQuiz
}

const classes = setClasses('AnswerTable', ['root'])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: '100%',
    },
}))

export default function AnswerTable(props: AnswerTableProps) {
    const dispatch = useAppDispatch()
    const theme = useTheme()

    const { quiz } = props
    const { id: quizId, choices = [], left, right } = quiz ?? {}

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const { id: surveyId } = useAppSelector(selectCurrentSurvey)

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - choices.length) : 0

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        choiceId: string
    ) => {
        if (quizId) {
            const { name, value } = event.target

            const newChoices = _.map(choices, (el) =>
                el.id === choiceId
                    ? {
                          ...el,
                          [name]: value,
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

    const handleAddChoice = () => {
        if (quizId && left) {
            const newChoice = getDefaultDraggerChoice(left.id)
            const newValue = { choices: choices.concat(newChoice) }
            dispatch(
                updateQuiz({
                    surveyId,
                    quizId,
                    newValue,
                })
            )
        }
    }

    return (
        <Root className={classes.root} elevation={6} square>
            <TableContainer
                sx={{
                    bgcolor: (theme) => theme.palette.grey[700],
                }}
            >
                <Table
                    size="small"
                    sx={{
                        bgcolor: (theme) => theme.palette.grey[700],
                        '& .MuiTableCell-root': {
                            height: 64,
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">名稱</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">
                                    正確答案
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Toolbar variant="dense">
                                    <div style={{ flex: 1 }} />
                                    <Tooltip title="增加答項">
                                        <IconButton onClick={handleAddChoice}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Toolbar>
                            </TableCell>
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
                                            variant="standard"
                                            value={el.label}
                                            name="label"
                                            placeholder="請命名答項"
                                            fullWidth
                                            onChange={(event) =>
                                                handleChange(event, el.id)
                                            }
                                        />
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        <TextField
                                            value={el.answer}
                                            size="small"
                                            name="answer"
                                            placeholder="請選擇答案"
                                            fullWidth
                                            onChange={(event) =>
                                                handleChange(event, el.id)
                                            }
                                            select
                                        >
                                            {_.compact([left, right]).map(
                                                (o) => (
                                                    <MenuItem
                                                        key={o.id}
                                                        value={o.id}
                                                    >
                                                        {o.text ?? ''}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: 72 * emptyRows }}>
                                <TableCell colSpan={2} />
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
                sx={{
                    bgcolor: (theme) => theme.palette.grey[700],
                }}
            />
        </Root>
    )
}
