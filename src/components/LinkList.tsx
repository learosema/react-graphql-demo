import * as React from 'react'
import Link from './Link'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants'
import { Fragment } from 'react';


export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
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

  _getLinksToRender = (data: any) => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1: any, l2: any) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = (data: any) => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }
  
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  _updateCacheAfterVote = (store: any, createVote: any, linkId: string) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
  
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy }
    })

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
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
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

            const linksToRender : Array<any> = this._getLinksToRender(data)
            const isNewPage = this.props.location.pathname.includes('new')
            const pageNum = this.props.match.params.page || 1
            const pageIndex = (pageNum - 1) * LINKS_PER_PAGE
            return (<Fragment>
              <ol>
                {linksToRender.map((link, index) => 
                  <Link key={link.id} 
                        link={link}
                        index={index} 
                        updateStoreAfterVote={this._updateCacheAfterVote} />
                )}
             </ol>
            {isNewPage && (<nav className="pages">
                <button type="button" onClick={() => this._previousPage()}> previous Page </button>
                <button type="button" onClick={() => this._nextPage(data)}> next Page </button>
            </nav>)}
            </Fragment>);
          }
        }
      </Query>
    )
  }
}