import _ from 'lodash'
import cryptoRandomString from 'crypto-random-string'
import { defaultTags } from 'common/defaultTags'
import {
    QuizMode,
    QuizType,
    ComponentType,
    Mode,
    FinalMode,
} from 'common/types'
import type {
    Survey,
    Quiz,
    SelectionQuiz,
    FillQuiz,
    SliderQuiz,
    ChoiceType,
    Component,
    Tags,
    Result,
} from 'common/types'
import { getMuiColor } from 'theme/palette'

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

export function toBool(value: any) {
    if (
        value === true ||
        Number(value) === 1 ||
        _.lowerCase(value) === 'true'
    ) {
        return true
    }

    return false
}

export function toNumber(value: any) {
    if (value === '' || _.isNil(value)) {
        return undefined
    }

    const num = _.toNumber(value)

    if (_.isNaN(num)) {
        return undefined
    }

    return num
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

export function getDefaultSurvey(data: Partial<Survey>): Survey {
    const { id = setId(), createdAt = Date.now(), mode = Mode.persona } = data

    const survey: Survey = {
        id,
        createdAt,
        mode,
        updatedAt: createdAt,
        quizzes: [
            {
                id: setId(),
                mode: QuizMode.page,
                title: '測驗標題',
            },
        ],
        tags: mode === Mode.product ? _.keyBy(defaultTags, 'id') : {},
        results: { selectedTags: [], list: {} },
        setting: { showProgress: true },
        final: { mode: FinalMode.info, components: [] },
    }
    return survey
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
        case QuizMode.selection: {
            const quiz: SelectionQuiz = {
                ...defaultQuiz,
                choices: [getDefaultChoice()],
                values: [],
                tagsId: [],
                maxChoices: 1,
                showImage: false,
                direction: 'column',
            }
            return quiz
        }
        case QuizMode.sort: {
            const quiz: SelectionQuiz = {
                ...defaultQuiz,
                choices: [getDefaultChoice()],
                values: [],
                tagsId: [],
                maxChoices: 4,
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
    }
    return choice
}

export function getDefaultTags(label: string): Tags {
    return {
        id: setId(),
        label,
        values: [],
        color: getMuiColor().key,
    }
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
                width: '100%',
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
                width: '100%',
            }
            return component
        }
        case ComponentType.image: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'block',
                align: 'center',
                width: '100%',
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
                width: '100%',
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
                buttonColor: 'primary.main',
                width: '100%',
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

export function getDefaultResult(): Result {
    return {
        id: setId(),
        title: '',
        tags: {},
        components: [],
    }
}
