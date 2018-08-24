import * as React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import Login from './Login'


class Header extends React.Component<any, any> {

  render() {
    return (<header>
      <h1>Hacker News</h1>
      <nav>
      <Link to="/">new</Link>
      <Link to="/create">submit</Link>
      </nav>
      <Login />
    </header>);
  }
}

export default withRouter(Header)