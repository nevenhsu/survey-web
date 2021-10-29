import * as React from 'react'
import _ from 'lodash'
import {
    Route,
    Switch,
    Redirect,
    useHistory,
    useRouteMatch,
} from 'react-router-dom'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const Survey = React.lazy(() => import('components/Survey'))
const Answer = React.lazy(() => import('components/Answer'))

const Grow = styled('div')({
    flexGrow: 1,
})

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.common.white,
    },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        color: theme.palette.common.white,
    },
}))

export default function App() {
    const paths = {
        survey: { value: 'survey', path: '/survey', label: '編輯' },
        analysis: { value: 'analysis', path: '/analysis', label: '報告' },
    }

    const history = useHistory()

    const matchSurvey = useRouteMatch('/survey/:id')

    const [currentPath, setPath] = React.useState(paths.survey.value)

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
            {!Boolean(matchSurvey) && (
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
            )}
            <React.Suspense fallback={<div />}>
                <Switch>
                    <Route path="/survey/:id">
                        <Answer />
                    </Route>

                    <Route path={paths.survey.path}>
                        <Survey />
                    </Route>

                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to={paths.survey.path} />}
                    />
                </Switch>
            </React.Suspense>
        </>
    )
}
