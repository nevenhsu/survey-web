import * as React from 'react'
import _ from 'lodash'
import qs from 'query-string'
import { VariantType, useSnackbar } from 'notistack'
import { styled, useTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import { classes as QuizClasses } from 'components/Survey/QuizForm'
import ArrowUpCircleIcon from 'mdi-react/ArrowUpCircleIcon'
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setClasses } from 'utils/helper'
import {
    setStep,
    reloadFromLocal,
    reloadFromCloud,
    selectCurrentSurvey,
    selectLastEditingAt,
    saveSurvey,
} from 'store/slices/survey'
import { SurveyStep, Mode } from 'common/types'
import type { Survey } from 'common/types'

const CreateForm = React.lazy(() => import('components/Survey/CreateForm'))
const QuizForm = React.lazy(() => import('components/Survey/QuizForm'))
const ResultForm = React.lazy(() => import('components/Survey/ResultForm'))
const FinalForm = React.lazy(() => import('components/Survey/FinalForm'))
const LaunchForm = React.lazy(() => import('components/Survey/LaunchForm'))

const steps = {
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
        label: '編輯測驗結尾',
    },
    [SurveyStep.launch]: {
        value: SurveyStep.launch,
        label: '發布',
    },
} as const

const getModeSteps = (survey?: Survey, mode?: Mode) => {
    if (!survey || survey.mode !== mode) {
        return {}
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
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [uploading, setUploading] = React.useState(false)

    const location = useAppSelector((state) => state.router.location)
    const survey = useAppSelector(selectCurrentSurvey)
    const lastEditingAt = useAppSelector(selectLastEditingAt)

    const { id: surveyId } = survey ?? {}
    const noSurvey = !survey || !surveyId
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
        if (surveyId) {
            return
        }
        const { id } = qs.parse(location.search) as { id?: string }

        dispatch(reloadFromLocal(id))

        setTimeout(() => {
            dispatch(reloadFromCloud(id))
        }, 0)
    }, [surveyId])

    const renderForm = (step?: SurveyStep) => {
        switch (step) {
            case SurveyStep.create:
                return <CreateForm />
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
            {!noSurvey && survey.mode === mode && (
                <>
                    <Tabs
                        className={QuizClasses[1]}
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
                </>
            )}

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 24,
                    width: 120,
                    height: 40,
                    zIndex: 1,
                }}
            >
                <LoadingButton
                    variant="contained"
                    loadingPosition="end"
                    endIcon={
                        updated ? (
                            <CheckboxMarkedCircleIcon
                                color={theme.palette.success.light}
                            />
                        ) : (
                            <ArrowUpCircleIcon />
                        )
                    }
                    loading={uploading}
                    disabled={uploading}
                    onClick={() => handleSave()}
                >
                    儲存
                </LoadingButton>
            </Box>

            <React.Suspense fallback={<div />}>
                {renderForm(step)}
            </React.Suspense>
        </Root>
    )
}
