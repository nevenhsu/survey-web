import * as React from 'react'
import _ from 'lodash'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useAppDispatch } from 'store/hooks'
import { toggleMode } from 'store/slices/userDefault'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Tabs, { TabsProps } from '@mui/material/Tabs'
import Tab, { TabProps } from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Editor from 'components/Editor'

const Grow = styled('div')({
    flexGrow: 1,
})

const StyledTabs = styled((props: TabsProps) => <Tabs {...props} />)(
    ({ theme }) => ({
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.common.white,
        },
    })
)

const StyledTab = styled((props: TabProps) => <Tab {...props} />)(
    ({ theme }) => ({
        '&.Mui-selected': {
            color: theme.palette.common.white,
        },
    })
)

export default function App() {
    const paths = {
        editor: { value: 'editor', path: '/editor', label: '編輯' },
        analysis: { value: 'analysis', path: '/analysis', label: '報告' },
    }
    const [currentPath, setPath] = React.useState(paths.editor.value)

    const dispatch = useAppDispatch()
    const handleToggle = () => {
        dispatch(toggleMode())
    }

    const handleChangePath = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setPath(newValue)
    }

    React.useEffect(() => {}, [])

    return (
        <Grid container sx={{ m: 0 }}>
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

                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to={paths.editor.path} />}
                    />
                </Switch>
            </>
        </Grid>
    )
}
