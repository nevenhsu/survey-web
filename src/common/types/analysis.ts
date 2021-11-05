import { QuizMode } from 'common/types'

export enum AnalysisStep {
    behavior = 'behavior',
    result = 'result',
    quiz = 'quiz',
    answer = 'answer',
}

export enum BehaviorName {
    status = 'status',
    ctr = 'ctr',
    productCtr = 'productCtr',
    deviceTraffic = 'deviceTraffic',
    trafficSource = 'trafficSource',
    flowAnalysis = 'flowAnalysis',
    bounceRate = 'bounceRate',
    dwellTime = 'dwellTime',
}

export enum ResultName {
    consumerBehavior = 'consumerBehavior',
    strategyAdvice = 'strategyAdvice',
    customerAnalysis = 'customerAnalysis',
    correlationAnalysis = 'correlationAnalysis',
}

export enum BehaviorStage {
    knowledge = 'knowledge',
    research = 'research',
    evaluate = 'evaluate',
    decide = 'decide',
    purchase = 'purchase',
    postPurchase = 'postPurchase',
}

export enum BehaviorAnalysis {
    product = 'product',
    principle = 'principle',
    persona = 'persona',
}

export type NumeralData = {
    name: string
    value: number
    format: string
}

export type ConversionRatioData = {
    label: string
    name: BehaviorName
    left: Array<NumeralData>
    right: Array<NumeralData>
}

export type ProductCtrData = {
    name: string
    views: number
    hits: number
}

export type ChartData = {
    name: string
    value: number
}

export type OptionType = {
    label: string
    value: string
}

export type TooltipData = {
    text: string
    payload?: Array<NumeralData>
}

export type TextWithTip = {
    text: string
    tooltip: TooltipData
}

export type ListData = {
    text: string
    data: Array<TextWithTip>
}

export type TreeData = {
    name: string
    colorName?: string
    color?: string
    fill?: string
    value?: number
    valueFormat?: string // d3 format
    children?: Array<Omit<TreeData, 'valueFormat'>>
}

export type QuizData = {
    id: string
    mode: QuizMode
    title: string
    format?: string
    data: Array<ChartData>
}
