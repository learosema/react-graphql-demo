import * as React from 'react'
import LinkList from './LinkList';
import CreateLink from './CreateLink';

export default class App extends React.Component {
  render() {
    return (
      <main>
        <h1>Hackernews Clone</h1>
        <LinkList />
        <CreateLink />
      </main>
    )
  }
}