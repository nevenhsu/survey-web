import * as React from 'react'
import _ from 'lodash'
import { EditorStep } from 'types/customTypes'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'
import PickForm from 'components/Editor/PickForm'
import QuizForm from 'components/Editor/QuizForm'
import ResultForm from 'components/Editor/ResultForm'
import FinalForm from 'components/Editor/FinalForm'
import LaunchForm from 'components/Editor/LaunchForm'
import { setClasses } from 'utils/helper'
import User from 'utils/user'

type StepsType = {
    [key in keyof typeof EditorStep]: {
        value: key
        label: string
        num: string
    }
}

const classes = setClasses('Editor', ['root'])

const Root = styled(Box)<BoxProps>(({ theme }) => ({
    [`&.${classes.root}`]: {
        textAlign: 'center',
        backgroundColor: theme.palette.background.default,
    },
}))

export default function Editor() {
    const steps: StepsType = {
        [EditorStep.pick]: {
            value: EditorStep.pick,
            label: '選擇測驗類型',
            num: '01',
        },
        [EditorStep.quiz]: {
            value: EditorStep.quiz,
            label: '編輯測驗內容',
            num: '02',
        },
        [EditorStep.result]: {
            value: EditorStep.result,
            label: '編輯個人化測驗結果',
            num: '03',
        },
        [EditorStep.final]: {
            value: EditorStep.final,
            label: '編輯測驗結果',
            num: '04',
        },
        [EditorStep.launch]: {
            value: EditorStep.launch,
            label: '發布',
            num: '05',
        },
    }

    const [currentStep, setCurrentStep] = React.useState<EditorStep>(
        steps.pick.value as EditorStep
    )

    const handleChangeStep = (
        event: React.SyntheticEvent,
        newValue: EditorStep
    ) => {
        const user = User.getInstance()
        user.setValue({ currentStep: newValue })
        setCurrentStep(newValue)
    }

    React.useEffect(() => {
        const user = User.getInstance()
        const { currentStep } = user.getValue()
        // TODO: check form value first
        if (!_.isNil(currentStep)) {
            setCurrentStep(currentStep)
        }
    }, [])

    const renderForm = (step: EditorStep) => {
        switch (step) {
            case EditorStep.pick:
                return <PickForm />
            case EditorStep.quiz:
                return <QuizForm />
            case EditorStep.result:
                return <ResultForm />
            case EditorStep.final:
                return <FinalForm />
            case EditorStep.launch:
                return <LaunchForm />
        }
    }

    return (
        <Root sx={{ width: '100%' }}>
            <Tabs
                value={currentStep}
                onChange={handleChangeStep}
                sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: 'common.black',
                }}
            >
                {_.map(steps, ({ label, value, num }) => (
                    <Tab key={value} label={`${num} ${label}`} value={value} />
                ))}
            </Tabs>

            {renderForm(currentStep)}
        </Root>
    )
}
