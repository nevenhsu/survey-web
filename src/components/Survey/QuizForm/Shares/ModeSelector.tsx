import _ from 'lodash'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { QuizMode, QuizType, Mode } from 'common/types'
import { getDefaultQuiz } from 'utils/helper'
import { useAppDispatch, useAppSelector } from 'hooks'
import { updateQuiz, selectCurrentSurvey } from 'store/slices/survey'

type ModeSelectorProps = {
    surveyId?: string
    quiz?: QuizType
    formControlProps?: FormControlProps
    onChange?: (event: SelectChangeEvent<string>) => void
    showArrow?: boolean
}

const quizModes = {
    [QuizMode.page]: {
        value: QuizMode.page,
        label: '圖文',
    },
    [QuizMode.selection]: {
        value: QuizMode.selection,
        label: '選擇',
    },
    [QuizMode.slider]: {
        value: QuizMode.slider,
        label: '拉桿',
    },
    [QuizMode.fill]: {
        value: QuizMode.fill,
        label: '填空',
    },
    [QuizMode.sort]: {
        value: QuizMode.sort,
        label: '排序',
    },
    [QuizMode.dragger]: {
        value: QuizMode.dragger,
        label: '拖曳',
    },
    [QuizMode.oneInTwo]: {
        value: QuizMode.oneInTwo,
        label: '二選一',
    },
} as const

export default function ModeSelector(props: ModeSelectorProps) {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectCurrentSurvey)
    const { mode: surveyMode } = survey

    const {
        surveyId,
        quiz,
        formControlProps,
        onChange,
        showArrow = true,
    } = props
    const { id: quizId, mode = '' } = quiz ?? {}

    const handleChange = (event: SelectChangeEvent) => {
        if (!surveyId || !quizId) {
            return
        }

        const mode = event.target.value as QuizMode

        dispatch(
            updateQuiz({
                surveyId,
                quizId,
                newValue: getDefaultQuiz(quizId, mode),
            })
        )
    }

    const quizModes = getQuizModes(surveyMode)

    return (
        <FormControl variant="standard" {...formControlProps}>
            <Select
                value={mode}
                onChange={onChange ?? handleChange}
                autoWidth
                sx={{
                    '&.MuiInput-root:before': { opacity: 0 },
                    '&.MuiInput-root:after': { opacity: 0 },
                    color: 'grey.500',
                    borderBottom: '1px solid #92918F',
                    '& .MuiSelect-icon': {
                        display: showArrow ? 'block' : 'none',
                    },
                }}
            >
                {_.map(quizModes, (el) => (
                    <MenuItem key={el.value} value={el.value}>
                        {el.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

function getQuizModes(surveyMode: Mode): {
    [key: string]: {
        value: QuizMode
        label: string
    }
} {
    switch (surveyMode) {
        case Mode.dragger: {
            return {
                [QuizMode.page]: {
                    value: QuizMode.page,
                    label: '圖文',
                },
                [QuizMode.fill]: {
                    value: QuizMode.fill,
                    label: '填空',
                },
                [QuizMode.dragger]: {
                    value: QuizMode.dragger,
                    label: '拖曳',
                },
            }
        }
        case Mode.oneInTwo: {
            return {
                [QuizMode.page]: {
                    value: QuizMode.page,
                    label: '圖文',
                },
                [QuizMode.fill]: {
                    value: QuizMode.fill,
                    label: '填空',
                },
                [QuizMode.selection]: {
                    value: QuizMode.selection,
                    label: '選擇',
                },
                [QuizMode.oneInTwo]: {
                    value: QuizMode.oneInTwo,
                    label: '二選一',
                },
            }
        }
    }
}
