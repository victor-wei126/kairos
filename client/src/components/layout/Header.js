import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(e) {
		this.props.onSearchChange(e.target.value);
	}

	handleSubmit() {
		axios.get('http://localhost:4000/browse', {
			params: {
				searchQuery: this.props.searchQuery
			}
		})
			.then(res => {
				this.props.jobUpdate(res.data);
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div className="container-fluid p-3 bg-light">
				<div className="row justify-content-start align-items-center">
					<div className="col-xl-2 justify-content-center d-flex ml-3 mr-3">
						<h1 className="display-4">
							<Link to="/">Collancer</Link>
						</h1>
					</div>
					<div className="col-3">
						<input
							type="text" 
							className="form-control" 
							placeholder="Search..."
							value={this.props.searchQuery}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="col-4">
						<button className="btn btn-primary" onClick={this.handleSubmit}>Go</button>
					</div>
				</div>
				<div className="row text-center">
					<div className="col-xl-1">
							<Link to="">Design</Link>
					</div>
					<div className="col-xl-1">
							<Link to="">Programming</Link>
					</div>
					<div className="col-xl-1">
							<Link to="">Tutoring</Link>
					</div>
					<div className="col-xl-1">
							<Link to="">Writing</Link>
					</div>
				</div>
      		</div>
		)
	}
}