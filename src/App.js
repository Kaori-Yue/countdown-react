import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import test from './components/card'
import Home from './pages/home'
const About = () => <h1>About</h1>
const Post = () => <h1>Post</h1>
const Project = () => <h1>Project</h1>

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/posts" component={Post} />
        <Route path="/projects" component={Project} />
        <Route path="/test" component={test} />
      </div>
    )
  }
}

export default App