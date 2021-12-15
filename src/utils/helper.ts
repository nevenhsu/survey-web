import _ from 'lodash'
import { isValid } from 'date-fns'
import cryptoRandomString from 'crypto-random-string'
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
    OneInTwoQuiz,
    DraggerQuiz,
    FillQuiz,
    SliderQuiz,
    ChoiceType,
    DraggerChoiceType,
    Component,
    Tags,
    DeviceType,
    Responsive,
} from 'common/types'
import { getMuiColor, colors } from 'theme/palette'

export function getStringLength(str: string) {
    const val = str.replace(/[^\x00-\xff]/g, '**')
    const all = val.length
    const longEngChar = _.compact(val.match(/w|m/gim)).length

    return _.round(all - longEngChar + longEngChar * 1.6, 1)
}

export function shuffle<T>(value: Array<T>): Array<T> {
    const array = [...value]
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

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

export function toNumOrStr(value: any) {
    let val: any = value === '' ? undefined : value
    val = Number(val) || val
    return val
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
    const { id = setId(), createdAt = Date.now(), mode = Mode.oneInTwo } = data

    const quiz = getDefaultQuiz(
        setId(),
        mode === Mode.oneInTwo ? QuizMode.oneInTwo : QuizMode.dragger
    )

    const survey: Survey = {
        id,
        createdAt,
        mode,
        updatedAt: createdAt,
        quizzes: [getDefaultQuiz(setId(), QuizMode.page), quiz],
        tags: {},
        results: { selectedTags: [], list: {}, button: {} },
        setting: { showProgress: true, maxWidth: 800 },
        final: {
            mode: FinalMode.info,
            components: [],
            data: {},
            setting: {
                info: {
                    name: true,
                    gender: true,
                    birthday: true,
                    mobile: true,
                    email: true,
                },
            },
        },
        trackingId: [],
        enable: false,
    }
    return survey
}

export function getDefaultQuiz(id: string, mode: QuizMode): QuizType {
    const defaultQuiz: Quiz = {
        id,
        mode,
        title: {
            text: '',
            variant: 'h6',
        },
        button: {
            text: '下一題',
            variant: 'contained',
            size: 'large',
        },
        cover: {
            image: '',
            width: {
                xs: 'auto',
                sm: 'auto',
                lg: 'auto',
            },
            height: 'auto',
        },
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
                responsive: {
                    xs: 12,
                    sm: 6,
                    lg: 3,
                },
                px: {
                    xs: 1,
                    sm: 1,
                    lg: 1,
                },
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
                responsive: {
                    xs: 8,
                    sm: 6,
                    lg: 4,
                },
                px: {
                    xs: 1,
                    sm: 1,
                    lg: 1,
                },
            }
            return quiz
        }
        case QuizMode.oneInTwo: {
            const quiz: OneInTwoQuiz = {
                ...defaultQuiz,
                choices: [getDefaultChoice(), getDefaultChoice()],
                values: [],
                tagsId: [],
                showImage: false,
                responsive: {
                    xs: 6,
                    sm: 4,
                    lg: 3,
                },
                px: {
                    xs: 1,
                    sm: 1,
                    lg: 1,
                },
            }
            return quiz
        }
        case QuizMode.dragger: {
            const leftId = setId()
            const quiz: DraggerQuiz = {
                ...defaultQuiz,
                left: {
                    id: leftId,
                    text: '左選項',
                    variant: 'contained',
                    size: 'large',
                    textColor: '#ffffff',
                    buttonColor: colors[0][500],
                },
                right: {
                    id: setId(),
                    text: '右選項',
                    variant: 'contained',
                    size: 'large',
                    textColor: '#ffffff',
                    buttonColor: colors[1][500],
                },
                choices: [getDefaultDraggerChoice(leftId)],
                values: [],
                showImage: false,
                countDown: 30 * 1000,
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
        label: '',
        tags: {},
        image: '',
        buttonColor: '#3892FC',
        bgcolor: '#ffffff',
    }
    return choice
}

export function getDefaultDraggerChoice(answer: string) {
    const choice: DraggerChoiceType = {
        id: setId(),
        label: '',
        image: '',
        bgcolor: '#ffffff',
        variant: 'h6',
        answer,
    }
    return choice
}

export function getDefaultTags(label: string): Tags {
    return {
        id: setId(),
        label,
        values: [],
        color: getMuiColor().name,
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
                value: '',
                display: 'block',
                align: 'center',
                typoVariant: 'h4',
                color: '#212121',
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
                color: '#666666',
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
        case ComponentType.button: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                display: 'inline-block',
                align: 'center',
                typoVariant: 'button',
                color: '#ffffff',
                buttonColor: '#3892FC',
                width: 'auto',
            }
            return component
        }
        case ComponentType.link: {
            const component: Component = {
                ...defaultComponent,
                value: '',
                link: '',
                linkStyle: 'button',
                display: 'inline-block',
                align: 'center',
                typoVariant: 'button',
                color: '#ffffff',
                width: 'auto',
                buttonColor: '#3892FC',
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
                color: '#3892FC',
                buttonColor: '#3892FC',
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

export function toDate(value: any) {
    const date = new Date(value)
    if (isValid(date)) {
        return date
    }
}

export function toISOString(value?: Date) {
    if (value) {
        try {
            return value.toISOString()
        } catch (err) {
            console.error(err)
            return ''
        }
    }
    return ''
}

export function getAnswerURL(surveyId: string) {
    const url = `${window.location.origin}/survey/${surveyId}`

    function openWindow() {
        window.open(url, '_blank')
    }

    return {
        url,
        openWindow,
    }
}

export function replaceByData<T>(
    value: string,
    separator: RegExp,
    data: Array<T>
): Array<string | T> {
    const val = _.split(value, separator)
    const list = _.zip(val, data)
    return _.compact(_.flatten(list))
}

export function getDeviceValue<T>(device: DeviceType, value?: Responsive<T>) {
    if (value && _.isObject(value)) {
        switch (device) {
            case 'mobile':
                return value.xs
            case 'laptop':
                return value.sm
            case 'desktop':
                return value.lg
        }
    }
}

export function mq(bp: Number) {
    return `@media (min-width: ${bp}px)`
}
