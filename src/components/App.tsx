import * as React from 'react'
import Header from './Header'
import { Switch, Route, Redirect } from 'react-router-dom'
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Login from './Login'
import Search from './Search'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" render={() => <Redirect to='/new/1' />} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/top' component={LinkList} />
            <Route exact path='/new/:page' component={LinkList} />
          </Switch>
        </main>
      </div>
    )
  }
}