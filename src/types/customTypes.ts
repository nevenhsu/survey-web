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
    cover = 'cover',
    fill = 'fill',
    selection = 'selection',
    sort = 'sort',
    slider = 'slider',
    transition = 'transition',
}

export type Quiz = {
    id: string
    mode: QuizMode
    title: string
    required?: boolean
    backgroundColor?: string
    backgroundImage?: string
}

export type Choice = {
    id: string
    label: string
    image?: string
}

export type SelectionQuiz = Quiz & {
    choices: Choice[]
    values: string[]
    maxChoices: number
    showLabel: boolean
    showImage: boolean
    align?: 'horizon' | 'vertical'
}

export type SliderQuiz = Quiz & {
    max: number
    min: number
    value: number
}

export type FillQuiz = Quiz & {
    value: string
}

export type QuizType = Quiz | SelectionQuiz | SliderQuiz | FillQuiz

export type Form = {
    id: string
    createdAt: number
    updatedAt: number
    mode: Mode
    quizzes: QuizType[]
}
