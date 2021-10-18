import * as React from 'react'
import _ from 'lodash'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs, { TabsProps } from '@mui/material/Tabs'
import Tab, { TabProps } from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Editor from 'components/Editor'
import Dev from 'components/Dev'

const Grow = styled('div')({
    flexGrow: 1,
})

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.common.white,
    },
}))

const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
    '&.Mui-selected': {
        color: theme.palette.common.white,
    },
}))

export default function App() {
    const paths = {
        editor: { value: 'editor', path: '/editor', label: '編輯' },
        analysis: { value: 'analysis', path: '/analysis', label: '報告' },
        dev: { value: 'dev', path: '/dev', label: '開發' },
    }

    const history = useHistory()

    const [currentPath, setPath] = React.useState(paths.editor.value)

    const handleChangePath = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setPath(newValue)
        history.push(newValue)
    }

    React.useEffect(() => {}, [])

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        超市調
                    </Typography>
                    <Grow />
                    <StyledTabs
                        value={currentPath}
                        onChange={handleChangePath}
                        centered
                    >
                        {_.map(paths, ({ label, value }) => (
                            <StyledTab
                                key={value}
                                label={label}
                                value={value}
                            />
                        ))}
                    </StyledTabs>
                    <Grow />
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <>
                <Switch>
                    <Route path={paths.editor.path}>
                        <Editor />
                    </Route>

                    <Route path={paths.dev.path}>
                        <Dev />
                    </Route>

                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to={paths.editor.path} />}
                    />
                </Switch>
            </>
        </>
    )
}
