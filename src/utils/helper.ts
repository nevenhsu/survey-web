import _ from 'lodash'

export function setClasses<T extends string, U = { [K in T]: string }>(
    prefix: string,
    names: T[]
): U {
    const arr = <const>[...names]
    const values = names.map((el) => `${prefix}-${el}`)
    return _.zipObject(arr, values) as unknown as U
}
