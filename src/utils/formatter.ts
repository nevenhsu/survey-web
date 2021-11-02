import _ from 'lodash'
import { toBool, toNumber } from 'utils/helper'
import { Mode, QuizMode, ComponentType, FinalMode } from 'common/types'
import type {
    Survey,
    QuizType,
    Quiz,
    SelectionQuiz,
    SliderQuiz,
    Component,
    Final,
    Answer,
} from 'common/types'

export function surveyFormatter(survey: Survey): Survey {
    const {
        id,
        createdAt,
        updatedAt,
        mode,
        quizzes = [],
        tags = {},
        results,
        final,
        setting,
        ...others
    } = survey

    const { list, ...r } = results ?? {}

    _.forEach(list, (value, id) => {
        const { components, ...v } = value
        list[id] = {
            ...v,
            components: _.map(components, (comp) => componentFormatter(comp)),
        }
    })

    const { showProgress, ...s } = setting ?? {}

    return {
        ...others,
        id,
        createdAt: Number(createdAt),
        updatedAt: Number(updatedAt),
        mode: Mode[mode],
        quizzes: _.map(quizzes, (quiz) => quizFormatter(quiz)),
        tags,
        results: {
            ...r,
            list: list ?? {},
        },
        final: finalFormatter(final),
        setting: {
            ...s,
            showProgress: toBool(showProgress),
        },
    }
}

export function quizFormatter(value: QuizType): QuizType {
    const { mode: modeRaw, required: requiredRaw } = value

    const mode = QuizMode[modeRaw]
    const required = toBool(requiredRaw)

    const quiz = {
        ...value,
        mode,
        required,
    }

    switch (mode) {
        case QuizMode.page:
        case QuizMode.fill: {
            return quiz as Quiz
        }
        case QuizMode.selection: {
            const {
                showImage,
                maxChoices,
                choices = [],
                ...others
            } = quiz as SelectionQuiz
            const selectionQuiz: SelectionQuiz = {
                showImage: toBool(showImage),
                maxChoices: toNumber(maxChoices) ?? 1,
                choices,
                ...others,
            }
            return selectionQuiz
        }
        case QuizMode.sort: {
            const {
                showImage,
                maxChoices,
                choices = [],
                ...others
            } = quiz as SelectionQuiz
            const sortQuiz: SelectionQuiz = {
                ...others,
                showImage: toBool(showImage),
                maxChoices: toNumber(maxChoices) ?? 4,
                choices,
            }
            return sortQuiz
        }

        case QuizMode.slider: {
            const { max, min, value, ...others } = quiz as SliderQuiz
            const sliderQuiz: SliderQuiz = {
                ...others,
                max: toNumber(max),
                min: toNumber(min),
                value: toNumber(value),
            }
            return sliderQuiz
        }
    }
}

export function componentFormatter(value: Component): Component {
    const {
        type: typeRaw,
        width: w,
        height: h,
        components: compRaw,
        ...rest
    } = value
    const type = ComponentType[typeRaw]

    const width = toNumber(w) ?? w
    const height = toNumber(h) ?? h

    const components = _.map(compRaw, (el) => componentFormatter(el))

    const component: Component = {
        ...rest,
        type,
        width,
        height,
        components,
    }

    return component
}

export function finalFormatter(value: Final): Final {
    const { components: compRaw = [], mode, ...rest } = value

    const components = _.map(compRaw, (el) => componentFormatter(el))

    return {
        ...rest,
        mode: FinalMode[mode],
        components,
    }
}

export function answerFormatter(value: Answer): Answer {
    const { createdAt, updatedAt, ...rest } = value

    return {
        ...rest,
        createdAt: toNumber(createdAt),
        updatedAt: toNumber(updatedAt),
    }
}
