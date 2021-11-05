import { BehaviorName } from 'common/types'
import type {
    ConversionRatioData,
    ProductCtrData,
    ChartData,
    OptionType,
    ListData,
    TooltipData,
} from 'common/types'

export const insertReg = /#insert/g
const insertIdentifier = '#insert'

type BehaviorData = {
    overviews: Array<ConversionRatioData>
    productCtr: {
        ctr: number
        hits: number
        views: number
        data: Array<ProductCtrData>
    }
    flow: {
        deviceTraffic: Array<ChartData>
        trafficSource: Array<ChartData>
        flowAnalysis: Array<{
            name: string
            mobile: number
            desktop: number
        }>
    }
    quizStatus: {
        bounceRate: Array<ChartData>
        dwellTime: Array<ChartData>
    }
}

type OptionsData = {
    devices: Array<OptionType>
    sources: Array<OptionType>
}

export const optionsData: OptionsData = {
    devices: [
        { label: '手機', value: 'mobile' },
        { label: '筆電', value: 'laptop' },
        { label: '桌電', value: 'desktop' },
    ],
    sources: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'Line', value: 'line' },
    ],
}

export const behaviorData: BehaviorData = {
    overviews: [
        {
            label: '答題狀況',
            name: BehaviorName.status,
            left: [
                {
                    label: '轉換率',
                    format: '0.0%',
                    value: 0.833,
                },
                {
                    label: '完成率',
                    format: '0.0%',
                    value: 0.72,
                },
            ],
            right: [
                {
                    label: '瀏覽數',
                    format: '0,0',
                    value: 3000,
                },
                {
                    label: '開始測驗數',
                    format: '0,0',
                    value: 2500,
                },
                {
                    label: '完成測驗數',
                    format: '0,0',
                    value: 1800,
                },
                {
                    label: '平均答題時間',
                    format: '00:00:00',
                    value: 5780 / 1000,
                },
            ],
        },
        {
            label: '點擊率',
            name: BehaviorName.ctr,
            left: [
                {
                    label: '分享',
                    format: '0.0%',
                    value: 0.093,
                },
                {
                    label: '抽獎',
                    format: '0.0%',
                    value: 0.88,
                },
            ],
            right: [
                {
                    label: '瀏覽數',
                    format: '0,0',
                    value: 3000,
                },
                {
                    label: '開始測驗數',
                    format: '0,0',
                    value: 2500,
                },
                {
                    label: '完成測驗數',
                    format: '0,0',
                    value: 1800,
                },
                {
                    label: '平均答題時間',
                    format: '00:00:00',
                    value: 3400 / 1000,
                },
            ],
        },
    ],
    productCtr: {
        ctr: 0.654,
        hits: 12922,
        views: 39384,
        data: [
            {
                name: 'Book A',
                views: 4000,
                hits: 2400,
            },
            {
                name: 'Book B',
                views: 3000,
                hits: 1398,
            },
            {
                name: 'Book C',
                views: 9800,
                hits: 2000,
            },
            {
                name: 'Book D',
                hits: 2780,
                views: 3908,
            },
            {
                name: 'Book E',
                hits: 1890,
                views: 4800,
            },
            {
                name: 'Book F',
                hits: 2390,
                views: 3800,
            },
            {
                name: 'Book G',
                hits: 3490,
                views: 4300,
            },
        ],
    },
    flow: {
        deviceTraffic: [
            { name: 'mobile', number: 300 },
            { name: 'desktop', number: 2700 },
        ],
        trafficSource: [
            { name: 'facebook', number: 2000 },
            { name: 'line', number: 1000 },
        ],
        flowAnalysis: [
            { name: 'facebook', mobile: 200, desktop: 1800 },
            { name: 'line', mobile: 100, desktop: 900 },
        ],
    },
    quizStatus: {
        bounceRate: [
            { name: 'quiz 1', number: 0.042 },
            { name: 'quiz 2', number: 0.037 },
            { name: 'quiz 3', number: 0.146 },
            { name: 'quiz 4', number: 0.233 },
            { name: 'quiz 5', number: 0.086 },
            { name: 'quiz 6', number: 0.093 },
            { name: 'quiz 7', number: 0.012 },
            { name: 'quiz 8', number: 0.343 },
        ],
        dwellTime: [
            { name: 'quiz 1', number: 4340 / 1000 },
            { name: 'quiz 2', number: 3942 / 1000 },
            { name: 'quiz 3', number: 4952 / 1000 },
            { name: 'quiz 4', number: 4921 / 1000 },
            { name: 'quiz 5', number: 19394 / 1000 },
            { name: 'quiz 6', number: 2039 / 1000 },
            { name: 'quiz 7', number: 3910 / 1000 },
            { name: 'quiz 8', number: 13910 / 1000 },
        ],
    },
}

export const BehaviorStages: Array<OptionType> = [{ label: '', value: '' }]

const tooltipData: TooltipData = {
    text: '策略依據文字說明策略依據文字說明策略依據文字說明',
    payload: [
        {
            label: '這個',
            value: 1000,
            format: '0,0',
        },
        {
            label: '那個',
            value: 500,
            format: '0,0',
        },
    ],
}

export const strategyData: Array<ListData> = [
    {
        text: `您的顧客同時${insertIdentifier}、${insertIdentifier}`,
        data: [
            {
                text: '價格',
                tooltip: tooltipData,
            },
            {
                text: '品質',
                tooltip: tooltipData,
            },
        ],
    },
    {
        text: `您的客群${insertIdentifier}，可以${insertIdentifier}`,
        data: [
            {
                text: '很聽朋友的話',
                tooltip: tooltipData,
            },
            {
                text: '多加設計行銷機制讓消費者分享他們的商品',
                tooltip: tooltipData,
            },
        ],
    },
    {
        text: `您的客群${insertIdentifier}，可以${insertIdentifier}`,
        data: [
            {
                text: '很聽朋友的話',
                tooltip: tooltipData,
            },
            {
                text: '多加設計行銷機制讓消費者分享他們的商品',
                tooltip: tooltipData,
            },
        ],
    },
    {
        text: `您可以善用${insertIdentifier}、${insertIdentifier}來行銷你的產品，讓他們${insertIdentifier}，${insertIdentifier}，也可以借助一些${insertIdentifier}，讓您的商品更有說服力！`,
        data: [
            {
                text: '朋友',
                tooltip: tooltipData,
            },
            {
                text: '網紅推薦',
                tooltip: tooltipData,
            },
            {
                text: '想要覺得自己有這個需求',
                tooltip: tooltipData,
            },
            {
                text: '因而非買到您的商品不可',
                tooltip: tooltipData,
            },
            {
                text: '專家的推薦',
                tooltip: tooltipData,
            },
        ],
    },
]

export const correlationData: Array<ListData> = [
    {
        text: `${insertIdentifier}，與${insertIdentifier}有正相關`,
        data: [
            {
                text: '會被網紅說服的人',
                tooltip: tooltipData,
            },
            {
                text: '會使用站內收藏功能的人',
                tooltip: tooltipData,
            },
        ],
    },
    {
        text: `${insertIdentifier}，與${insertIdentifier}有正相關`,
        data: [
            {
                text: '信任權威的人',
                tooltip: tooltipData,
            },
            {
                text: '「商業理財、生活風格」類型的書籍',
                tooltip: tooltipData,
            },
        ],
    },
    {
        text: `${insertIdentifier}，與${insertIdentifier}呈現負相關`,
        data: [
            {
                text: '注重承諾的人',
                tooltip: tooltipData,
            },
            {
                text: '價格',
                tooltip: tooltipData,
            },
        ],
    },
]
