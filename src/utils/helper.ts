import _ from 'lodash'
import cryptoRandomString from 'crypto-random-string'
import { QuizMode, QuizType, ComponentType } from 'common/types'
import type {
    Quiz,
    SelectionQuiz,
    FillQuiz,
    SliderQuiz,
    ChoiceType,
    Component,
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

export function getDefaultQuiz(id: string, mode: QuizMode): QuizType {
    const defaultQuiz: Quiz = {
        id,
        mode,
        title: '未命名題目',
        buttonText: '下一題',
        buttonVariant: 'contained',
    }

    switch (mode) {
        case QuizMode.selection:
        case QuizMode.sort: {
            const quiz: SelectionQuiz = {
                ...defaultQuiz,
                choices: [getDefaultChoice()],
                values: [],
                tagsId: [],
                maxChoices: 4,
                showLabel: true,
                showImage: false,
                direction: 'column',
            }
            return quiz
        }
        case QuizMode.slider: {
            const quiz: SliderQuiz = {
                ...defaultQuiz,
                max: 100,
                min: 0,
                value: 50,
            }
            return quiz
        }
        case QuizMode.fill: {
            const quiz: FillQuiz = {
                ...defaultQuiz,
                value: '',
            }
            return quiz
        }
        case QuizMode.page:
        default: {
            return defaultQuiz
        }
    }
}

export function getDefaultChoice() {
    const choice: ChoiceType = {
        id: setId(),
        label: '未命名選項',
        tags: {},
        image: '',
        buttonVariant: 'outlined',
    }
    return choice
}

export function getDefaultComponent(type: ComponentType) {
    const defaultComponent: Component = {
        id: setId(),
        type,
    }

    switch (type) {
        case ComponentType.title: {
            const component: Component = {
                ...defaultComponent,
                value: '未命名標題',
                display: 'block',
                align: 'center',
                typoVariant: 'h4',
                color: 'text.primary',
            }
            return component
        }
        case ComponentType.typography: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'block',
                align: 'center',
                typoVariant: 'body1',
                color: 'text.secondary',
            }
            return component
        }
        case ComponentType.image: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'block',
                align: 'center',
                width: 'auto',
                height: 'auto',
            }
            return component
        }
        case ComponentType.link: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                link: '',
                underline: 'always',
                display: 'inline-block',
                align: 'center',
                typoVariant: 'button',
                color: 'primary.main',
            }
            return component
        }
        case ComponentType.clipboard: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'block',
                align: 'center',
                typoVariant: 'h6',
                color: 'primary.main',
            }
            return component
        }
        case ComponentType.card: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'inline-block',
                align: 'center',
                width: 320,
                height: 'auto',
                components: [],
                color: 'grey',
            }
            return component
        }
    }
}
