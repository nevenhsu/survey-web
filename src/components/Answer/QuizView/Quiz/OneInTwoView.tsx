import * as React from 'react'
import _ from 'lodash'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ChoiceView from 'components/Answer/QuizView/Quiz/ChoiceView'
import { shuffle } from 'utils/helper'
import type { OnChangeInput, OneInTwoQuiz, ChoiceType } from 'common/types'

type OneInTwoViewProps = {
    quizProps: OneInTwoQuiz
    onChange: OnChangeInput
    onDone: () => void
}

export default function OneInTwoView(props: OneInTwoViewProps) {
    const { quizProps, onChange, onDone } = props
    const {
        title,
        choices = [],
        values = [],
        showImage,
        responsive,
        px,
    } = quizProps

    const [current, setCurrent] = React.useState(0)
    const choiceGroups = React.useMemo(() => {
        return shuffleChoices(choices)
    }, [choices])

    const choiceGroup = choiceGroups[current]

    const progress = _.round(((current + 1) / choiceGroups.length) * 100)
    const progressText = `${current + 1} / ${choiceGroups.length}`

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
            <Box sx={{ position: 'fixed', top: 8, width: '100%', px: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ width: '100%', height: 16, borderRadius: 99 }}
                        color="inherit"
                    />
                    <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{ minWidth: `${progressText.length}ch` }}
                    >
                        {progressText}
                    </Typography>
                </Stack>
            </Box>

            <Typography variant="h6">{title.text}</Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: '100%', textAlign: 'center', px }}>
                <Grid
                    container
                    direction="row"
                    // alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {_.map(choiceGroup, (el) => (
                        <Grid key={el.id} item {...responsive}>
                            <ChoiceView
                                key={el.id}
                                choice={el}
                                showImage={showImage}
                                onClick={(event) => {
                                    handleClick(el.id)
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
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
