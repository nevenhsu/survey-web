import * as React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import { fromUnixTime, format } from 'date-fns'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Title } from 'components/Analysis/Shares'
import VirtualizedTable, {
    ColumnData,
    RenderCell,
} from 'components/common/VirtualizedTable'
import { toDate } from 'utils/helper'
import { QuizMode, ComponentType } from 'common/types'
import type { SelectionQuiz } from 'common/types'
import { fakeAnswerData, fakeSurveyData } from 'assets/data/answers'

const defaultKeys = {
    id: 'ID',
    name: '姓名',
    gender: '性別',
    birthday: '生日',
    mobile: '手機',
    email: 'Email',
    userId: '會員編號',
    createdAt: '建立時間',
    updatedAt: '完成時間',
    resultId: '結果',
    totalTime: '總填寫秒數',
    averageTime: '平均回答秒數',
    ip: 'IP',
}

const defaultWidth = {
    id: 96,
    name: 120,
    gender: 96,
    birthday: 120,
    mobile: 120,
    email: 160,
    userId: 96,
    createdAt: 160,
    updatedAt: 160,
    resultId: 160,
    totalTime: 120,
    averageTime: 120,
    ip: 160,
}

const numericRows = ['totalTime', 'averageTime']

export default function AnswerView() {
    const answerData = fakeAnswerData
    const surveyData = fakeSurveyData

    const columns: ColumnData[] = React.useMemo(() => {
        const { quizzes = [] } = surveyData ?? {}

        const quizKeys: { [quizId: string]: string } = {}
        const numericQuiz: Array<string> = []

        _.forEach(quizzes, (el) => {
            const { id, title, mode } = el
            if (mode !== QuizMode.page) {
                quizKeys[id] = title.text ?? ''
                if (mode === QuizMode.slider) {
                    numericQuiz.push(id)
                }
            }
        })

        const all = { ...defaultKeys, ...quizKeys }
        const allNumeric = [...numericRows, ...numericQuiz]

        return _.map(all, (label, dataKey) => {
            return {
                dataKey,
                label,
                width: _.get(defaultWidth, dataKey, 160),
                numeric: _.includes(allNumeric, dataKey),
            }
        })
    }, [answerData, surveyData])

    const data = React.useMemo(() => {
        const { results, quizzes = [] } = surveyData ?? {}

        return _.map(answerData, (answer) => {
            const value = { ...answer }

            _.forEach(answer, (cellData, dataKey) => {
                if (dataKey === 'resultId') {
                    const { list } = results ?? {}
                    const result = list[cellData]
                    if (result) {
                        const { title, components } = result
                        const titleComponent = _.find(components, {
                            type: ComponentType.title,
                        })
                        const val = _.get(titleComponent, 'value', title)
                        value[dataKey] = val
                    }
                }

                if (
                    _.isNumber(cellData) &&
                    _.includes(['createdAt', 'updatedAt'], dataKey)
                ) {
                    const time = fromUnixTime(_.round(cellData / 1000))
                    const val = format(time, 'yyyy-MM-dd')
                    value[dataKey] = val
                }

                if (dataKey === 'birthday') {
                    const time = toDate(cellData)
                    if (time) {
                        const val = format(time, 'yyyy-MM-dd')
                        value[dataKey] = val
                    }
                }

                if (
                    _.isNumber(cellData) &&
                    _.includes(['totalTime', 'averageTime'], dataKey)
                ) {
                    const val = _.round(cellData / 1000, 2)
                    value[dataKey] = `${val} 秒`
                }

                const quiz = _.find(quizzes, { id: dataKey })

                if (quiz && _.isArray(cellData)) {
                    const { mode } = quiz
                    switch (mode) {
                        case QuizMode.selection:
                        case QuizMode.sort: {
                            const { choices } = quiz as SelectionQuiz
                            const val = _.map(cellData, (id) => {
                                const choice = _.find(choices, { id })
                                const { label } = choice ?? {}
                                return label ?? ''
                            })
                            value[dataKey] = val
                        }
                    }
                }
            })

            return value
        })
    }, [answerData, surveyData])

    const renderCell: RenderCell = (props) => {
        const { columnData, cellData } = props
        const { quizzes = [] } = surveyData ?? {}

        const { dataKey } = columnData
        const quiz = _.find(quizzes, { id: dataKey })

        if (quiz && _.isArray(cellData)) {
            const { mode } = quiz
            switch (mode) {
                case QuizMode.selection:
                case QuizMode.sort: {
                    return _.map(cellData, (el, index) => (
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                            sx={{ mb: 1 }}
                        >
                            <Typography variant="caption">
                                {index + 1}
                            </Typography>
                            <Typography variant="caption">{el}</Typography>
                        </Stack>
                    ))
                }
            }
        }

        return <Typography variant="caption">{cellData}</Typography>
    }

    return (
        <>
            <Box sx={{ p: 3, borderBottom: '1px solid' }}>
                <Typography variant="h6">回應明細</Typography>
                <Typography variant="body1">
                    查看測驗回應的原始資料，或匯出相關資料以供後續利用
                </Typography>
            </Box>
            <Box sx={{ p: 3, height: 'calc(100vh - 256px)' }}>
                <Title
                    title={`總共 ${numeral(data.length).format('0,0')} 筆資料`}
                />
                <VirtualizedTable
                    rowCount={data.length}
                    columns={columns}
                    rowGetter={({ index }) => {
                        return _.get(data, [index], {})
                    }}
                    paperProps={{
                        elevation: 4,
                    }}
                    renderCell={renderCell}
                />
            </Box>
        </>
    )
}
