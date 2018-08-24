import * as React from 'react'
import { AUTH_TOKEN } from '../constants'


export default class Login extends React.Component<any, any> {
  state = {
    login: true,
    email: '',
    password: '',
    name:''
  }

  render() {
    const { login, email, password, name } = this.state
    return (
      
      <div className="header__form">
        <h4>
          { login ? 'Login' : 'Sign Up'}
        </h4>
        <div>
          {!login && (<div>
            <label>name</label>
            <input value={name} onChange={e => this.setState({name: e.target.value })} type="text" placeholder="Your name" />
          </div>)}
          <div>
            <label>email</label>
            <input value={name} onChange={e => this.setState({name: e.target.value })} type="text" placeholder="Your email" />
          </div>
          <div>
            <label>password</label>
            <input value={password} onChange={e => this.setState({name: e.target.value })} type="password" placeholder="Choose a safe password" />
          </div>
          <div>
            <button onClick={() => this._confirm()}>
            {login ? 'login' : 'create account'}
            </button>
          </div>
        </div>
        <a href="#" onClick={() => this.setState({ login: !login })}>
          {login ? 'need to create an account?' : 'already have an account?'}
        </a>
      </div>
      
    )
  }

  _confirm() {

  }

}