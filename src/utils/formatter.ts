import _ from 'lodash'
import { toBool, toNumber } from 'utils/helper'
import { Mode, QuizMode, ComponentType, FinalMode } from 'common/types'
import type {
    Survey,
    QuizType,
    Quiz,
    SelectionQuiz,
    OneInTwoQuiz,
    DraggerQuiz,
    SliderQuiz,
    Component,
    Final,
    Answer,
    ChoiceType,
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
        const { components, tags = {}, ...v } = value
        list[id] = {
            ...v,
            tags,
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
    const {
        mode: modeRaw,
        required: requiredRaw,
        imageWidth,
        imageHeight,
    } = value

    const mode = QuizMode[modeRaw]
    const required = toBool(requiredRaw)

    const quiz = {
        ...value,
        mode,
        required,
        imageWidth: imageWidth ? toNumber(imageWidth) || imageWidth : undefined,
        imageHeight: imageHeight
            ? toNumber(imageHeight) || imageHeight
            : undefined,
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
                values = [],
                tagsId = [],
                ...others
            } = quiz as SelectionQuiz
            const selectionQuiz: SelectionQuiz = {
                showImage: toBool(showImage),
                maxChoices: toNumber(maxChoices) ?? 1,
                choices: _.map(choices, (el) => choiceFormatter(el)),
                values,
                tagsId,
                ...others,
            }
            return selectionQuiz
        }
        case QuizMode.sort: {
            const {
                showImage,
                maxChoices,
                choices = [],
                values = [],
                tagsId = [],
                ...others
            } = quiz as SelectionQuiz
            const sortQuiz: SelectionQuiz = {
                ...others,
                showImage: toBool(showImage),
                maxChoices: toNumber(maxChoices) ?? 4,
                choices: _.map(choices, (el) => choiceFormatter(el)),
                values,
                tagsId,
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
        case QuizMode.oneInTwo: {
            const {
                showImage,
                choices = [],
                values = [],
                tagsId = [],
                ...others
            } = quiz as OneInTwoQuiz

            const oneInTwoQuiz: OneInTwoQuiz = {
                ...others,
                showImage: toBool(showImage),
                choices: _.map(choices, (el) => choiceFormatter(el)),
                values,
                tagsId,
            }
            return oneInTwoQuiz
        }
        case QuizMode.dragger: {
            const {
                showImage,
                choices = [],
                values = [],
                ...others
            } = quiz as DraggerQuiz
            const draggerQuiz: DraggerQuiz = {
                ...others,
                showImage: toBool(showImage),
                choices,
                values,
            }
            return draggerQuiz
        }
    }
}

export function choiceFormatter(value: ChoiceType): ChoiceType {
    const { label = '', tags: tagsRaw, ...rest } = value ?? {}

    const tags: { [tagId: string]: string[] } = {}
    _.forEach(tagsRaw, (val, key) => {
        if (key) {
            tags[key] = _.filter(val, (el) => !_.isNil(el) && el !== '')
        }
    })

    return {
        ...rest,
        label,
        tags,
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
