import * as React from 'react'
import _ from 'lodash'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'
import PickForm from 'components/Editor/PickForm'
import QuizForm from 'components/Editor/QuizForm'
import ResultForm from 'components/Editor/ResultForm'
import FinalForm from 'components/Editor/FinalForm'
import LaunchForm from 'components/Editor/LaunchForm'
import { useAppSelector, useAppDispatch } from 'hooks'
import User from 'utils/user'
import { setClasses } from 'utils/helper'
import {
    setStep,
    setMode,
    reloadFromLocal,
    selectCurrentForm,
} from 'store/slices/editor'
import { EditorStep, Mode } from 'common/types'
import type { Form } from 'common/types'

type StepsType = {
    [key in keyof typeof EditorStep]: {
        value: key
        label: string
    }
}

const steps: StepsType = {
    [EditorStep.pick]: {
        value: EditorStep.pick,
        label: '選擇測驗類型',
    },
    [EditorStep.product]: {
        value: EditorStep.product,
        label: '編輯推薦商品',
    },
    [EditorStep.quiz]: {
        value: EditorStep.quiz,
        label: '編輯測驗內容',
    },
    [EditorStep.result]: {
        value: EditorStep.result,
        label: '編輯個人化測驗結果',
    },
    [EditorStep.final]: {
        value: EditorStep.final,
        label: '編輯測驗結果',
    },
    [EditorStep.launch]: {
        value: EditorStep.launch,
        label: '發布',
    },
}

const getModeSteps = (form?: Form, mode?: Mode): Partial<StepsType> => {
    const { pick } = steps
    const m = form?.mode || mode

    if (!form || form.mode !== mode) {
        return { pick }
    }

    switch (m) {
        case Mode.product:
            return steps

        case Mode.persona: {
            const { pick, quiz, result, final, launch } = steps
            return { pick, quiz, result, final, launch }
        }
        default: {
            return { pick }
        }
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
    const dispatch = useAppDispatch()

    const currentForm = useAppSelector(selectCurrentForm)

    const { mode, step } = useAppSelector((state) => {
        const { mode, step } = state.editor
        return { mode, step }
    })

    const modeSteps = getModeSteps(currentForm, mode)

    const handleChangeStep = (
        event: React.SyntheticEvent,
        newValue: EditorStep
    ) => {
        dispatch(setStep(newValue))
    }

    React.useEffect(() => {
        const user = User.getInstance()
        const { step, mode } = user.getValue()
        // TODO: check form value first
        if (!_.isNil(step)) {
            dispatch(setStep(step))
        }
        if (!_.isNil(mode)) {
            dispatch(setMode(mode))
        }
        dispatch(reloadFromLocal())
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
                value={step}
                onChange={handleChangeStep}
                sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: 'common.black',
                }}
            >
                {_.map(modeSteps, (el) => el).map((el, index) => {
                    const { value, label } = el as any
                    return (
                        <Tab
                            key={value}
                            label={`${index + 1} ${label}`}
                            value={value}
                        />
                    )
                })}
            </Tabs>

            {renderForm(step)}
        </Root>
    )
}
