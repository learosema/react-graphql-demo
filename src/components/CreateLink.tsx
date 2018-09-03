import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

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
      <div className="form">
        <input value={description} onChange={e => this.setState({ description: e.target.value })} type="text" placeholder="A description for the link" />
        <input value={url} onChange={e => this.setState({ url: e.target.value })} type="text" placeholder="The URL for the link" />
        <Mutation 
          mutation={POST_MUTATION} 
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data: any = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy }
            })
            data.feed.links.unshift(post)
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy }
            })
          }}
          >
          {postMutation => <button onClick={() => postMutation()}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}