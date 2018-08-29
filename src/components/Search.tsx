import * as React from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

class Search extends React.Component<any, any> {

  state = {
    links: [],
    filter: ''
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    })
    const links = result.data.feed.links
    this.setState({ links })
  }

  render() {
    return (<div>
      <form className="form" onSubmit={(e) => {
          e.preventDefault()
          this._executeSearch()
        }}>
        <label>Search</label>
        <input type="text" onChange={e => this.setState({ filter: e.target.value })} />
        <button> OK </button>
      </form>
      <ol>
        {this.state.links.map((link:any, index) => 
          <Link key={link.id} link={link} index={index} />
        )}
      </ol>
    </div>)
  }
}

export default withApollo(Search)

