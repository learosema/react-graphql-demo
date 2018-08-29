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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
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
        user {
          id
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

  _subscribeToNewVotes = (subscribeToMore: Function) => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  _subscribeToNewLinks = (subscribeToMore : Function) => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev: any, { subscriptionData }: any) => {
        console.log("updateQuery Fired!", subscriptionData)
        if (!subscriptionData.data) return prev
        if (!subscriptionData.data.newLink) {
          console.log("TODO does not work yet :/", subscriptionData.data)
          return prev
        }
        const newLink = subscriptionData.data.newLink
        const newLinkNode = newLink.node
  
        return Object.assign({}, prev, {
          feed: {
            links: [newLinkNode, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {
          ({loading, error, data, subscribeToMore}) => {
            if (loading) {
              return <div>Loading</div>
            }
            if (error) {
              return <div>Error</div>
            }
            this._subscribeToNewLinks(subscribeToMore)
            this._subscribeToNewVotes(subscribeToMore)

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