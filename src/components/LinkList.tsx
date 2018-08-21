import * as React from 'react'
import Link from './Link'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`


export default class LinkList extends React.Component<any, any> {

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
            return (<div>
              {linksToRender.map(link => <Link key={link.id} link={link} />)}
            </div>);
          }
        }
      </Query>
    )
  }
}