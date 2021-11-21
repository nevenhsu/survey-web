import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { setClasses } from 'utils/helper'
import { AnalysisStep } from 'common/types'

const BehaviorView = React.lazy(
    () => import('components/Analysis/BehaviorView')
)
const ResultView = React.lazy(() => import('components/Analysis/ResultView'))
const QuizView = React.lazy(() => import('components/Analysis/QuizView'))
const AnswerView = React.lazy(() => import('components/Analysis/AnswerView'))

const steps = [
    {
        value: AnalysisStep.behavior,
        label: '測驗行為',
    },
    {
        value: AnalysisStep.quiz,
        label: '單題結果',
    },
    {
        value: AnalysisStep.answer,
        label: '回應明細',
    },
]

const classes = setClasses('Analysis', ['root'])

const Root = styled(Box)(({ theme }) => ({
    [`&.${classes.root}`]: {
        position: 'relative',
        width: '100%',
    },
}))

export default function Analysis() {
    const [step, setStep] = React.useState(AnalysisStep.behavior)

    const renderView = (step: AnalysisStep) => {
        switch (step) {
            case AnalysisStep.behavior:
                return <BehaviorView />
            case AnalysisStep.result:
                return <ResultView />
            case AnalysisStep.quiz:
                return <QuizView />
            case AnalysisStep.answer:
                return <AnswerView />
        }
    }

    return (
        <Root className={classes.root}>
            <Tabs
                value={step}
                onChange={(e, v) => setStep(v)}
                sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: 'common.black',
                }}
            >
                {steps.map((el, index) => {
                    const { value, label } = el
                    return (
                        <Tab
                            key={value}
                            label={`${index + 1} ${label}`}
                            value={value}
                        />
                    )
                })}
            </Tabs>
            <React.Suspense fallback={<div />}>
                {renderView(step)}
            </React.Suspense>
        </Root>
    )
}
