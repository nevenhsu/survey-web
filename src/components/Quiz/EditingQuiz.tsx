import * as React from 'react'
import _ from 'lodash'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/survey'
import { styled } from '@mui/material/styles'
import NumberFormat from 'react-number-format'
import Box from '@mui/material/Box'
import Grid, { GridSize } from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import ImageUploader from 'components/common/ImageUploader'
import ThemeProvider from 'theme/ThemeProvider'
import { getDefaultChoice } from 'utils/helper'
import { lightenColor } from 'theme/palette'
import { QuizMode } from 'common/types'
import type {
    QuizType,
    CustomButton,
    Quiz,
    ChoiceType,
    SelectionType,
    SelectionQuiz,
    FillQuiz,
    SliderType,
    SliderQuiz,
    OnChangeInput,
} from 'common/types'

type onButtonClink = (event: React.MouseEvent<HTMLButtonElement>) => void

type EditingQuizProps = {
    surveyId?: string
    quiz?: QuizType
}

type StyledTextFieldProps = TextFieldProps & { value: string }

const StyledTextField = styled(TextField)<StyledTextFieldProps>(
    ({ theme, value }) => ({
        width: '90%',
        '& .MuiInputBase-input': {
            ...theme.typography.h6,
            margin: 'auto',
            maxWidth: '100%',
            width: `${value?.length * 2}ch`,
        },
    })
)

const QuizButton = (props: {
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { buttonProps, onChange } = props
    const {
        buttonVariant = 'contained',
        buttonText = '下一題',
        buttonColor = '',
        buttonTextColor = '',
    } = buttonProps

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <>
            <Button
                variant={buttonVariant}
                onClick={handleClick}
                sx={{
                    color: buttonTextColor,
                    backgroundColor: buttonColor,
                }}
            >
                {buttonText || '下一題'}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 320 }}>
                    <TextField
                        label="按鈕文字"
                        name="buttonText"
                        variant="standard"
                        value={buttonText}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字顏色"
                        name="buttonTextColor"
                        variant="standard"
                        value={buttonTextColor}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        name="buttonColor"
                        variant="standard"
                        value={buttonColor}
                        onChange={onChange}
                        placeholder="#1565c0"
                        fullWidth
                    />
                </Box>
            </Popover>
        </>
    )
}

const PageView = (props: {
    textFieldProps: StyledTextFieldProps
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { textFieldProps, buttonProps, onChange } = props

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                onChange={onChange}
                multiline
                {...textFieldProps}
            />

            <Box sx={{ height: 16 }} />

            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}

const ChoiceView = (props: {
    value: ChoiceType
    onChange: OnChangeInput
    onDelete: onButtonClink
    showImage?: boolean
}) => {
    const { value, onChange, onDelete, showImage = false } = props

    const {
        id,
        label = '',
        image = '',
        buttonColor = '',
        buttonTextColor = '',
    } = value

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClick}
                sx={(theme) => {
                    const lightColor = lightenColor(
                        theme,
                        buttonColor,
                        0.92,
                        ''
                    )

                    return {
                        width: '100%',
                        color: buttonTextColor,
                        borderColor: buttonColor,
                        flexDirection: 'column',
                        padding: showImage ? '0 0 5px' : '5px 15px',
                        overflow: 'hidden',
                        '&:hover': {
                            borderColor: buttonColor,
                            backgroundColor: lightColor,
                        },
                        '& .MuiTouchRipple-root': {
                            color: buttonColor,
                        },
                    }
                }}
            >
                {showImage && (
                    <span onClick={(e) => e.stopPropagation()}>
                        <ImageUploader
                            bgImage={image}
                            onUploaded={(image) => {
                                onChange({
                                    target: {
                                        value: image,
                                        name: 'image',
                                    },
                                } as any)
                            }}
                            sx={{
                                width: '100%',
                                minHeight: 48,
                                mb: 2,
                            }}
                            loadingButtonProps={{
                                variant: 'text',
                            }}
                            hideButton={Boolean(image)}
                        />
                    </span>
                )}

                {label || '選項'}
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 320 }}>
                    <TextField
                        label="選項文字"
                        name="label"
                        variant="standard"
                        value={label}
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="文字顏色"
                        name="buttonTextColor"
                        variant="standard"
                        value={buttonTextColor}
                        onChange={onChange}
                        placeholder="#fffffff"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label="按鈕顏色"
                        name="buttonColor"
                        variant="standard"
                        value={buttonColor}
                        onChange={onChange}
                        placeholder="#1565c0"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <Button variant="outlined" color="error" onClick={onDelete}>
                        刪除選項
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

