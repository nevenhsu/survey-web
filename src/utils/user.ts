import Storage from './storage'
import { parseJson } from 'utils/helper'
import type { EditorStep, Mode } from 'types/customTypes'

enum Locals {
    USER = 'user',
}

type UserType = {
    step?: EditorStep
    mode?: Mode
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
