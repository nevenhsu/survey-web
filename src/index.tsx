import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { SnackbarProvider } from 'notistack'
import { store, history } from 'store'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateAdapter from '@mui/lab/AdapterDateFns'
import ThemeProvider from 'theme/ThemeProvider'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={DateAdapter}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <ThemeProvider withBaseline>
                        <SnackbarProvider maxSnack={3}>
                            <App />
                        </SnackbarProvider>
                    </ThemeProvider>
                </ConnectedRouter>
            </Provider>
        </LocalizationProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
