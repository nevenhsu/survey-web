export enum Mode {
    persona = 'persona',
    product = 'product',
}

export enum EditorStep {
    pick = 'pick',
    product = 'product',
    quiz = 'quiz',
    result = 'result',
    final = 'final',
    launch = 'launch',
}

export enum QuizMode {
    page = 'page',
    fill = 'fill',
    selection = 'selection',
    sort = 'sort',
    slider = 'slider',
}

export type Quiz = {
    id: string
    mode: QuizMode
    title: string
    required?: boolean
    backgroundColor?: string
    backgroundImage?: string
}

export type CustomButton = {
    buttonText?: string
    buttonTextColor?: string
    buttonColor?: string
    buttonVariant?: 'contained' | 'outlined' | 'text'
}

export type PageQuiz = Quiz & CustomButton

export type ChoiceType = CustomButton & {
    id: string
    label: string
    tags: string[]
    image?: string
}

export type SelectionType = {
    choices: ChoiceType[]
    values: string[]
    maxChoices: number
    showLabel: boolean
    showImage: boolean
    direction?: 'row' | 'column'
}

export type SelectionQuiz = Quiz & SelectionType

export type SliderType = {
    max?: number
    min?: number
    value?: number
}

export type SliderQuiz = Quiz & SliderType

export type FillQuiz = Quiz & {
    value: string
}

export type QuizType = Quiz | SelectionQuiz | SliderQuiz | FillQuiz | PageQuiz

export type Tags = {
    [k: string]: {
        id: string
        name: string
        values: string[]
    }
}

export type Form = {
    id: string
    createdAt: number
    updatedAt: number
    mode: Mode
    quizzes: QuizType[]
    tags: Tags
}
