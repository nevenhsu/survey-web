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
    Result,
    Responsive,
    Padding,
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
        enable,
        ...others
    } = survey

    const { list, ...r } = results ?? {}

    _.forEach(list, (value, id) => {
        list[id] = resultFormatter(value)
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
        enable: toBool(enable),
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
                responsive,
                px,
                ...others
            } = quiz as SelectionQuiz

            const selectionQuiz: SelectionQuiz = {
                ...others,
                ...layoutFormatter(responsive, px),
                showImage: toBool(showImage),
                maxChoices: toNumber(maxChoices) ?? 1,
                choices: _.map(choices, (el) => choiceFormatter(el)),
                values,
                tagsId,
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
                responsive,
                px,
                ...others
            } = quiz as SelectionQuiz

            const sortQuiz: SelectionQuiz = {
                ...others,
                ...layoutFormatter(responsive, px),
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
                responsive,
                px,
                ...others
            } = quiz as OneInTwoQuiz

            const oneInTwoQuiz: OneInTwoQuiz = {
                ...others,
                ...layoutFormatter(responsive, px),
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

export function resultFormatter(value: Result) {
    const { tags = {}, components: compRaw, range = [], ...rest } = value

    const components = _.map(compRaw, (el) => componentFormatter(el))

    return {
        ...rest,
        range: _.map(range, (n) => toNumber(n) || 0),
        tags,
        components,
    }
}

export function layoutFormatter(resp?: Responsive, pxd?: Padding) {
    const responsive = {
        xs: toNumber(resp?.xs) || 12,
        sm: toNumber(resp?.sm) || 6,
        lg: toNumber(resp?.lg) || 3,
    } as Responsive

    const px: Padding = {
        xs: toNumber(pxd?.xs) ?? 1,
        sm: toNumber(pxd?.sm) ?? 1,
        lg: toNumber(pxd?.lg) ?? 1,
    }

    return {
        responsive,
        px,
    }
}
