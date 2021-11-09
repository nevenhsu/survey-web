import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import ArrowUpCircleIcon from 'mdi-react/ArrowUpCircleIcon'
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import User from 'utils/user'
import { setClasses } from 'utils/helper'
import {
    setStep,
    setMode,
    reloadFromLocal,
    reloadFromCloud,
    selectCurrentSurvey,
    selectLastEditingAt,
    saveSurvey,
} from 'store/slices/survey'
import { SurveyStep, Mode } from 'common/types'
import type { Survey } from 'common/types'

const PickForm = React.lazy(() => import('components/Survey/PickForm'))
const QuizForm = React.lazy(() => import('components/Survey/QuizForm'))
const ResultForm = React.lazy(() => import('components/Survey/ResultForm'))
const FinalForm = React.lazy(() => import('components/Survey/FinalForm'))
const LaunchForm = React.lazy(() => import('components/Survey/LaunchForm'))

type StepsType = {
    [key in keyof typeof SurveyStep]: {
        value: key
        label: string
    }
}

const steps: StepsType = {
    [SurveyStep.pick]: {
        value: SurveyStep.pick,
        label: '選擇測驗類型',
    },
    [SurveyStep.quiz]: {
        value: SurveyStep.quiz,
        label: '編輯測驗內容',
    },
    [SurveyStep.result]: {
        value: SurveyStep.result,
        label: '編輯個人化測驗結果',
    },
    [SurveyStep.final]: {
        value: SurveyStep.final,
        label: '編輯測驗結果',
    },
    [SurveyStep.launch]: {
        value: SurveyStep.launch,
        label: '發布',
    },
}

const getModeSteps = (survey?: Survey, mode?: Mode): Partial<StepsType> => {
    const { pick } = steps
    const m = survey?.mode || mode

    if (!survey || survey.mode !== mode) {
        return { pick }
    }

    return steps
}

const classes = setClasses('Editor', ['root'])

const Root = styled(Box)(({ theme }) => ({
    [`&.${classes.root}`]: {
        position: 'relative',
        width: '100%',
    },
}))

export default function Editor() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [uploading, setUploading] = React.useState(false)

    const survey = useAppSelector(selectCurrentSurvey)
    const lastEditingAt = useAppSelector(selectLastEditingAt)

    const { id: surveyId } = survey ?? {}

    const updated = lastEditingAt === survey.updatedAt

    const { mode, step } = useAppSelector((state) => {
        const { mode, step } = state.survey
        return { mode, step }
    })

    const modeSteps = React.useMemo(
        () => getModeSteps(survey, mode),
        [survey, mode]
    )

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    const handleChangeStep = (
        event: React.SyntheticEvent,
        newValue: SurveyStep
    ) => {
        dispatch(setStep(newValue))
    }

    const handleSave = () => {
        const { id } = survey
        if (id && !uploading && !updated) {
            setUploading(true)
            save()
        }
    }

    const save = async () => {
        dispatch(saveSurvey(survey))
            .unwrap()
            .then((result) => {
                notify('儲存成功!', 'success')
                setUploading(false)
            })
            .catch((err) => {
                console.error(err)
                notify('Oops! 請檢查網路連線狀態', 'error')
                setUploading(false)
            })
    }

    React.useEffect(() => {
        const user = User.getInstance()
        const { step, mode } = user.getValue()

        if (!_.isNil(step)) {
            dispatch(setStep(step))
        }
        if (!_.isNil(mode)) {
            dispatch(setMode(mode))
        }

        dispatch(reloadFromLocal())

        setTimeout(() => {
            dispatch(reloadFromCloud())
        }, 0)
    }, [])

    const renderForm = (step: SurveyStep) => {
        switch (step) {
            case SurveyStep.pick:
                return <PickForm />
            case SurveyStep.quiz:
                return <QuizForm />
            case SurveyStep.result:
                return <ResultForm />
            case SurveyStep.final:
                return <FinalForm />
            case SurveyStep.launch:
                return <LaunchForm />
        }
    }

    return (
        <Root className={classes.root}>
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

            {Boolean(surveyId) && step !== SurveyStep.pick && (
                <LoadingButton
                    variant="contained"
                    loadingPosition="end"
                    endIcon={
                        updated ? (
                            <CheckboxMarkedCircleIcon />
                        ) : (
                            <ArrowUpCircleIcon />
                        )
                    }
                    loading={uploading}
                    disabled={uploading}
                    onClick={() => handleSave()}
                    sx={{ position: 'absolute', top: 6, right: 4 }}
                >
                    儲存
                </LoadingButton>
            )}

            <React.Suspense fallback={<div />}>
                {renderForm(step)}
            </React.Suspense>
        </Root>
    )
}
