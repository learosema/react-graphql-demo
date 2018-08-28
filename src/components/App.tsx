import * as React from 'react'
import Header from './Header'
import { Switch, Route } from 'react-router-dom'
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Login from './Login'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    )
  }
}