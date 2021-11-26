import { BehaviorName, QuizMode } from 'common/types'
import type {
    ConversionRatioData,
    ProductCtrData,
    NumeralData,
    OptionType,
    ListData,
    TooltipData,
    QuizData,
} from 'common/types'
import { treeData } from 'assets/data/tree'

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
        deviceTraffic: Array<NumeralData>
        trafficSource: Array<NumeralData>
        flowAnalysis: Array<{
            name: string
            mobile: number
            desktop: number
        }>
    }
    quizStatus: {
        bounceRate: Array<NumeralData>
        dwellTime: Array<NumeralData>
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
                    name: '轉換率',
                    format: '0.0%',
                    value: 0.833,
                },
                {
                    name: '完成率',
                    format: '0.0%',
                    value: 0.72,
                },
            ],
            right: [
                {
                    name: '瀏覽數',
                    format: '0,0',
                    value: 3000,
                },
                {
                    name: '開始測驗數',
                    format: '0,0',
                    value: 2500,
                },
                {
                    name: '完成測驗數',
                    format: '0,0',
                    value: 1800,
                },
                {
                    name: '平均答題時間',
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
                    name: '分享',
                    format: '0.0%',
                    value: 0.093,
                },
                {
                    name: '抽獎',
                    format: '0.0%',
                    value: 0.88,
                },
            ],
            right: [
                {
                    name: '瀏覽數',
                    format: '0,0',
                    value: 3000,
                },
                {
                    name: '開始測驗數',
                    format: '0,0',
                    value: 2500,
                },
                {
                    name: '完成測驗數',
                    format: '0,0',
                    value: 1800,
                },
                {
                    name: '平均答題時間',
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
                ctr: 2400 / 4000,
            },
            {
                name: 'Book B',
                views: 3000,
                hits: 1398,
                ctr: 1398 / 3000,
            },
            {
                name: 'Book C',
                views: 9800,
                hits: 2000,
                ctr: 2000 / 9800,
            },
            {
                name: 'Book D',
                views: 3908,
                hits: 2780,
                ctr: 2780 / 3908,
            },
            {
                name: 'Book E',
                views: 4800,
                hits: 1890,
                ctr: 1890 / 4800,
            },
            {
                name: 'Book F',
                views: 3800,
                hits: 2390,
                ctr: 2390 / 3800,
            },
            {
                name: 'Book G',
                views: 4300,
                hits: 3490,
                ctr: 3490 / 4300,
            },
        ],
    },
    flow: {
        deviceTraffic: [
            { name: '手機', value: 300 },
            { name: '電腦', value: 2700 },
        ],
        trafficSource: [
            { name: 'facebook', value: 2000 },
            { name: 'line', value: 1000 },
        ],
        flowAnalysis: [
            { name: 'facebook', mobile: 200, desktop: 1800 },
            { name: 'line', mobile: 100, desktop: 900 },
        ],
    },
    quizStatus: {
        bounceRate: [
            { name: 'quiz 1', value: 0.042 },
            { name: 'quiz 2', value: 0.037 },
            { name: 'quiz 3', value: 0.146 },
            { name: 'quiz 4', value: 0.233 },
            { name: 'quiz 5', value: 0.086 },
            { name: 'quiz 6', value: 0.093 },
            { name: 'quiz 7', value: 0.012 },
            { name: 'quiz 8', value: 0.343 },
        ],
        dwellTime: [
            { name: 'quiz 1', value: 4340 / 1000 },
            { name: 'quiz 2', value: 3942 / 1000 },
            { name: 'quiz 3', value: 4952 / 1000 },
            { name: 'quiz 4', value: 4921 / 1000 },
            { name: 'quiz 5', value: 19394 / 1000 },
            { name: 'quiz 6', value: 2039 / 1000 },
            { name: 'quiz 7', value: 3910 / 1000 },
            { name: 'quiz 8', value: 13910 / 1000 },
        ],
    },
}

export const BehaviorStages: Array<OptionType> = [{ label: '', value: '' }]

const tooltipData: TooltipData = {
    text: '策略依據文字說明策略依據文字說明策略依據文字說明',
    payload: [
        {
            name: '這個',
            value: 1000,
            format: '0,0',
        },
        {
            name: '那個',
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

export const quizzesData: Array<QuizData> = [
    {
        id: 'deu3a1',
        mode: QuizMode.oneInTwo,
        title: '這兩個標語哪個比較吸引妳？',
        data: [
            treeData,
            [
                { name: 'Reciprocity', value: 480 },
                { name: 'Authority', value: 300 },
                { name: 'Rarity', value: 320 },
                { name: 'Commitment', value: 200 },
                { name: 'Preference', value: 150 },
                { name: 'Identity', value: 150 },
            ],
        ],
    },
    {
        id: 'eifq19',
        mode: QuizMode.dragger,
        title: '把垃圾丟進對的類別裡！',
        data: [
            [
                { name: '0分', value: 35 },
                { name: '1分', value: 84 },
                { name: '2分', value: 93 },
                { name: '3分', value: 128 },
                { name: '4分', value: 281 },
                { name: '5分', value: 83 },
                { name: '6分', value: 48 },
                { name: '7分', value: 34 },
            ],
            [
                { name: '寶特瓶瓶蓋', true: 480, false: 120 },
                { name: '橡皮擦的尾巴', true: 300, false: 300 },
                { name: '紅寶石戒指', true: 320, false: 280 },
                { name: '吸管的轉彎處', true: 200, false: 400 },
                { name: '咖啡杯的瓦愣紙套', true: 150, false: 450 },
                { name: '拖把的柄', true: 120, false: 480 },
                { name: '橡皮筋', true: 220, false: 380 },
            ],
        ],
    },
    {
        id: 'ewe2dw',
        mode: QuizMode.selection,
        title: '勾選你喜愛的電影類型',
        data: [
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
        ],
    },
    {
        id: 'ej3w2s',
        mode: QuizMode.sort,
        title: '挑選書籍的喜好排名',
        data: [
            { name: '投資理財', first: 400, second: 230, third: 320 },
            { name: '藝術設計', first: 3394, second: 281, third: 481 },
            { name: '人文社科', first: 201, second: 3940, third: 1832 },
            { name: '心理勵志', first: 3802, second: 8402, third: 1830 },
            { name: '哲學', first: 3920, second: 1833, third: 1938 },
            { name: '雜誌', first: 1380, second: 1302, third: 394 },
            { name: '文學', first: 2840, second: 840, third: 10 },
        ],
    },
    {
        id: 'fpv02a',
        mode: QuizMode.slider,
        title: '週末平均消費多少？',
        data: [
            { name: '0', value: 35 },
            { name: '100', value: 492 },
            { name: '200', value: 3958 },
            { name: '300', value: 3391 },
            { name: '400', value: 3905 },
            { name: '500', value: 9053 },
            { name: '600', value: 4293 },
            { name: '700', value: 4914 },
            { name: '800', value: 2342 },
            { name: '900', value: 1344 },
            { name: '1000', value: 942 },
        ],
    },
    {
        id: 'f9vm3x',
        mode: QuizMode.fill,
        title: '評論哈利波特對年輕世代的影響',
        data: treeData,
    },
]
