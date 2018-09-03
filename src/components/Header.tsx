import * as React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import Login from './Login'
import { AUTH_TOKEN } from '../constants'

class Header extends React.Component<any, any> {

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const logout = () => {
      localStorage.removeItem(AUTH_TOKEN)
      this.props.history.push(`/`)
    }
    return (<header>
      <h1><Link to="/">Hacker News</Link></h1>
      <nav>
      <Link to="/">new</Link>
      <Link to="/top">top</Link>
      <Link to="/search">search</Link>
      {authToken && (<Link to="/create">submit</Link>)}
      {authToken ? (<a href="#" onClick={logout}>logout</a>) : (<Link to="/login">login</Link>)}
      </nav>
    </header>)
  }
}

export default withRouter(Header)