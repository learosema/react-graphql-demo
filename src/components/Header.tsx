import * as React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends React.Component<any, any> {

  render() {
    return (<header>
      <h1>Hacker News</h1>
      <Link to="/">new</Link>
      <Link to="/create">submit</Link>
    </header>);
  }
}

export default withRouter(Header)