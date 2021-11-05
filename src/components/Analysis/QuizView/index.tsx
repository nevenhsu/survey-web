import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack, { StackProps } from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import { QuizMode } from 'common/types'
import { quizzesData } from 'assets/data/analysis'

type QuizProps = StackProps & {
    selected: boolean
}

const QuizItem = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<QuizProps>(({ selected, theme }) => ({
    userSelect: 'none',
    padding: 8,
    marginBottom: 8,
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    backgroundColor: selected
        ? theme.palette.grey[100]
        : theme.palette.common.white,
}))

export default function QuizView() {
    const [selectedId, setSelectedId] = React.useState('')

    const quizzes = quizzesData

    const selectedQuiz = React.useMemo(() => {
        return _.find(quizzes, { id: selectedId })
    }, [quizzes, selectedId])

    React.useEffect(() => {
        if (quizzes && quizzes.length) {
            setSelectedId(quizzes[0].id)
        }
    }, [quizzes])

    return (
        <>
            <Box sx={{ p: 3, borderBottom: '1px solid' }}>
                <Typography variant="h6">單題結果</Typography>
                <Typography variant="body1">
                    說明文字說明文字說明文字說明文字
                </Typography>
            </Box>
            <Grid container sx={{ minHeight: 'calc(100vh - 218px)' }}>
                <Grid
                    item
                    sx={{
                        width: 288,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'common.white',
                            p: 2,
                        }}
                    >
                        {quizzes.map((el, index) => (
                            <QuizItem
                                className="c-pointer"
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                selected={selectedId === el.id}
                                key={el.id}
                                onClick={() => setSelectedId(el.id)}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: `calc(100% - 40px)`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                        }}
                                    >
                                        <Typography
                                            color="inherit"
                                            sx={{
                                                display: 'inline',
                                            }}
                                            noWrap
                                        >
                                            {el.title}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        textAlign: 'right',
                                    }}
                                >
                                    {getModeLabel(el.mode)}
                                </Typography>
                            </QuizItem>
                        ))}
                    </Box>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid item xs>
                    <Box sx={{ height: 'calc(100vh - 218px)', p: 3 }}></Box>
                </Grid>
            </Grid>
        </>
    )
}

function getModeLabel(mode: QuizMode) {
    switch (mode) {
        case QuizMode.selection:
            return '選擇'
        case QuizMode.sort:
            return '排序'
        case QuizMode.slider:
            return '拉桿'
        case QuizMode.fill:
            return '填空'
        case QuizMode.page:
            return '圖文'
    }
}
