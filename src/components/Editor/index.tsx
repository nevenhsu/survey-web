import * as React from 'react'
import _ from 'lodash'
import { VariantType, useSnackbar } from 'notistack'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box, { BoxProps } from '@mui/material/Box'
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
    selectCurrentForm,
    selectLastEditingAt,
    saveForm,
} from 'store/slices/editor'
import { EditorStep, Mode } from 'common/types'
import type { Form } from 'common/types'

const PickForm = React.lazy(() => import('components/Editor/PickForm'))
const QuizForm = React.lazy(() => import('components/Editor/QuizForm'))
const ResultForm = React.lazy(() => import('components/Editor/ResultForm'))
const FinalForm = React.lazy(() => import('components/Editor/FinalForm'))
const LaunchForm = React.lazy(() => import('components/Editor/LaunchForm'))
const ProductForm = React.lazy(() => import('components/Editor/ProductForm'))

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
        position: 'relative',
        width: '100%',
    },
}))

export default function Editor() {
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const [uploading, setUploading] = React.useState(false)

    const currentForm = useAppSelector(selectCurrentForm)
    const lastEditingAt = useAppSelector(selectLastEditingAt)

    const updated = lastEditingAt === currentForm.updatedAt

    const { mode, step } = useAppSelector((state) => {
        const { mode, step } = state.editor
        return { mode, step }
    })

    const modeSteps = React.useMemo(
        () => getModeSteps(currentForm, mode),
        [currentForm, mode]
    )

    const notify = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, { variant })
    }

    const handleChangeStep = (
        event: React.SyntheticEvent,
        newValue: EditorStep
    ) => {
        dispatch(setStep(newValue))
    }

    const handleSave = () => {
        const { id } = currentForm
        if (id && !uploading && !updated) {
            setUploading(() => {
                save()
                return true
            })
        }
    }

    const save = async () => {
        dispatch(saveForm(currentForm))
            .unwrap()
            .then((result) => {
                notify('儲存成功!', 'success')
                setUploading(false)
            })
            .catch((err) => {
                console.error(err)
                notify('Oops! 請檢察網路連線狀態', 'error')
                setUploading(false)
            })
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
            case EditorStep.product:
                return <ProductForm />
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

            <React.Suspense fallback={<div />}>
                {renderForm(step)}
            </React.Suspense>
        </Root>
    )
}
