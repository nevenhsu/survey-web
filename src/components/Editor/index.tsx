import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'
import PickForm from 'components/PickForm'
import { setClasses } from 'utils/helper'

type StepsType = {
    [key: string]: {
        value: string
        label: string
        num: string
        info: string
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
        pick: {
            value: 'pick',
            label: '選擇測驗類型',
            num: '01',
            info: '請選擇您的測驗需求，讓我們為您推薦測驗範本',
        },
        quiz: {
            value: 'quiz',
            label: '編輯測驗內容',
            num: '02',
            info: '請選擇您的測驗需求，讓我們為您推薦測驗範本',
        },
        result: {
            value: 'result',
            label: '編輯個人化測驗結果',
            num: '03',
            info: '請選擇您的測驗需求，讓我們為您推薦測驗範本',
        },
        final: {
            value: 'final',
            label: '編輯測驗結果',
            num: '04',
            info: '請選擇您的測驗需求，讓我們為您推薦測驗範本',
        },
        launch: {
            value: 'launch',
            label: '發布',
            num: '05',
            info: '請選擇您的測驗需求，讓我們為您推薦測驗範本',
        },
    }

    const [currentStep, setCurrentStep] = React.useState(steps.pick.value)

    const handleChangeStep = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setCurrentStep(newValue)
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

            <PickForm />
        </Root>
    )
}
