import * as React from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './link'

class Search extends React.Component<any, any> {

  state = {
    links: [],
    filter: ''
  }

  _executeSearch = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  render() {
    return (<div className="search-form">
      <form onSubmit={this._executeSearch}>
        <label>Search</label>
        <input type="text" onChange={e => this.setState({ filter: e.target.value })} />
        <button> OK </button>
      </form>
      <ol>
        {this.state.links.map((link:any, index) => {
          <Link key={link.id} link={link} index={index} />
        })}
      </ol>
    </div>)
  }

}

export default withApollo(Search)

