import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { ComponentList } from 'components/common/Component/View'
import { useAppSelector, useAppDispatch } from 'hooks'
import {
    selectSurvey,
    selectAnswer,
    updateStep,
    updateAnswerData,
} from 'store/slices/answer'
import { AnswerStep, QuizMode, Mode } from 'common/types'
import type {
    Result,
    QuizType,
    AnswerValue,
    DraggerQuiz,
    OneInTwoQuiz,
} from 'common/types'

type TagResult = {
    number: number
    tagId: string
    tag: string
}

export default function ResultView() {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectSurvey)
    const answer = useAppSelector(selectAnswer)

    const { answers } = answer ?? {}

    const { id: surveyId, mode, results, quizzes = [] } = survey ?? {}
    const { list, selectedTags: rawSelectedTags } = results ?? {}
    const selectedTags = _.compact(rawSelectedTags)

    const isOneInTwoMode = mode === Mode.oneInTwo

    const [result, setResult] = React.useState<Result>()

    const { components = [] } = result ?? {}

    const handleNext = () => {
        dispatch(updateStep(AnswerStep.final))
    }

    React.useEffect(() => {
        const resultList = _.map(list, (el) => el)

        if (_.isEmpty(resultList)) {
            return
        }

        if (isOneInTwoMode) {
            if (selectedTags.length) {
                const [tagId1, tagId2] = selectedTags

                const tagValues = calcTagResult(quizzes, answers)
                const tagResults1 = filterTagResults(tagValues, tagId1)
                const tagResults2 = filterTagResults(tagValues, tagId2)
                const finalResults = getFinalResults(
                    resultList,
                    tagResults1,
                    tagResults2
                )

                console.log({
                    selectedTags,
                    answers,
                    tagValues,
                    tagResults1,
                    tagResults2,
                    finalResults,
                })

                if (finalResults && finalResults.length) {
                    const index = _.random(0, finalResults.length - 1)
                    setResult(finalResults[index])
                    return
                }
            }

            // random
            const index = _.random(0, resultList.length - 1)
            setResult(resultList[index])
            return
        } else {
            // dragger
            const score = calcScore(quizzes, answers)
            const result = _.find(resultList, (el) => {
                const { range = [] } = el
                const [min, max] = range

                if (score) {
                    return score > min && score <= max
                }

                return min === 0 && score < max
            })

            if (result) {
                setResult(result)
                return
            }
        }
    }, [list])

    React.useEffect(() => {
        if (result) {
            dispatch(updateAnswerData({ resultId: result.id }))
        }
    }, [result])

    return (
        <>
            <ComponentList components={components} />

            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                >
                    下一步
                </Button>
            </Box>
        </>
    )
}

function calcScore(
    quizzes: QuizType[],
    answers: { [quizId: string]: AnswerValue }
) {
    const draggers = _.filter(
        quizzes,
        (el) => el.mode === QuizMode.dragger
    ) as DraggerQuiz[]
    const scores = _.map(draggers, (quiz) => {
        const { id: quizId } = quiz
        const { values = [] } = answers[quizId] ?? {}
        return values.length
    })
    return _.sum(scores)
}

function calcTagResult(
    quizzes: QuizType[],
    answers: { [quizId: string]: AnswerValue }
): TagResult[] {
    const oneInTwos = _.filter(
        quizzes,
        (el) => el.mode === QuizMode.oneInTwo
    ) as OneInTwoQuiz[]

    const answersValue = _.map(oneInTwos, (quiz) => {
        const { id: quizId } = quiz
        return answers[quizId]
    })

    const tagsValues = _.map(answersValue, (answer) => {
        const { quizId, values } = answer ?? {}
        if (quizId && !_.isEmpty(values)) {
            return _.map(values, (choiceId) => {
                const { choices = [] } =
                    (_.find(quizzes, { id: quizId }) as OneInTwoQuiz) ?? {}
                const { tags } = _.find(choices, { id: choiceId }) ?? {}
                if (!_.isEmpty(tags)) {
                    return tags
                }
            })
        }
    })

    const tagsVal = _.compact(_.flattenDeep(tagsValues))
    const tagValues: string[][][] = _.map(tagsVal, (val) => {
        return _.map(val, (tags, tagId) =>
            _.map(tags, (tag) => `${tagId}.${tag}`)
        )
    })

    const tagVal: string[] = _.flattenDeep(tagValues)
    const counts = _.countBy(tagVal)

    const values = _.map(counts, (number, key) => {
        const [tagId, tag] = _.split(key, '.')
        return { number, tagId, tag }
    })
    const result = _.orderBy(values, ['number'], ['desc'])

    return result
}

function filterTagResults(values: TagResult[], tagId: string): TagResult[] {
    if (_.isEmpty(values) || !tagId) {
        return []
    }

    return _.reduce<TagResult, TagResult[]>(
        values,
        (results, el) => {
            const [first] = results

            if (el.tagId === tagId) {
                if (first && el.number === first.number) {
                    results.push(el)
                }

                if (_.isNil(first)) {
                    results.push(el)
                }
            }

            return results
        },
        []
    )
}

function getFinalResults(
    results: Result[],
    tag1Results: TagResult[],
    tag2Results: TagResult[]
) {
    if (_.isEmpty(results)) {
        return
    }

    const tagId1 = _.get(tag1Results, '0.tagId')
    const tagId2 = _.get(tag2Results, '0.tagId')
    const tags1 = _.map(tag1Results, (el) => el.tag)
    const tags2 = _.map(tag2Results, (el) => el.tag)

    if (tagId1 && tags1.length) {
        const result1 = _.filter(results, (el) => {
            const { tags } = el
            const values = tags[tagId1] ?? []
            const intersection = _.intersection(tags1, values)
            return Boolean(intersection.length)
        })

        const filterAgain = tagId2 && tags2.length && result1.length > 1

        const result2 = filterAgain
            ? _.filter(result1, (el) => {
                  const { tags } = el
                  const values = tags[tagId2] ?? []
                  const intersection = _.intersection(tags2, values)
                  return Boolean(intersection.length)
              })
            : []

        return result2.length ? result2 : result1
    }
}
