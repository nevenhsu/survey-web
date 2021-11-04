import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { ComponentList } from 'components/common/Component/View'
import { useAppSelector, useAppDispatch } from 'hooks'
import { selectSurvey, updateStep, updateAnswerData } from 'store/slices/answer'
import { AnswerStep } from 'common/types'
import type { Result } from 'common/types'

export default function ResultView() {
    const dispatch = useAppDispatch()

    const survey = useAppSelector(selectSurvey)

    const { id: surveyId, results } = survey ?? {}
    const { list } = results ?? {}

    const [result, setResult] = React.useState<Result>()

    const { components = [] } = result ?? {}

    const handleNext = () => {
        dispatch(updateStep(AnswerStep.final))
    }

    React.useEffect(() => {
        // TODO: use real result data
        const resultList = _.map(list, (el) => el)

        if (resultList.length) {
            const index = _.random(0, resultList.length - 1)
            setResult(resultList[index])
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
