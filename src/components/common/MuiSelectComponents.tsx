import * as React from 'react'
import {
    components,
    GroupBase,
    ClearIndicatorProps,
    DropdownIndicatorProps,
    IndicatorSeparatorProps,
    MenuListProps,
    MenuProps,
    OptionProps,
    StylesConfig,
} from 'react-select'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import CloseIcon from 'mdi-react/CloseIcon'
import ChevronDownIcon from 'mdi-react/ChevronDownIcon'
import type { Theme } from '@mui/material/styles'

export const ClearIndicator = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: ClearIndicatorProps<Option, IsMulti, Group>
) => {
    const {
        children = (
            <IconButton color="inherit" size="small" sx={{ p: 0.5 }}>
                <CloseIcon size={16} />
            </IconButton>
        ),
        getStyles,
        innerProps: { ref, ...restInnerProps },
    } = props

    const style = getStyles('clearIndicator', props) as React.CSSProperties

    return (
        <div {...restInnerProps} ref={ref} style={{ ...style, padding: 0 }}>
            {children}
        </div>
    )
}

const DropdownIndicator = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
    return (
        <components.ClearIndicator {...props}>
            <ChevronDownIcon size={16} />
        </components.ClearIndicator>
    )
}

const IndicatorSeparator = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>({
    innerProps,
}: IndicatorSeparatorProps<Option, IsMulti, Group>) => {
    return (
        <span
            {...innerProps}
            style={{ alignSelf: 'stretch', width: 1, margin: '8px 0 8px 4px' }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: (theme) => theme.palette.grey[600],
                }}
            />
        </span>
    )
}

const Menu = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: MenuProps<Option, IsMulti, Group>
) => {
    const { children, ...rest } = props
    return (
        <components.Menu<Option, IsMulti, Group> {...rest}>
            <Paper elevation={6}>{children}</Paper>
        </components.Menu>
    )
}

const MuiMenuList = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: MenuListProps<Option, IsMulti, Group>
) => {
    const { children, ...rest } = props
    return (
        <components.MenuList {...rest}>
            <MenuList>{children}</MenuList>
        </components.MenuList>
    )
}

const Option = <
    Option,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: OptionProps<Option, IsMulti, Group>
) => {
    const { children, ...rest } = props

    return (
        <components.Option {...rest}>
            <MenuItem selected={props.isSelected} disabled={props.isDisabled}>
                {children}
            </MenuItem>
        </components.Option>
    )
}

export const setStyles: (theme: Theme) => StylesConfig = (theme) => ({
    singleValue: (base) => ({ ...base, color: 'inherit' }),
    menu: (base) => ({ ...base, backgroundColor: 'transparent' }),
    option: (base) => ({
        ...base,
        ':active': { backgroundColor: 'unset' },
        backgroundColor: 'unset',
        padding: 0,
    }),
    control: (base) => {
        const focused = Boolean(base.boxShadow)

        return {
            ...base,
            minHeight: 36,
            borderRadius: 4,
            borderWidth: focused ? 2 : 1,
            borderColor: focused
                ? theme.palette.primary.main
                : 'rgba(255, 255, 255, 0.23)',
            boxShadow: '',
            ':hover': {
                borderColor: focused
                    ? theme.palette.primary.main
                    : 'rgba(255, 255, 255, 1)',
            },
        }
    },
    input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
    }),
})

export default {
    ClearIndicator,
    DropdownIndicator,
    IndicatorSeparator,
    Menu,
    MenuList: MuiMenuList,
    Option,
}
