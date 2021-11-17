export * from 'common/types/survey'
export * from 'common/types/analysis'

export type OnButtonClink = (event: React.MouseEvent<HTMLButtonElement>) => void
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void
export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none'
