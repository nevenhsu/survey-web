import type { Variant } from '@mui/material/styles/createTypography'

export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void

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

export enum SurveyStep {
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
}

export type CustomButton = {
    buttonText?: string
    buttonTextColor?: string
    buttonColor?: string
    buttonVariant?: 'contained' | 'outlined' | 'text'
}

export type Quiz = CustomButton & {
    id: string
    mode: QuizMode
    title: string
    required?: boolean
    image?: string
    backgroundColor?: string
    backgroundImage?: string
}

export type ChoiceType = Omit<CustomButton, 'buttonText'> & {
    id: string
    label: string
    tags: { [tagId: string]: string[] }
    image?: string
    next?: string
}

export type SelectionType = {
    choices: ChoiceType[]
    values: string[]
    tagsId: string[]
    maxChoices: number
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

export type QuizType = Quiz | SelectionQuiz | SliderQuiz | FillQuiz

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
    components: Component[]
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

export type FinalInfo = {
    name: string
}

export type Final = {
    mode: FinalMode
    components: Component[]
}

export type Form = {
    id: string
    createdAt: number
    updatedAt: number
    mode: Mode
    quizzes: QuizType[]
    tags: { [id: string]: Tags }
    results: Results
    setting: Setting
    final: Final
}

export type Answers = Array<{
    quizId: string
    value: string | string[]
}>

export type Survey = {
    id: string
    createdAt: number
    answers: Answers
    resultId: string
    final: FinalInfo
}

export type DeviceType = 'mobile' | 'laptop' | 'desktop'
