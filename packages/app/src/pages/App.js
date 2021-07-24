import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { ApolloProvider } from 'react-apollo'
import { client } from '../apollo/client'
import { ENVIRONMENT, pages } from '../constants'
import { Toast } from '../components/atoms'

import Web3Provider from '../contexts/Web3'
import PriceProvider from '../contexts/Price'
import TablesProvider from '../contexts/Tables'
import UIProvider from '../contexts/UI'
import DataStaticProvider from '../contexts/DataStatic'
import DataDynamicProvider from '../contexts/DataDynamic'

import Theme from '../themes'
import Campaigns from './Campaigns'
import Watcher from './Watcher'

import { Toolbar } from '../components/specific'

function Wrapper ({ children }) {
  return (
    <ApolloProvider client={client}>
      <Web3Provider>
        <UIProvider>
          <PriceProvider>
            <DataStaticProvider>
              <DataDynamicProvider>
                <TablesProvider>{children}</TablesProvider>
              </DataDynamicProvider>
            </DataStaticProvider>
          </PriceProvider>
        </UIProvider>
      </Web3Provider>
    </ApolloProvider>
  )
}

function Manager ({ children }) {
  return (
    <Theme.Provider>
      <Theme.GlobalStyle />
      <ToastProvider
        components={{ Toast: Toast.Element, ToastContainer: Toast.Container }}
      >
        {children}
      </ToastProvider>
    </Theme.Provider>
  )
}

function Routes () {
  return (
    <Switch>
      <Route path={pages.campaigns.route} component={Campaigns} exact />
      <Redirect to={pages.campaigns.route} />
    </Switch>
  )
}

function App () {
  console.log(
    `%cWelcome to the Defuse dashboard! #${String(ENVIRONMENT.current).substr(
      0,
      1
    )}`,
    'color: #C41857'
  )
  return (
    <BrowserRouter>
      <Wrapper>
        <Manager>
          <Toolbar />
          <Watcher />
          <Routes />
        </Manager>
      </Wrapper>
    </BrowserRouter>
  )
}

export default App
