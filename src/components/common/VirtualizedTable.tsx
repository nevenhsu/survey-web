import * as React from 'react'
import _ from 'lodash'
import clsx from 'clsx'
import {
    AutoSizer,
    Column,
    Table,
    TableCellRenderer,
    TableHeaderProps,
    TableCellProps,
} from 'react-virtualized'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import TableCell, {
    TableCellProps as MuiTableCellProps,
} from '@mui/material/TableCell'
import Paper, { PaperProps } from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { setClasses } from 'utils/helper'

export type ColumnData = {
    dataKey: string
    label: string
    width: number
    numeric?: boolean
}

type Row = {
    index: number
}

type RenderCellProps = {
    columnData: ColumnData
    cellData: any
}

export type RenderCell = (props: RenderCellProps) => React.ReactNode

type VirtualizedTableProps<T> = {
    columns: readonly ColumnData[]
    rowCount: number
    rowGetter: (row: Row) => T
    onRowClick?: () => void
    rowHeight?: number
    headerHeight?: number
    paperProps?: PaperProps
    renderCell?: RenderCell
    setHeaderProps?: (props: TableHeaderProps) => MuiTableCellProps
    setCellProps?: (props: TableCellProps) => MuiTableCellProps
}

export const classes = setClasses('VirtualizedTable', [
    'root',
    'table',
    'tableRow',
    'flexContainer',
    'tableRowHover',
    'tableCell',
    'noClick',
])

const Root = styled(Paper)(({ theme }) => ({
    [`&.${classes.root}`]: {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 480,
        overflowX: 'auto',
    },
    [`& .${classes.flexContainer}`]: {
        display: 'flex',
        boxSizing: 'border-box',
    },
    [`& .${classes.table}`]: {},
    '& .ReactVirtualized__Table__headerRow': {
        ...(theme.direction === 'rtl' && {
            paddingLeft: '0 !important',
        }),
        ...(theme.direction !== 'rtl' && {
            paddingRight: undefined,
        }),
    },
    [`& .${classes.tableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${classes.tableRowHover}`]: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    [`& .${classes.tableCell}`]: {
        flex: 1,
        overflow: 'auto',
    },
    [`& .${classes.noClick}`]: {
        cursor: 'initial',
    },
}))

export default function VirtualizedTable<T>(props: VirtualizedTableProps<T>) {
    const {
        rowGetter,
        onRowClick,
        rowCount,
        columns = [],
        headerHeight = 56,
        rowHeight = 96,
        paperProps,
        renderCell,
        setHeaderProps,
        setCellProps,
        ...tableProps
    } = props

    const getRowClassName = ({ index }: Row) => {
        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && Boolean(onRowClick),
        })
    }

    const cellRenderer: TableCellRenderer = (data) => {
        const { cellData, columnIndex } = data
        const columnData = _.get(columns, [columnIndex])
        const { width, numeric = false } = columnData ?? {}
        const align = numeric ? 'right' : 'left'
        const alignItems = !numeric ? 'start' : 'end'

        const cellProps = _.isFunction(setCellProps) ? setCellProps(data) : {}
        const { sx, className, ...rest } = cellProps

        return (
            <TableCell
                {...rest}
                component="div"
                variant="body"
                className={clsx(
                    classes.tableCell,
                    classes.flexContainer,
                    className,
                    {
                        [classes.noClick]: !Boolean(onRowClick),
                    }
                )}
                sx={{
                    width,
                    height: rowHeight,
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems,
                    ...sx,
                }}
                align={align}
            >
                {_.isFunction(renderCell)
                    ? renderCell({ columnData, cellData })
                    : cellData}
            </TableCell>
        )
    }

    const headerRenderer = (
        data: TableHeaderProps & { columnIndex: number }
    ) => {
        const { columnIndex, label } = data
        const columnData = _.get(columns, [columnIndex])
        const { width, numeric = false } = columnData ?? {}

        const cellProps = _.isFunction(setHeaderProps)
            ? setHeaderProps(data)
            : {}
        const { sx, className, ...rest } = cellProps

        return (
            <Tooltip title={`${label || ''}`} placement="top">
                <TableCell
                    {...rest}
                    component="div"
                    variant="head"
                    className={clsx(
                        classes.tableCell,
                        classes.flexContainer,
                        classes.noClick,
                        className
                    )}
                    sx={(theme) => ({
                        backgroundColor: theme.palette.grey[100],
                        color: theme.palette.primary.main,
                        width,
                        height: headerHeight,
                        ...sx,
                    })}
                    align={numeric ? 'right' : 'left'}
                >
                    <Typography variant="body2" noWrap>
                        {label}
                    </Typography>
                </TableCell>
            </Tooltip>
        )
    }

    return (
        <Root className={classes.root} {...paperProps}>
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        {...tableProps}
                        height={height}
                        width={_.sumBy(columns, 'width')}
                        rowCount={rowCount}
                        rowGetter={rowGetter}
                        onRowClick={onRowClick}
                        rowHeight={rowHeight}
                        gridStyle={{
                            direction: 'inherit',
                        }}
                        headerHeight={headerHeight!}
                        className={classes.table}
                        rowClassName={getRowClassName}
                    >
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={(headerProps) =>
                                        headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            )
                        })}
                    </Table>
                )}
            </AutoSizer>
        </Root>
    )
}
