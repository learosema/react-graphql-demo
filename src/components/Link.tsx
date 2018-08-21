import * as React from 'react'

export default class Link extends React.Component<any, any> {
  render() {
    return (
      <div>
        {this.props.link.description} ({this.props.link.url})
      </div>
    )
  }
}