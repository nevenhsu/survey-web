import _ from 'lodash'
import { toBool, toNumber, toNumOrStr } from 'utils/helper'
import type { GridSize } from '@mui/material/Grid'
import { colors } from 'theme/palette'
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
    CustomButtonType,
    TextType,
    CoverType,
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

    const { list, button: btnRaw, ...r } = results ?? {}
    const button = customButtonFormatter(btnRaw)

    _.forEach(list, (value, id) => {
        list[id] = resultFormatter(value)
    })

    const { showProgress, maxWidth, ...s } = setting ?? {}

    _.forEach(tags, (tag, id) => {
        const { values, ...t } = tag
        tags[id] = {
            ...t,
            values: _.filter(values, (el) => el !== '' && !_.isNil(el)),
        }
    })

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
            button,
        },
        final: finalFormatter(final),
        setting: {
            ...s,
            showProgress: toBool(showProgress),
            maxWidth: toNumber(maxWidth) || 800,
        },
        enable: toBool(enable),
    }
}

export function quizFormatter(value: QuizType): QuizType {
    const {
        mode: modeRaw,
        title: titleRaw = {},
        button: btnRaw = {},
        cover: coverRaw = {},
        required: requiredRaw,
    } = value

    const mode = QuizMode[modeRaw]
    const required = toBool(requiredRaw)

    const title: TextType = _.isString(titleRaw)
        ? {
              text: titleRaw,
              variant: 'h6',
          }
        : {
              ...titleRaw,
              padding: toNumOrStr(titleRaw.padding),
          }

    const button = customButtonFormatter(btnRaw)

    const cover: CoverType = {
        ...coverRaw,
        width: {
            xs: toNumOrStr(_.get(coverRaw, 'width.xs', 'auto')),
            sm: toNumOrStr(_.get(coverRaw, 'width.sm', 'auto')),
            lg: toNumOrStr(_.get(coverRaw, 'width.lg', 'auto')),
        },
        height: toNumOrStr(coverRaw.height),
    }

    const quiz = {
        ...value,
        mode,
        title,
        button,
        cover,
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
                countDown,
                choices = [],
                values = [],
                left,
                right,
                ...others
            } = quiz as DraggerQuiz
            const draggerQuiz: DraggerQuiz = {
                ...others,
                left: {
                    textColor: '#ffffff',
                    buttonColor: colors[0][500],
                    ...left,
                    padding: toNumOrStr(left.padding),

                    borderRadius: toNumber(left.borderRadius),
                },
                right: {
                    textColor: '#ffffff',
                    buttonColor: colors[1][500],
                    ...right,
                    padding: toNumOrStr(right.padding),

                    borderRadius: toNumber(right.borderRadius),
                },
                showImage: toBool(showImage),
                countDown: toNumber(countDown),
                choices,
                values,
            }
            return draggerQuiz
        }
    }
}

export function choiceFormatter(value: ChoiceType): ChoiceType {
    const {
        label = '',
        tags: tagsRaw,

        padding,
        borderRadius,
        ...rest
    } = value ?? {}

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

        borderRadius: toNumber(borderRadius),
        padding: toNumOrStr(padding),
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
    const { components: compRaw = [], mode, setting: setRaw, ...rest } = value

    const components = _.map(compRaw, (el) => componentFormatter(el))

    const setting = { info: {} }
    const { info } = setRaw ?? {}

    _.forEach(info, (val, key) => {
        _.set(setting, ['info', key], toBool(val))
    })

    return {
        ...rest,
        mode: FinalMode[mode],
        components,
        setting,
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

function layoutFormatter(_responsive?: Responsive<GridSize>, _px?: Responsive) {
    const responsive = responsiveFormatter<GridSize>(_responsive, {
        xs: 12,
        sm: 6,
        lg: 3,
    })

    const px: Responsive = responsiveFormatter(_px, {
        xs: 1,
        sm: 1,
        lg: 1,
    })

    return {
        responsive,
        px,
    }
}

function responsiveFormatter<T>(
    resp?: Responsive<T>,
    fallback?: Responsive<T>
) {
    const responsive = {
        xs: toNumber(resp?.xs) || fallback?.xs,
        sm: toNumber(resp?.sm) || fallback?.sm,
        lg: toNumber(resp?.lg) || fallback?.lg,
    } as Responsive<T>

    return responsive
}

function customButtonFormatter(btn?: CustomButtonType) {
    const button: CustomButtonType = {
        ...btn,
        padding: toNumOrStr(btn?.padding),
        fontSize: toNumOrStr(btn?.fontSize),
        borderRadius: toNumber(btn?.borderRadius),
    }
    return button
}
