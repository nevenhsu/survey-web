import _ from 'lodash'
import Storage from './storage'
import { parseJson } from 'utils/helper'

const FORMS_ID = 'forms_id'

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
        const str = this.get(FORMS_ID) ?? ''
        return parseJson<string[]>(str, [])
    }

    public setFormsId(id: string) {
        const ids = this.getFormsId()
        const val = JSON.stringify(
            _.uniq([...ids, id]).filter((el) => !_.isEmpty(el))
        )
        this.set(FORMS_ID, val)
    }

    public getFormById(id: string) {
        const str = this.get(id) ?? ''
        return parseJson(str, {})
    }

    public setFormById(id: string, value: object) {
        if (_.isPlainObject(value)) {
            const val = JSON.stringify(value)
            this.set(id, val)
        }
    }

    public clear() {
        const ids = this.getFormsId()
        this.clearItems(ids)
        this.set(FORMS_ID, '')
    }
}
