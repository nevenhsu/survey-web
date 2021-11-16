import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import ChoiceView from 'components/Answer/QuizView/Quiz/ChoiceView'
import { shuffle } from 'utils/helper'
import type { OnChangeInput, OneInTwoType, ChoiceType } from 'common/types'

type OneInTwoViewProps = {
    title: string
    quizProps: Omit<OneInTwoType, 'tagsId'>
    onChange: OnChangeInput
    onDone: () => void
}

export default function OneInTwoView(props: OneInTwoViewProps) {
    const { title, quizProps, onChange, onDone } = props
    const { choices = [], values = [], showImage, direction } = quizProps

    const [current, setCurrent] = React.useState(0)
    const choiceGroups = React.useMemo(() => {
        return shuffleChoices(choices)
    }, [choices])

    const choiceGroup = choiceGroups[current]

    const handleClick = (id: string) => {
        if (id) {
            onChange({
                target: {
                    name: 'values',
                    value: [...values, id],
                },
            } as any)
            setCurrent((state) => (state += 1))
        }
    }

    React.useEffect(() => {
        if (_.isEmpty(choiceGroups)) {
            onDone()
        } else if (current >= choiceGroups.length) {
            onDone()
        }
    }, [choiceGroups, current])

    return (
        <>
            <Typography variant="h6">{title}</Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Stack
                    direction={direction || 'row'}
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    {_.map(choiceGroup, (el) => (
                        <ChoiceView
                            key={el.id}
                            choice={el}
                            showImage={showImage}
                            onClick={(event) => {
                                handleClick(el.id)
                            }}
                            variant="outlined"
                        />
                    ))}
                </Stack>
            </Box>
        </>
    )
}

function shuffleChoices(value: ChoiceType[]) {
    const shuffled = shuffle(value)

    const choiceGroups: ChoiceType[][] = []
    const picked: { [id: string]: boolean } = {}

    _.forEach(shuffled, (leftEl) => {
        const { id, tags } = leftEl

        if (!picked[id]) {
            picked[id] = true

            const tagsId = _.keys(tags)
            const tagsVal = _.flatten(_.values(tags))

            let rightEl: ChoiceType | undefined

            rightEl = _.find(shuffled, (o) => {
                const { id: id2, tags: tags2 } = o
                const tagsId2 = _.keys(tags2)
                const tagsVal2 = _.flatten(_.values(tags2))

                const sameId = _.intersection(tagsId, tagsId2)
                const differentTag = _.xor(tagsVal, tagsVal2)

                return (
                    !picked[id2] && sameId.length > 0 && differentTag.length > 0
                )
            })

            if (!rightEl) {
                rightEl = _.find(shuffled, (o) => {
                    return !picked[o.id]
                })
            }

            if (rightEl) {
                picked[rightEl.id] = true
                choiceGroups.push([leftEl, rightEl])
            }
        }
    })

    return choiceGroups
}
