import * as React from 'react'
import _ from 'lodash'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/editor'
import { styled } from '@mui/material/styles'
import NumberFormat from 'react-number-format'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import { setId } from 'utils/helper'
import { QuizMode } from 'types/customTypes'
import type {
    QuizType,
    CustomButton,
    PageQuiz,
    ChoiceType,
    SelectionType,
    SelectionQuiz,
    FillQuiz,
    SliderType,
    SliderQuiz,
} from 'types/customTypes'

const variants = [
    { value: 'contained', label: '填滿' },
    { value: 'outlined', label: '線框' },
    { value: 'text', label: '文字' },
]

type onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => void
type onButtonClink = (event: React.MouseEvent<HTMLButtonElement>) => void

type EditingQuizProps = {
    formId?: string
    quiz?: QuizType
}

type StyledTextFieldProps = TextFieldProps & { value: string }

const StyledTextField = styled(TextField)<StyledTextFieldProps>(
    ({ value, theme }) => ({
        '& input': {
            ...theme.typography.h6,
            textAlign: 'center',
            width: `${value?.length}ch`,
            minWidth: 180,
        },
    })
)

const PageQ = (props: {
    textFieldProps: StyledTextFieldProps
    buttonProps: CustomButton
    onChange: onInputChange
}) => {
    const { textFieldProps, buttonProps, onChange } = props
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
            <Grid item>
                <StyledTextField
                    variant="standard"
                    placeholder="請輸入您的文字"
                    name="title"
                    onChange={onChange}
                    {...textFieldProps}
                />
            </Grid>
            <Grid item>
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
            </Grid>
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
                        select
                        label="按鈕樣式"
                        value={buttonVariant}
                        name="buttonVariant"
                        variant="standard"
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        {variants.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

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

const Choice = (props: {
    value: ChoiceType
    onChange: onInputChange
    onDelete: onButtonClink
    showImage?: boolean
    showLabel?: boolean
}) => {
    const {
        value,
        onChange,
        onDelete,
        showLabel = true,
        showImage = false,
    } = props

    const {
        id,
        label = '',
        image = '',
        buttonVariant = 'contained',
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
                variant={buttonVariant}
                onClick={handleClick}
                sx={{
                    color: buttonTextColor,
                    backgroundColor: buttonColor,
                }}
            >
                {showLabel ? label || '選項' : ''}
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
                        select
                        label="選項樣式"
                        value={buttonVariant}
                        name="buttonVariant"
                        variant="standard"
                        onChange={onChange}
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        {variants.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

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

const SelectionQ = (props: {
    textFieldProps: StyledTextFieldProps
    selectionProps: SelectionType
    onChange: onInputChange
}) => {
    const { textFieldProps, selectionProps, onChange } = props
    const {
        choices = [],
        maxChoices,
        showLabel,
        showImage,
        direction,
    } = selectionProps

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
        const newChoice: ChoiceType = {
            id: setId(),
            label: '點擊編輯此選項',
            tags: [],
            image: '',
            buttonVariant: 'outlined',
            buttonColor: '',
            buttonTextColor: '',
        }
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
            <Grid item>
                <StyledTextField
                    variant="standard"
                    placeholder="請輸入您的文字"
                    name="title"
                    onChange={onChange}
                    {...textFieldProps}
                />
            </Grid>
            <Grid item sx={{ width: 4 / 5, textAlign: 'center' }}>
                <Grid
                    container
                    direction={direction}
                    alignItems="flex-start"
                    justifyContent="center"
                    spacing={2}
                    sx={{ ml: -1 }}
                >
                    {choices.map((el) => (
                        <Grid item xs={direction === 'row' ? 4 : 8}>
                            <Choice
                                value={el}
                                onChange={(event) =>
                                    handleChoiceChange(event, el.id)
                                }
                                onDelete={() => handleChoiceDelete(el.id)}
                                showLabel={showLabel}
                                showImage={showImage}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={direction === 'row' ? 4 : 8} sx={{}}>
                        <Button variant="outlined" onClick={handleAddChoice}>
                            新增選項
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const FillQ = (props: {
    title: string
    value: string
    onChange: onInputChange
}) => {
    const { title, value, onChange } = props

    return (
        <>
            <Grid item>
                <StyledTextField
                    variant="standard"
                    placeholder="請輸入測驗問題"
                    name="title"
                    value={title}
                    onChange={onChange}
                    sx={{ mb: 3 }}
                />
            </Grid>
            <Grid item>
                <TextField
                    label="自由填空"
                    variant="outlined"
                    name="value"
                    value={value}
                    onChange={onChange}
                    fullWidth
                />
            </Grid>
        </>
    )
}

const SliderQ = (props: {
    title: string
    slider: SliderType
    onChange: onInputChange
}) => {
    const { title, slider, onChange } = props
    const { max, min, value } = slider

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
            <Grid item>
                <StyledTextField
                    variant="standard"
                    placeholder="請輸入您的文字"
                    name="title"
                    value={title}
                    onChange={onChange}
                    sx={{ mb: 3 }}
                />
            </Grid>

            <Grid item sx={{ width: 4 / 5 }}>
                <Slider
                    defaultValue={_.floor(max ?? 0 / 2) ?? 0}
                    min={min}
                    max={max}
                    valueLabelDisplay="auto"
                />
            </Grid>

            <Grid item>
                <Button variant="outlined" onClick={handleClick}>
                    編輯數值
                </Button>
            </Grid>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 180 }}>
                    <NumberFormat
                        customInput={TextField}
                        variant="standard"
                        label="最小值"
                        value={min}
                        fullWidth
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'min',
                                },
                            }

                            onChange(event as any)
                        }}
                        sx={{ mb: 2 }}
                    />

                    <NumberFormat
                        customInput={TextField}
                        variant="standard"
                        label="最大值"
                        value={max}
                        fullWidth
                        onValueChange={({ value }) => {
                            const event = {
                                target: {
                                    value: Number(value),
                                    name: 'max',
                                },
                            }

                            onChange(event as any)
                        }}
                    />
                </Box>
            </Popover>
        </>
    )
}

export default function EditingQuiz(props: EditingQuizProps) {
    const { formId, quiz } = props
    const dispatch = useAppDispatch()

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (formId && quiz) {
            dispatch(
                updateQuiz({
                    formId,
                    quizId: quiz.id,
                    newValue,
                })
            )
        }
    }

    const renderQuiz = () => {
        if (!formId || !quiz) {
            return <div />
        }

        return renderView(quiz)
    }

    const renderView = (quiz: QuizType) => {
        const { mode, title } = quiz

        switch (mode) {
            case QuizMode.page: {
                const {
                    buttonColor,
                    buttonText,
                    buttonTextColor,
                    buttonVariant,
                } = quiz as PageQuiz
                return (
                    <PageQ
                        textFieldProps={{
                            value: title,
                        }}
                        buttonProps={{
                            buttonColor,
                            buttonText,
                            buttonTextColor,
                            buttonVariant,
                        }}
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
                    maxChoices = 4,
                    showLabel = true,
                    showImage = false,
                    direction,
                } = quiz as SelectionQuiz
                return (
                    <SelectionQ
                        textFieldProps={{
                            value: title,
                        }}
                        selectionProps={{
                            choices,
                            values,
                            maxChoices,
                            showLabel,
                            showImage,
                            direction,
                        }}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.fill: {
                const { title, value = '' } = quiz as FillQuiz
                return (
                    <FillQ
                        title={title}
                        value={value}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
            case QuizMode.slider: {
                const { title, value, min, max } = quiz as SliderQuiz
                return (
                    <SliderQ
                        title={title}
                        slider={{ value, min, max }}
                        onChange={(event) => {
                            handleUpdateQuiz({
                                [event.target.name]: event.target.value,
                            })
                        }}
                    />
                )
            }
        }

        return <div />
    }

    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                rowSpacing={2}
                sx={{ width: '100%', height: '100%' }}
            >
                {renderQuiz()}
            </Grid>
        </>
    )
}
