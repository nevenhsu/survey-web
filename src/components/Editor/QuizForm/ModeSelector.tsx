import _ from 'lodash'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { QuizMode, QuizType } from 'common/types'
import { getDefaultQuiz } from 'utils/helper'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/editor'

type ModeSelectorProps = {
    formId?: string
    quiz?: QuizType
    formControlProps?: FormControlProps
    onChange?: (event: SelectChangeEvent<string>) => void
}

const quizModes = {
    [QuizMode.page]: {
        value: QuizMode.page,
        label: '圖文',
    },
    [QuizMode.selection]: {
        value: QuizMode.selection,
        label: '複選',
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
} as const

export default function ModeSelector(props: ModeSelectorProps) {
    const dispatch = useAppDispatch()

    const { formId, quiz, formControlProps, onChange } = props
    const { id: quizId, mode = '' } = quiz ?? {}

    const handleChange = (event: SelectChangeEvent) => {
        if (!formId || !quizId) {
            return
        }

        const mode = event.target.value as QuizMode

        dispatch(
            updateQuiz({
                formId,
                quizId,
                newValue: getDefaultQuiz(quizId, mode),
            })
        )
    }

    return (
        <FormControl variant="standard" {...formControlProps}>
            <Select
                value={mode}
                onChange={onChange ?? handleChange}
                autoWidth
                sx={{
                    '&.MuiInput-root:before': { opacity: 0 },
                    '&.MuiInput-root:after': { opacity: 0 },
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
