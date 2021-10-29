import Storage from './storage'
import { parseJson } from 'utils/helper'
import type { SurveyStep, Mode } from 'common/types'

enum Locals {
    USER = 'user',
}

type UserType = {
    step?: SurveyStep
    mode?: Mode
    components?: object
}

export default class User extends Storage<Locals> {
    private static instance?: User

    private constructor() {
        super()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new User()
        }

        return this.instance
    }

    public getValue(): UserType {
        const val = this.get(Locals.USER) ?? ''
        return parseJson<UserType>(val, {})
    }

    public setValue(value: UserType) {
        const oldValue = this.getValue()
        const newValue = { ...oldValue, ...value }
        this.set(Locals.USER, JSON.stringify(newValue))
    }

    public clear() {
        this.clearItem(Locals.USER)
    }
}
