import { h } from 'preact';

export default ({pages, renderPage}) => (

	<div>
		{pages.map(page => (
			
				renderPage(page)
			
		))}
	</div>

);