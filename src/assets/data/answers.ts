import _ from 'lodash'
import { Mode, ComponentType, FinalMode } from 'common/types'
import type { Survey, AnswerData } from 'common/types'

export const fakeAnswerData: AnswerData[] = _.fill(Array(200), {
    id: 'fake1',
    name: 'Catharine',
    gender: 'female',
    birthday: '1984-09-16T05:51:48+08:00',
    mobile: '384823721',
    email: 'Catharine.Freddi@yopmail.com',
    userId: '4928183',
    ip: '382-434-1244-334',
    createdAt: 1636263334801,
    updatedAt: 1636363334801,
    resultId: 'result-id-a',
    totalTime: 9545,
    averageTime: 2145,
    '82a6f6': ['2a448e', '6d1194'],
    '9cf1cb': ['ba81a3', '18f465'],
    f4b956: 'Generating random paragraphs can be an excellent way',
    dc504f: 50,
})

const quizzes = [
    {
        id: '5bd3b8',
        mode: 'page',
        required: false,
        title: {
            text: '閱讀，讓世界慢了下來，一起閱讀，改變世界。',
            variant: 'h6',
        },
        button: {
            text: '開始改變',
            variant: 'contained',
        },
    },
    {
        showImage: false,
        maxChoices: 2,
        choices: [
            {
                buttonVariant: 'outlined',
                id: 'b46899',
                image: '',
                label: '可以跨越時空跟有想法的人對話',
                tags: {
                    '2ba50f': ['werwer', 'werwerwer', 'sdfsdf'],
                    ae6968: ['swim', 'eewr'],
                    b00000: ['青少年', '兒童'],
                },
            },
            {
                id: '2a448e',
                image: '',
                label: '能吸收專家歸納的知識快速進化',
            },
            {
                id: '6d1194',
                image: '',
                label: '療癒身心、發自內心的情感共鳴',
            },
            {
                id: 'ec746d',
                image: '',
                label: '更了解自己、找到更適合的方向',
            },
            {
                id: '9ee9e9',
                image: '',
                label: '未命名選項',
            },
            {
                id: '7a6d45',
                image: '',
                label: '未命名選項',
            },
        ],
        id: '82a6f6',
        mode: 'selection',
        required: false,
        showLabel: 'true',
        tagsId: ['ae6968', 'b00000', '2ba50f'],
        title: {
            text: '你覺得「閱讀」對你而言有什麼吸引力？',
            variant: 'h6',
        },
        button: {
            text: '下一題',
            variant: 'contained',
        },
    },
    {
        id: '9cf1cb',
        mode: 'sort',
        required: false,
        showImage: false,
        maxChoices: 3,
        choices: [
            {
                id: 'ba81a3',
                image: '',
                label: '商業理財',
            },
            {
                id: '18f465',
                image: '',
                label: '人文社科',
            },
            {
                id: 'b697e5',
                image: '',
                label: '藝術設計',
            },
            {
                id: 'af30fb',
                image: '',
                label: '財經管理',
            },
        ],
        title: {
            text: '你最常閱讀以下哪幾種類型的書籍？（選你會讀的排序）',
            variant: 'h6',
        },
        button: {
            text: '下一題',
            variant: 'contained',
        },
    },
] as any

export const fakeSurveyData: Survey = {
    id: 'fake-survey-id',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    mode: Mode.oneInTwo,
    quizzes: quizzes,
    tags: {
        'fake-tag-1': {
            id: 'fake-tag-1',
            label: '標籤組A',
            values: ['AAA', 'BBB'],
            color: 'blue',
        },
        'fake-tag-2': {
            id: 'fake-tag-2',
            label: '標籤組B',
            values: ['111', '222'],
            color: 'green',
        },
    },
    results: {
        selectedTags: ['fake-tag-1', 'fake-tag-2'],
        list: {
            'result-id-a': {
                id: 'result-id-a',
                title: '結果A',
                tags: { 'fake-result-id': ['AAA'] },
                range: [],
                components: [
                    {
                        id: 'fake-a',
                        type: ComponentType.title,
                        value: '恭喜A',
                    },
                ],
            },
        },
        button: {},
    },
    setting: { showProgress: true, maxWidth: 800 },
    final: {
        mode: FinalMode.info,
        components: [],
        data: {},
        setting: { info: {} },
    },
    trackingId: ['facebook'],
    enable: true,
}
