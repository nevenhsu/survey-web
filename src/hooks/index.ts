import { useLocation, useHistory } from 'react-router-dom'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from 'store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

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
