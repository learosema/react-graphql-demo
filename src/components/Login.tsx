import * as React from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

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
      <div className="form">
        <h2>
          { login ? 'Login' : 'Sign Up'}
        </h2>
        <Mutation mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION} variables={{email, password, name}} onCompleted={data => this._confirm(data)}>
          {mutation => (
          <form onSubmit={(e) => this._submitForm(e, mutation)}>
            {!login && (<div>
              <label>name</label>
              <input value={name} onChange={e => this.setState({name: e.target.value })} type="text" placeholder="Your name" required />
            </div>)}
            <div>
              <label>email</label>
              <input value={email} onChange={e => this.setState({email: e.target.value })} type="text" placeholder="Your email" required />
            </div>
            <div>
              <label>password</label>
              <input value={password} onChange={e => this.setState({password: e.target.value })} type="password" placeholder="Choose a safe password" required />
            </div>
            <div>            
              <button type="submit">
                {login ? 'login' : 'create account'}
              </button>
              <button type="button" onClick={this._changeForm} aria-pressed={!login}>
                {login ? 'need to create an account?' : 'already have an account?'}
              </button>
            </div>
          </form>
        )}
        </Mutation>
      </div>
    )
  }

  _changeForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { login } = this.state
    this.setState({ login: !login })
  }

  _submitForm = (e: React.FormEvent<HTMLFormElement>, mutationFunc: Function) => {
    mutationFunc()
    e.preventDefault()
  }

  _confirm = async (data: any) => {
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/`)
  }

  _saveUserData = (token: string) => {
    localStorage.setItem(AUTH_TOKEN, token)
  }

}
