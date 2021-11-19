import _ from 'lodash'
import Storage from './storage'
import { parseJson } from 'utils/helper'
import { Survey } from 'common/types'

enum Locals {
    SURVEYS_ID = 'surveys_id',
    CURRENT_ID = 'current_id',
}

export default class Surveys extends Storage<string> {
    private static instance?: Surveys

    private constructor() {
        super()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Surveys()
        }

        return this.instance
    }

    public getSurveysId() {
        const str = this.get(Locals.SURVEYS_ID) ?? ''
        return parseJson<string[]>(str, [])
    }

    public setSurveyId(id: string) {
        const ids = this.getSurveysId()
        const val = JSON.stringify(
            _.uniq([...ids, id]).filter((el) => !_.isEmpty(el))
        )
        this.set(Locals.SURVEYS_ID, val)
    }

    public getCurrentId() {
        return this.get(Locals.CURRENT_ID)
    }

    public setCurrentId(id: string) {
        this.set(Locals.CURRENT_ID, id)
        this.setSurveyId(id)
    }

    public getSurveyById(id: string) {
        const str = this.get(id) ?? ''
        return parseJson(str, {}) as Survey
    }

    public setSurveyById(id: string, value: Survey) {
        if (_.isPlainObject(value)) {
            const val = JSON.stringify(value)
            this.set(id, val)
        }
    }

    public clear() {
        const ids = this.getSurveysId()
        this.clearItems(ids)
        this.set(Locals.SURVEYS_ID, '')
        this.setCurrentId('')
    }
}
