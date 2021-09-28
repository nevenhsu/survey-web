import { useLocation, useHistory } from 'react-router-dom'

export function useQuery<
    T extends string,
    U = { [K in T]: string | undefined }
>(names: T[]) {
    const query = {} as U

    const history = useHistory()
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)

    names.forEach((el) => {
        if (el) {
            const value = searchParams.get(el) ?? undefined
            ;(query as any)[el] = value
        }
    })

    function updateQuery(value: Record<string, string>) {
        history.push({
            ...location,
            search: '?' + new URLSearchParams(value).toString(),
        })
    }

    return [query, updateQuery] as const
}
