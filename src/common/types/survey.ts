import type { Variant } from '@mui/material/styles/createTypography'
import type { GridSize } from '@mui/material/Grid'

export type Survey = {
    id: string
    createdAt: number
    updatedAt: number
    mode: Mode
    quizzes: QuizType[]
    tags: { [id: string]: Tags }
    results: Results
    setting: Setting
    final: Final
    trackingId: string[]
    enable: boolean
}

export enum Mode {
    oneInTwo = 'oneInTwo',
    dragger = 'dragger',
}

export type Answer = {
    id: string
    answers: { [quizId: string]: AnswerValue }
    surveyId?: string
    createdAt?: number
    updatedAt?: number
    resultId?: string
    final?: FinalInfo
}

export type AnswerValue = {
    quizId: string
    value?: string | number
    values?: string[]
    dwellTime?: number // ms
}

export type Final = {
    mode: FinalMode
    components: Component[]
    data: FinalInfo
    bgcolor?: string
}

export type FinalInfo = {
    name?: string
    gender?: string
    birthday?: string // ISO String
    mobile?: string
    email?: string
}

export enum SurveyStep {
    start = 'start',
    create = 'create',
    quiz = 'quiz',
    result = 'result',
    final = 'final',
    launch = 'launch',
}

export enum AnswerStep {
    quiz = 'quiz',
    result = 'result',
    final = 'final',
}

export enum QuizMode {
    page = 'page',
    fill = 'fill',
    selection = 'selection',
    sort = 'sort',
    slider = 'slider',
    oneInTwo = 'oneInTwo',
    dragger = 'dragger',
}

export type CustomButtonType = {
    buttonText?: string
    buttonTextColor?: string
    buttonColor?: string
    buttonVariant?: 'contained' | 'outlined' | 'text'
}

export type Quiz = CustomButtonType & {
    id: string
    mode: QuizMode
    title: string
    required?: boolean
    backgroundColor?: string
    backgroundImage?: string
    image?: string
    imageWidth?: number | string
    imageHeight?: number | string
}

export type ChoiceType = {
    id: string
    label: string
    tags: { [tagId: string]: string[] }
    image?: string
    next?: string
    buttonColor?: string
    backgroundColor?: string
}

export type SelectionType = {
    choices: ChoiceType[]
    values: string[]
    tagsId: string[]
    maxChoices: number
    showImage: boolean
    responsive: Responsive
    px: Padding
}

export type SelectionQuiz = Quiz & SelectionType

export type OneInTwoType = {
    choices: ChoiceType[]
    values: string[] // choice id
    tagsId: string[]
    showImage: boolean
    responsive: Responsive
    px: Padding
}

export type OneInTwoQuiz = Quiz & OneInTwoType

export type DraggerButton = CustomButtonType & {
    id: string
}

export type DraggerChoiceType = {
    id: string
    label: string
    answer: string // DraggerButton id
    image?: string
    bgcolor?: string
}

export type DraggerType = {
    choices: DraggerChoiceType[]
    values: string[] // right choice id
    left: DraggerButton
    right: DraggerButton
    showImage: boolean
    countDown?: number
}

export type DraggerQuiz = Quiz & DraggerType

export type SliderType = {
    max?: number
    min?: number
    value?: number
}

export type SliderQuiz = Quiz & SliderType

export type FillQuiz = Quiz & {
    value: string
}

export type QuizType =
    | Quiz
    | SelectionQuiz
    | SliderQuiz
    | FillQuiz
    | OneInTwoQuiz
    | DraggerQuiz

export type Tags = {
    id: string
    label: string
    values: string[]
    color: string
}

export enum ComponentType {
    title = 'title',
    typography = 'typography',
    clipboard = 'clipboard',
    image = 'image',
    link = 'link',
    card = 'card',
}

export type Component = {
    id: string
    type: ComponentType
    value?: string
    link?: string
    underline?: 'always' | 'hover' | 'none'
    display?: 'block' | 'inline-block'
    align?: 'left' | 'center' | 'right' | 'justify'
    typoVariant?: Variant
    fontWeight?: string
    width?: number | string
    height?: number | string
    color?: string
    bgcolor?: string
    buttonColor?: string
    components?: Component[]
}

export type Result = {
    id: string
    title?: string
    tags: { [tagId: string]: string[] }
    range: number[]
    components: Component[]
    bgcolor?: string
}

export type ResultList = { [id: string]: Result }

export type Results = {
    selectedTags: [string?, string?]
    list: ResultList
}

export type Setting = {
    showProgress: boolean
}

export enum FinalMode {
    info = 'info',
}

export type DeviceType = 'mobile' | 'laptop' | 'desktop'

export type Responsive = {
    xs: GridSize
    sm: GridSize
    lg: GridSize
}

export type Padding = {
    xs: number
    sm: number
    lg: number
}
