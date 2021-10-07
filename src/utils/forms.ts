import _ from 'lodash'
import Storage from './storage'
import { parseJson } from 'utils/helper'
import { Form } from 'common/types'

enum Locals {
    FORMS_ID = 'forms_id',
    CURRENT_ID = 'current_id',
}

export default class Forms extends Storage<string> {
    private static instance?: Forms

    private constructor() {
        super()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Forms()
        }

        return this.instance
    }

    public getFormsId() {
        const str = this.get(Locals.FORMS_ID) ?? ''
        return parseJson<string[]>(str, [])
    }

    public setFormsId(id: string) {
        const ids = this.getFormsId()
        const val = JSON.stringify(
            _.uniq([...ids, id]).filter((el) => !_.isEmpty(el))
        )
        this.set(Locals.FORMS_ID, val)
    }

    public getCurrentId() {
        return this.get(Locals.CURRENT_ID)
    }

    public setCurrentId(id: string) {
        this.set(Locals.CURRENT_ID, id)
    }

    public getFormById(id: string) {
        const str = this.get(id) ?? ''
        return parseJson(str, {}) as Form
    }

    public setFormById(id: string, value: Form) {
        if (_.isPlainObject(value)) {
            const val = JSON.stringify(value)
            this.set(id, val)
        }
    }

    public clear() {
        const ids = this.getFormsId()
        this.clearItems(ids)
        this.set(Locals.FORMS_ID, '')
        this.setCurrentId('')
    }
}
