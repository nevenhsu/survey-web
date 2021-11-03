import { BlockName } from 'common/types'
import type { Overview, ProductData, BarData } from 'common/types'

type Data = {
    overviews: Array<Overview>
    productCtr: {
        ctr: number
        hits: number
        views: number
        data: Array<ProductData>
    }
    flow: {
        deviceTraffic: Array<BarData>
        trafficSource: Array<BarData>
        flowAnalysis: Array<{
            name: string
            mobile: number
            desktop: number
        }>
    }
    quizStatus: {
        bounceRate: Array<BarData>
        dwellTime: Array<BarData>
    }
}

const data: Data = {
    overviews: [
        {
            label: '答題狀況',
            name: BlockName.status,
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
            name: BlockName.ctr,
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

export default data

export const books = [
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
]
