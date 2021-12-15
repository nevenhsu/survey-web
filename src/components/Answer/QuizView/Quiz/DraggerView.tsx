import * as React from 'react'
import _ from 'lodash'
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimation,
} from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import DraggerChoiceView from 'components/Answer/QuizView/Quiz/DraggerChoiceView'
import CustomButton from 'components/common/CustomButton'
import CountDownProgress from 'components/common/CountDownProgress'
import CustomTypography from 'components/common/CustomTypography'
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
    } = quizProps

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('sm'))
    const width = matches ? 'calc(100vh - 120px)' : '100%'

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
        controls.start({ opacity: 0, transition: { duration: 0 } })
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
    }

    const handleEnd = () => {
        onDone()
    }

    React.useEffect(() => {
        controls.start({ x: 0, opacity: 1, transition: { duration: 0 } })

        if (_.isEmpty(rawChoices)) {
            onDone()
        } else if (current >= rawChoices.length) {
            onDone()
        }
    }, [rawChoices, current])

    const leftButton = () => (
        <CustomButton
            customProps={{ ...left, buttonColor: leftColor }}
            defaultText="左選項"
            onClick={(event) => handleAnswer(left.id)}
            circle
        />
    )

    const rightButton = () => (
        <CustomButton
            customProps={{ ...right, buttonColor: rightColor }}
            defaultText="右選項"
            onClick={(event) => handleAnswer(right.id)}
            circle
        />
    )

    const cards = () => {
        const choice = choices[current]
        const nextChoice = choices[current + 1]

        return (
            <Box
                sx={{ position: 'relative', width: '100%', zIndex: 'tooltip' }}
            >
                {Boolean(choice) && (
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
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
                                    const answerId = negative
                                        ? left.id
                                        : right.id
                                    handleAnswer(answerId)
                                }
                            }}
                        />
                    </Box>
                )}
                {Boolean(nextChoice) && (
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            zIndex: 0,
                            bottom: -8,
                            pointerEvents: 'none',
                            transform: 'scale(0.98)',
                            transformOrigin: 'bottom center',
                        }}
                    >
                        <MotionDraggerChoiceView
                            choice={nextChoice}
                            style={{ originX: 0.5 }}
                            drag="x"
                            dragConstraints={{ left: -1000, right: 1000 }}
                        />
                    </Box>
                )}
            </Box>
        )
    }

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

            <CustomTypography {...title} />
            <Box sx={{ height: 16 }} />

            <Box
                sx={{
                    width,
                    textAlign: 'center',
                    userSelect: 'none',
                }}
            >
                {matches ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {leftButton()}
                        {cards()}
                        {rightButton()}
                    </Stack>
                ) : (
                    cards()
                )}
            </Box>

            <Box sx={{ height: 16 }} />

            {!matches && (
                <Box sx={{ width }}>
                    <Stack
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={2}
                    >
                        {leftButton()}
                        {rightButton()}
                    </Stack>
                </Box>
            )}
        </>
    )
}
