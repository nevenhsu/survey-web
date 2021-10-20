import type { Tags } from 'common/types'

export const personaTags: Tags[] = [
    {
        id: 'a00000',
        label: '年齡',
        values: ['10y', '20y', '30y'],
        color: 'amber',
    },
    {
        id: 'b00000',
        label: '人生階段',
        values: ['兒童', '青少年', '成年', '老年'],
        color: 'lime',
    },
    {
        id: 'c00000',
        label: '性別',
        values: ['男', '女', '跨性別', '不限'],
        color: 'blue',
    },
    {
        id: 'd00000',
        label: '個性',
        values: ['外向', '內向', '開朗', '沈穩'],
        color: 'green',
    },
    {
        id: 'e00000',
        label: '職業',
        values: ['創業家', '上班族', '自由業', '待業'],
        color: 'yellow',
    },
    {
        id: 'f00000',
        label: '興趣',
        values: ['發呆', '冥想', '做夢'],
        color: 'orange',
    },
]

export const productTags: Tags[] = [
    {
        id: 'g00000',
        label: '使用目的',
        values: ['娛樂', '工具', '賺錢'],
        color: 'pink',
    },
    {
        id: 'h00000',
        label: '使用情境與場景',
        values: ['室內', '室外'],
        color: 'purple',
    },
    {
        id: 'i00000',
        label: '使用時機',
        values: ['早上', '晚上'],
        color: 'teal',
    },
]

export const defaultTags = [...personaTags, ...productTags]
