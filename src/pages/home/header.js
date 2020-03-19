import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

class Header extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTime: moment(),
			hamburger: false
		}
	}

	componentDidMount() {
		setInterval(() => {
			this.setState({
				currentTime: moment()
			})
		}, 1000);
	}

	render() {
		return (
			<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
				<div class="navbar-brand">
					<a class="navbar-item" href="#">
						<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
					</a>

					<a onClick={() => this.setState({ hamburger: !this.state.hamburger })} role="button" class={`navbar-burger burger ${this.state.hamburger ? "is-active" : ""}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
						< span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					</a>
				</div>

			<div id="navbarBasicExample" class={`navbar-menu ${this.state.hamburger ? "is-active" : ""}`} >
				<div class="navbar-start">
					<a class="navbar-item">
						Home
						</a>

					<span class="navbar-item">
						Time: {this.state.currentTime.format()}
					</span>

					<span class="navbar-item">
						UTC: {(this.state.currentTime.utcOffset() / 60 > 0) ? "+" + this.state.currentTime.utcOffset() / 60 : this.state.currentTime.utcOffset() / 60}
					</span>

				</div>
				{/* Right */}
				<div class="navbar-end">
					<div class="navbar-item">
						<div class="navbar-item has-dropdown is-hoverable">
							<a class="navbar-link">
								Sort By
							</a>

							<div class="navbar-dropdown">
								<Link to="#" class="navbar-item">Default</Link>
								<Link to="/?sort=name" class="navbar-item">Name</Link>
								<Link to="/?sort=time" class="navbar-item">Time</Link>
								<hr class="navbar-divider" />
								<a class="navbar-item">
									Report an issue
		  							</a>
							</div>
						</div>
					</div>
				</div>

			</div>
			</nav >
		)
	}

}


export default Header