import { h } from 'preact';

export default ({paragraphs, renderPara}) => (

	<div>
		{paragraphs.map(paragraph => (
			
				renderPara(paragraph)
			
		))}
	</div>

);