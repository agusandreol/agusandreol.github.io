import { h } from 'preact';

export default ({pages, renderMark}) => (

	<div>
		{pages.map(page => (
			
				renderMark(page)
			
		))}
	</div>

);