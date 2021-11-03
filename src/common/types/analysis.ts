export enum AnalysisStep {
    behavior = 'behavior',
    result = 'result',
    quiz = 'quiz',
    answer = 'answer',
}

export enum BlockName {
    status = 'status',
    ctr = 'ctr',
    productCtr = 'productCtr',
    deviceTraffic = 'deviceTraffic',
    trafficSource = 'trafficSource',
    flowAnalysis = 'flowAnalysis',
    bounceRate = 'bounceRate',
    dwellTime = 'dwellTime',
}

export type Numeral = {
    label: string
    format: string
    value: number
}

export type Overview = {
    label: string
    name: BlockName
    left: Array<Numeral>
    right: Array<Numeral>
}

export type ProductData = {
    name: string
    views: number
    hits: number
}

export type BarData = {
    name: string
    number: number
}
