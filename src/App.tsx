import * as React from 'react'
import _ from 'lodash'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { useAppSelector, useAppDispatch } from 'hooks'
import User from 'utils/user'
import { setStep, setMode, selectCurrentSurvey } from 'store/slices/survey'
import { SurveyStep } from 'common/types'

const Survey = React.lazy(() => import('components/Survey'))
const StartForm = React.lazy(() => import('components/Survey/StartForm'))
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
        backgroundColor: theme.palette.common.black,
        height: 4,
        bottom: -6,
    },
}))

const StyledTab = styled(Tab)(({ theme }) => ({
    color: theme.palette.grey[500],
    '&.Mui-selected': {
        color: theme.palette.grey[800],
    },
}))

export default function App() {
    const dispatch = useAppDispatch()
    const pathname = useAppSelector((state) => state.router.location.pathname)
    const step = useAppSelector((state) => state.survey.step)
    const paths = {
        survey: { path: '/survey', label: '編輯' },
        analysis: { path: '/analysis', label: '報告' },
    }
    const survey = useAppSelector(selectCurrentSurvey)

    const atHome = pathname === '/'

    const history = useHistory()

    const matchSurvey = useRouteMatch('/survey/:id')

    const handleChangePath = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        history.push(newValue)
    }

    const handleLogo = () => {
        dispatch(setStep(SurveyStep.start))
    }

    React.useEffect(() => {
        const user = User.getInstance()
        const { step, mode } = user.getValue()

        if (!_.isNil(step)) {
            dispatch(setStep(step))
        }

        if (!_.isNil(mode)) {
            dispatch(setMode(mode))
        }
    }, [])

    React.useEffect(() => {
        if (step === SurveyStep.start && !matchSurvey && !atHome) {
            history.push('/')
        } else if (step && step !== SurveyStep.start && atHome) {
            history.push('/survey')
        }
    }, [step])

    return (
        <>
            {!Boolean(matchSurvey) && (
                <AppBar
                    className="underline"
                    position="static"
                    color="default"
                    elevation={0}
                >
                    <Toolbar sx={{ px: '16px !important' }}>
                        <Typography
                            className="c-pointer"
                            variant="h5"
                            letterSpacing="0.05em"
                            onClick={handleLogo}
                        >
                            超市調
                        </Typography>
                        <Grow />
                        {!atHome && !_.isEmpty(survey) && (
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

                    <Route path={paths.analysis.path}>
                        <Analysis />
                    </Route>

                    <Route exact path="/">
                        <StartForm />
                    </Route>
                </Switch>
            </React.Suspense>
        </>
    )
}
