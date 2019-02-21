//preact
import { h, Component } from 'preact';
// extends preact class: Component
import { Link } from 'preact-router';

export default class Archive extends Component {


	renderItem(item){
		//var link = "";
		//if(item.link){ 
			//link = item.link 
			//console.log("rendered Item w/ updated link: ", item)
		//}
		console.log("rendering item", item)
		
			return (
				<div>
					<h1>{ item.name }</h1>
					<h2>{ item.date.month }/{ item.date.day }/{ item.date.year }</h2>
					<h2>{ item.date.time }</h2>
					<h2>{ item.date.general }</h2>
					<hr /><br />
				</div>
			);
	}

	render({}, {years}){
		console.log("********\nRENDERING!\n********", years)
		return (

			<div>
				<h1>{years.length}</h1>
				<List years={years} renderItem={this.renderItem.bind(this)} />
			</div>

		)
	}
}