import * as React from 'react'
import { useAppDispatch } from 'hooks'
import { updateQuiz } from 'store/slices/editor'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import { QuizMode } from 'types/customTypes'
import type { QuizType, CustomButton, TransitionQuiz } from 'types/customTypes'

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

const Cover = (props: StyledTextFieldProps) => {
    return (
        <Grid item>
            <StyledTextField
                variant="standard"
                placeholder="請輸入您的文字"
                {...props}
            />
        </Grid>
    )
}

const Transition = (props: {
    textFieldProps: StyledTextFieldProps
    buttonProps: CustomButton
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    const variants = [
        { value: 'contained', label: '填滿' },
        { value: 'outlined', label: '線框' },
        { value: 'text', label: '文字' },
    ]

    const { textFieldProps, buttonProps: transitionProps, onChange } = props
    const {
        buttonVariant = 'contained',
        buttonText = '下一題',
        buttonColor = '',
        buttonTextColor = '',
    } = transitionProps

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

export default function EditingQuiz(props: EditingQuizProps) {
    const { formId, quiz } = props
    const dispatch = useAppDispatch()

    const handleUpdateQuiz = (newValue: Partial<QuizType>) => {
        if (formId && quiz) {
            dispatch(
                updateQuiz({
                    id: formId,
                    newValue,
                    predicate: (el) => el.id === quiz.id,
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
            case QuizMode.cover: {
                return (
                    <Cover
                        value={title}
                        onChange={(event) =>
                            handleUpdateQuiz({
                                title: event.target.value,
                            })
                        }
                    />
                )
            }
            case QuizMode.transition: {
                const {
                    buttonColor,
                    buttonText,
                    buttonTextColor,
                    buttonVariant,
                } = quiz as TransitionQuiz
                return (
                    <Transition
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
