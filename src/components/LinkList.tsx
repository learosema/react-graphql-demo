import * as React from 'react'
import Link from './Link'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
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

export default class LinkList extends React.Component<any, any> {

  _updateCacheAfterVote = (store: any, createVote: any, linkId: string) => {
    const data = store.readQuery({ query: FEED_QUERY })
    const votedLink = data.feed.links.find((link : any) => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {
          ({loading, error, data}) => {
            if (loading) {
              return <div>Loading</div>
            }
            if (error) {
              return <div>Error</div>
            }
            const linksToRender : Array<any> = data.feed.links
            return (<ol>
              {linksToRender.map((link, index) => 
                <Link key={link.id} 
                      link={link}
                      index={index} 
                      updateStoreAfterVote={this._updateCacheAfterVote} />)}
            </ol>);
          }
        }
      </Query>
    )
  }
}