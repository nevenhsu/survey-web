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
import ThemeProvider from 'theme/ThemeProvider'
import { useAppSelector } from 'hooks'
import { SurveyStep } from 'common/types'

const Survey = React.lazy(() => import('components/Survey'))
const Answer = React.lazy(() => import('components/Answer'))
const Analysis = React.lazy(() => import('components/Analysis'))

const Grow = styled('div')({
    flexGrow: 1,
})

const StyledTabs = styled(Tabs)(({ theme }) => ({
    overflow: 'unset',
    '& .MuiTabs-scroller': {
        overflow: 'unset !important',
    },
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.common.white,
        bottom: -6,
    },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
    '&.Mui-selected': {
        color: theme.palette.common.white,
    },
}))

export default function App() {
    const step = useAppSelector((state) => state.survey.step)
    const pathname = useAppSelector((state) => state.router.location.pathname)
    const paths = {
        survey: { path: '/survey', label: '編輯' },
        analysis: { path: '/analysis', label: '報告' },
    }

    const hideTab = pathname === '/survey' && step === SurveyStep.start

    const history = useHistory()

    const matchSurvey = useRouteMatch('/survey/:id')

    const handleChangePath = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        history.push(newValue)
    }

    React.useEffect(() => {}, [])

    return (
        <>
            {!Boolean(matchSurvey) && (
                <ThemeProvider mode="dark">
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div">
                                超市調
                            </Typography>
                            <Grow />
                            {!hideTab && (
                                <StyledTabs
                                    value={pathname}
                                    onChange={handleChangePath}
                                    centered
                                >
                                    {_.map(paths, ({ label, path }) => (
                                        <StyledTab
                                            key={path}
                                            label={label}
                                            value={path}
                                        />
                                    ))}
                                </StyledTabs>
                            )}
                            <Grow />
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                </ThemeProvider>
            )}
            <React.Suspense fallback={<div />}>
                <Switch>
                    <Route path="/survey/:id">
                        <Answer />
                    </Route>

                    <Route path={paths.survey.path}>
                        <Survey />
                    </Route>

                    <Route path={paths.analysis.path}>
                        <Analysis />
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