const SelectionView = (props: {
    textFieldProps: StyledTextFieldProps
    selectionProps: SelectionType
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { textFieldProps, selectionProps, buttonProps, onChange } = props
    const { choices = [], maxChoices, showImage, direction } = selectionProps

    const responsive: { [key: string]: GridSize } =
        direction === 'row' ? { xs: 6 } : { xs: 12 }

    const handleChoiceChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const value = choices.map((el) =>
            el.id === id ? { ...el, [e.target.name]: e.target.value } : el
        )
        const event = {
            target: {
                name: 'choices',
                value,
            },
        }

        onChange(event as any)
    }

    const handleChoiceDelete = (id: string) => {
        const value = choices.filter((el) => el.id !== id)
        const event = {
            target: {
                name: 'choices',
                value,
            },
        }

        onChange(event as any)
    }

    const handleAddChoice: onButtonClink = () => {
        const newChoice = getDefaultChoice()
        const event = {
            target: {
                name: 'choices',
                value: choices.concat(newChoice),
            },
        }

        onChange(event as any)
    }

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                onChange={onChange}
                multiline
                {...textFieldProps}
            />
            <Typography variant="caption" color="GrayText">
                最多可選擇{maxChoices}項
            </Typography>
            <Box sx={{ height: 16 }} />
            <Box sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Grid
                    container
                    direction={direction}
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {choices.map((el) => (
                        <Grid key={el.id} item {...responsive}>
                            <ChoiceView
                                value={el}
                                onChange={(event) =>
                                    handleChoiceChange(event, el.id)
                                }
                                onDelete={() => handleChoiceDelete(el.id)}
                                showImage={showImage}
                            />
                        </Grid>
                    ))}
                    <Grid item {...responsive}>
                        <Button variant="outlined" onClick={handleAddChoice}>
                            新增選項
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}

const FillView = (props: {
    title: string
    value: string
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { title, value, buttonProps, onChange } = props

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入測驗問題"
                name="title"
                value={title}
                onChange={onChange}
                multiline
            />

            <Box sx={{ height: 16 }} />

            <TextField
                label="自由填空"
                variant="outlined"
                name="value"
                value={value}
                onChange={onChange}
                sx={{ width: 4 / 5 }}
                maxRows={6}
                multiline
            />
            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}

const SliderView = (props: {
    title: string
    slider: SliderType
    buttonProps: CustomButton
    onChange: OnChangeInput
}) => {
    const { title, slider, buttonProps, onChange } = props
    const { max, min, value } = slider

    return (
        <>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                name="title"
                value={title}
                onChange={onChange}
                sx={{ mb: 3 }}
                multiline
            />

            <Box sx={{ width: 4 / 5 }}>
                <Slider
                    defaultValue={_.floor(max ?? 0 / 2) ?? 0}
                    min={min}
                    max={max}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <NumberFormat
                        customInput={TextField}
                        variant="outlined"
                        size="small"
                        label="最小值"
                        value={min}
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'min',
                                },
                            }

                            onChange(event as any)
                        }}
                        sx={{ width: 96 }}
                    />

                    <NumberFormat
                        customInput={TextField}
                        variant="outlined"
                        size="small"
                        label="最大值"
                        value={max}
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'max',
                                },
                            }

                            onChange(event as any)
                        }}
                        sx={{ width: 96 }}
                    />
                </Stack>
            </Box>

            <Box sx={{ height: 16 }} />
            <QuizButton buttonProps={buttonProps} onChange={onChange} />
        </>
    )
}

export default function EditingQuiz(props: EditingQuizProps) {
    const { surveyId, quiz } = props
    const dispatch = useAppDispatch()

    const { image, backgroundColor, backgroundImage } = quiz ?? {}

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (surveyId && quiz) {
            dispatch(
                updateQuiz({
                    surveyId: surveyId,
                    quizId: quiz.id,
                    newValue,
                })
            )
        }
    }

    const renderQuiz = () => {
        if (!surveyId || !quiz) {
            return <div />
        }

        const {
            mode,
            title,
            buttonColor,
            buttonText,
            buttonTextColor,
            buttonVariant,
        } = quiz

        const buttonProps = {
            buttonColor,
            buttonText,
            buttonTextColor,
            buttonVariant,
        }

        switch (mode) {
            case QuizMode.page: {
                const {
                    buttonColor,
                    buttonText,
                    buttonTextColor,
                    buttonVariant,
                } = quiz as Quiz
                return (
                    <PageView
                        textFieldProps={{
                            value: title,
                        }}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.sort:
            case QuizMode.selection: {
                const {
                    choices = [],
                    values = [],
                    tagsId = [],
                    maxChoices = 4,
                    showImage = false,
                    direction,
                } = quiz as SelectionQuiz
                return (
                    <SelectionView
                        textFieldProps={{
                            value: title,
                        }}
                        selectionProps={{
                            choices,
                            values,
                            tagsId,
                            maxChoices,
                            showImage,
                            direction,
                        }}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.fill: {
                const { value = '' } = quiz as FillQuiz
                return (
                    <FillView
                        title={title}
                        value={value}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.slider: {
                const { value, min, max } = quiz as SliderQuiz
                return (
                    <SliderView
                        title={title}
                        slider={{ value, min, max }}
                        buttonProps={buttonProps}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
        }
    }

    return (
        <ThemeProvider mode="light">
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{
                    width: '100%',
                    minHeight: '100%',
                    p: 1,
                    backgroundColor,
                }}
            >
                <ImageUploader
                    bgImage={backgroundImage}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        mt: `0 !important`,
                    }}
                    onUploaded={(backgroundImage) => {
                        handleUpdateQuiz({
                            backgroundImage,
                        })
                    }}
                    hideButton
                />

                <ImageUploader
                    bgImage={image}
                    sx={{ width: 'auto', height: '16vh', mt: `0 !important` }}
                    onUploaded={(image) => {
                        handleUpdateQuiz({
                            image,
                        })
                    }}
                    hideButton={Boolean(image)}
                />

                {renderQuiz()}
            </Stack>
        </ThemeProvider>
    )
}
