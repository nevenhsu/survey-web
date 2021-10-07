import _ from 'lodash'
import cryptoRandomString from 'crypto-random-string'
import { QuizMode } from 'common/types'
import type {
    PageQuiz,
    SelectionQuiz,
    FillQuiz,
    SliderQuiz,
    ChoiceType,
} from 'common/types'

export function setId(length = 6) {
    return cryptoRandomString({ length })
}

export function setClasses<T extends string, U = { [K in T]: string }>(
    prefix: string,
    names: T[]
): U {
    const arr = <const>[...names]
    const values = names.map((el) => `${prefix}-${el}`)
    return _.zipObject(arr, values) as unknown as U
}

export function parseJson<T extends object = {}>(
    val: string | T,
    fallback: T
): T {
    try {
        if (!val) {
            return fallback
        }
        if (_.isObject(val)) {
            return val
        }

        return JSON.parse(val)
    } catch {
        return fallback
    }
}

export function reorder<T, U extends Iterable<T>>(
    list: U,
    startIndex: number,
    endIndex: number
) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export function getDefaultQuiz(id: string, mode: QuizMode) {
    switch (mode) {
        case QuizMode.page: {
            const quiz: PageQuiz = {
                id,
                mode,
                title: '未命名題目',
                buttonText: '下一題',
                buttonVariant: 'contained',
            }
            return quiz
        }
        case QuizMode.selection:
        case QuizMode.sort: {
            const quiz: SelectionQuiz = {
                id,
                mode,
                title: '請編輯標題',
                choices: [],
                values: [],
                maxChoices: 4,
                showLabel: true,
                showImage: false,
                direction: 'column',
            }
            return quiz
        }
        case QuizMode.slider: {
            const quiz: SliderQuiz = {
                id,
                mode,
                title: '請編輯標題',
                max: 100,
                min: 0,
                value: 50,
            }
            return quiz
        }
        case QuizMode.fill: {
            const quiz: FillQuiz = {
                id,
                mode,
                title: '請編輯標題',
                value: '',
            }
            return quiz
        }
        default: {
            return {
                id,
                mode,
                title: '請編輯標題',
            }
        }
    }
}

export function getDefaultChoice() {
    const choice: ChoiceType = {
        id: setId(),
        label: '點擊編輯此選項',
        tags: {},
        image: '',
    }
    return choice
}
