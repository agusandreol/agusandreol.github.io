import { h } from 'preact';
import { Link } from 'preact-router';
import Contents from 'Root/services/aboutInfo';

export default () => (

	<footer>
		<div id="about">ABOUT</div>
		<div class="right-column" id="about-content">
			<h1>About the Biennial</h1>
			<p>This biennial exhibition starts where our open call ended: with the sentence “Let’s try listening again.” Echoing a contemporary sentiment, this title voices an urge to stop the treadmill of self-same thought and perceive what is near, around, yet not always seen. It highlights a pause for respect and discovery that is necessary to imagine new, relevant relations—whether social, intellectual, emotional, or cosmic. The point being: we can’t know everything, but still we need to envision novel forms of communing.</p>
			<p>Listening to the five hundred and forty-four voices that responded to our open call, we gradually selected a constellation of thirty works that resonate with this theme. The exhibition brings together two performances, two distributed projects, and twenty-five works for the gallery by participating artists far and wide.</p>
			<p>The encoded PDF communiqués made on this catalog-website provide visual glimpses of the exhibition and short writings around the thematics of this year’s biennial.</p>
			<p>Gratitude to all applicants. This was hard.</p>
			<p>S. & P.<br /></p>
			<h2>Curated by</h2>
			<p>{Contents.colophon.curators[0]}<br />and {Contents.colophon.curators[1]}</p>		
			<h2>Organized by</h2>
			<p>Roxana Fabius <br />and Patricia M. Hernandez</p>
			<h1>About A.I.R.</h1>
			<p>Founded in 1972, A.I.R. is the first artist-run, non-profit gallery for self-identified women artists in the United States. Through its history, A.I.R. has developed a unique cooperative model through which scarce assets have been shared and women’s issues have been raised. As a feminist artist-run organization with a self-directed governing body, A.I.R. is an alternative cultural institution supported by a network of active artist-participants. Its existence proved to be fundamental in the careers of artists such as Nancy Spero, Ana Mendieta, Mary Beth Edelson, Judith Bernstein, Howardena Pindell, Agnes Denes, Kazuko Miyamoto, Elaine Reichek, and many more.</p>
			<h2>Current New York artists:</h2>
			<p>Tomoko Abe, Susan Bee, Liz Biddle, Daria Dorosh, Yvette Dubinsky, Maxine Henryson, Carrie Johnson, Cynthia Karasek, Carolyn Martin, Luca Molnar, Jayanthi Moorthy, Aphrodite Navab, Sylvia Netzer, Ann Pachner, Ada Potter, Ann Schaumburger, Negin Sharifzadeh, Susan Stainman, Joan Snitzer, Erica Stoller, Nancy Storrow, Jane Swavely.</p>
			<h1>Colophon</h1>
			<p>
				Site by {Contents.colophon.design}.<br />
				Typeset in {Contents.colophon.typefaces[0]} and {Contents.colophon.typefaces[1]},
				built with Preact and Bindery.js, hosted by Zeit.co.
			</p>		
		</div>
	</footer>

);
