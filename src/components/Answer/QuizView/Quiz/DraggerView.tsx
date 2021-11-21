import * as React from 'react'
import _ from 'lodash'
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimation,
} from 'framer-motion'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DraggerChoiceView from 'components/Answer/QuizView/Quiz/DraggerChoiceView'
import CustomButton from 'components/common/CustomButton'
import ImageBox from 'components/common/ImageBox'
import CountDownProgress from 'components/common/CountDownProgress'
import { shuffle } from 'utils/helper'
import { colors } from 'theme/palette'
import type { OnChangeInput, DraggerQuiz } from 'common/types'

type DraggerViewProps = {
    quizProps: DraggerQuiz
    onChange: OnChangeInput
    onDone: () => void
}

const MotionDraggerChoiceView = motion(DraggerChoiceView)

export default function DraggerView(props: DraggerViewProps) {
    const { quizProps, onChange, onDone } = props
    const {
        title,
        values = [],
        choices: rawChoices = [],
        left,
        right,
        countDown,
        showImage,
    } = quizProps

    const [current, setCurrent] = React.useState(0)
    const choices = React.useMemo(() => {
        return shuffle(rawChoices)
    }, [rawChoices])
    const choice = choices[current]

    const leftColor = left.buttonColor || colors[0][500]
    const rightColor = right.buttonColor || colors[1][500]

    // for framer
    const controls = useAnimation()
    const x = useMotionValue(0)
    const border = useTransform(
        x,
        [-200, 0, 200],
        [
            `4px solid ${leftColor}`,
            `4px solid #ffffff`,
            `4px solid ${rightColor}`,
        ]
    )
    const rotate = useTransform(x, [-200, 200], [-30, 30])

    const handleAnswer = (answerId: string) => {
        const { id: choiceId, answer } = choice ?? {}
        if (choiceId && answer === answerId) {
            onChange({
                target: {
                    name: 'values',
                    value: [...values, choiceId],
                },
            } as any)
        }
        setCurrent((state) => (state += 1))
        controls.start({ x: 0 })
    }

    const handleEnd = () => {
        onDone()
    }

    React.useEffect(() => {
        if (_.isEmpty(rawChoices)) {
            onDone()
        } else if (current >= rawChoices.length) {
            onDone()
        }
    }, [rawChoices, current])

    return (
        <>
            {Boolean(countDown) && (
                <CountDownProgress
                    countDown={Number(countDown)}
                    onEnd={() => {
                        if (countDown && countDown > 0) {
                            handleEnd()
                        }
                    }}
                    sx={{ position: 'fixed', top: 8, width: '100%', px: 2 }}
                />
            )}

            <Typography variant="h6">{title.text}</Typography>
            <Box sx={{ height: 16 }} />

            <Box
                sx={{
                    width: '60vh',
                    textAlign: 'center',
                }}
            >
                {Boolean(left.image) && (
                    <ImageBox
                        className="absolute-center"
                        sx={{ left: -24, maxWidth: '20vw' }}
                        imageUrl={left.image}
                    />
                )}

                {Boolean(right.image) && (
                    <ImageBox
                        className="absolute-center"
                        sx={{
                            right: -24,
                            left: 'unset',
                            transform: 'translate(50%, -50%)',
                            maxWidth: '20vw',
                        }}
                        imageUrl={right.image}
                    />
                )}

                <MotionDraggerChoiceView
                    animate={controls}
                    choice={choice}
                    style={{ x, rotate, border, originX: 0.5 }}
                    drag="x"
                    dragConstraints={{ left: -1000, right: 1000 }}
                    onDragEnd={(event, info) => {
                        // If the card is dragged only upto 150 on x-axis
                        // bring it back to initial position
                        if (Math.abs(info.offset.x) <= 150) {
                            controls.start({ x: 0 })
                        } else {
                            // If card is dragged beyond 150
                            // make it disappear
                            // making use of ternary operator
                            const negative = info.offset.x < 0
                            controls.start({
                                x: negative ? -200 : 200,
                            })
                            const answerId = negative ? left.id : right.id
                            handleAnswer(answerId)
                        }
                    }}
                />
            </Box>

            <Box sx={{ height: 16 }} />

            <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
                sx={{ width: '60vh' }}
            >
                <CustomButton
                    customProps={{ ...left, buttonColor: leftColor }}
                    size="large"
                    defaultText="左選項"
                    onClick={(event) => handleAnswer(left.id)}
                />
                <CustomButton
                    customProps={{ ...right, buttonColor: rightColor }}
                    size="large"
                    defaultText="右選項"
                    onClick={(event) => handleAnswer(right.id)}
                />
            </Stack>
        </>
    )
}
