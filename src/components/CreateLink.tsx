import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`


export default class CreateLink extends React.Component<any, any> {

  state = {
    description: '',
    url: ''
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <input value={description} onChange={e => this.setState({ description: e.target.value })} type="text" placeholder="A description for the link" />
        <input value={url} onChange={e => this.setState({ url: e.target.value })} type="text" placeholder="The URL for the link" />
        <Mutation mutation={POST_MUTATION} variables={{ description, url }}>
          {postMutation => <button onClick={() => postMutation()}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}