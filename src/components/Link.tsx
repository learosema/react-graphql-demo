import * as React from 'react'
import { timeDifferenceForDate } from '../timediff'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`

export default class Link extends React.Component<any, any> {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <li className="link">
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{linkId: this.props.link.id }}
            update={(store, { data: { vote } }) =>
              this.props.updateStoreAfterVote(store, vote, this.props.link.id)
            }>
            {voteMutation => (
              <button className="link__button" type="button" aria-label="upvote" onClick={() => voteMutation()}>
              ▲
              </button>
            )}
          </Mutation>
        )}
        <div className="link__content">
          {this.props.link.description} ({this.props.link.url})
        </div>
        <div className="link__info">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
      </li>
      
    )
  }
}