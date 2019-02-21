import { h, Component } from 'preact';
import Router from 'preact-router'; // import Router (url handling) from preact-router module
import Match from 'preact-router/match';
import Header from 'Root/components/Header'; // import Header (i.e. nav) template
import Footer from 'Root/components/Footer'; // import Footer (i.e. consistent) template
import Home from 'Root/containers/Home'; // post template
import Submission from 'Root/containers/Submission'; // post template
import Archive from 'Root/containers/Archive'; // archive of submissions


var slugify = require('slugify');

export default class Application extends Component {

	componentWillMount(props, state) {
		console.log("test", this.props.questionQuery, "new state:", this.state)
		//console.log("state: ", this.state)
	}



	render(props, state){
		//console.log("here are the props in application.js: ", props)
		// path is passed as a usual prop (same as postcontent and result)
		return(
			<div>
				<Header />
				<Router>
					<Home path='/' props={this.props} />
					<Submission path='/submission' props={this.props} />
					<Archive path='/archive' props={this.props} />
				</Router>
				<Footer />
			</div>
		)
	}
};


