import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { route } from 'preact-router';
import { makeBook, PageBreak, Footnote } from 'bindery';
import Bindery from 'bindery';
import airAlphabet from 'Root/services/alphabet';
import Contents from 'Root/services/aboutInfo';
import Pages from 'Root/components/Pages';
import Paragraphs from 'Root/components/Paragraphs';
import Marks from 'Root/components/Marks';
import moment from 'moment-timezone';
import {TweenMax} from "gsap/TweenMax";
// firebase
import firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
import firebaseInfo from "Root/services/firebase";


export default class Submission extends Component {

	constructor(props){
    super(props);
  }

	componentWillMount(props, state) {
		//prior to loading the post

		if(this.props.props.questionQuery == ""){
			route('/')
		}

		// define alphabet logic
		const oneDay = 24*60*60*1000;
		const now = new Date();
		const biennialStart = new Date("January 09 2019 01:00");
		var daysSince = Math.floor(Math.abs((biennialStart.getTime() - now.getTime())/(oneDay))) % 30;
		var totalDaysSince = Math.floor(Math.abs((biennialStart.getTime() - now.getTime())/(oneDay)));
		console.log("days since the 13th biennial's begin on jan 9, 2019: ", daysSince)

		// current time
		var startingTime = new Date(),
				hours = (startingTime.getHours().toString().length == 1) ? "0" + startingTime.getHours() : startingTime.getHours(),
				minutes = (startingTime.getMinutes().toString().length == 1) ? "0" + startingTime.getMinutes() : startingTime.getMinutes(),
				seconds = (startingTime.getSeconds().toString().length == 1) ? "0" + startingTime.getSeconds() : startingTime.getSeconds(),
				currentDate = hours + ":" + minutes + ":" + seconds,
				currentZone = moment.tz(startingTime, Intl.DateTimeFormat().resolvedOptions().timeZone).format('z');

		if(firebase.apps.length != 0){
			firebase.auth().signInAnonymously().catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			});

			// push to DB
			var database = firebase.database();
			var ref = database.ref();
			var postsRef = ref.child("submissions");

			var newPostRef = postsRef.push();
			newPostRef.set({
			  "question" : this.props.props.questionQuery,
			  "dayCount" : daysSince,
			  "userInfo" : {
							"ip" : this.props.props.ipAddress,
							"time" : currentDate + " " + currentZone,
							"location" : this.props.props.coordinates
						}
			});

		}


		// prepare for catalogue generation:
		var pages = [],
				submission = this.props.props.questionQuery;
				submission = submission.split("");

		// console.log("submission: ", submission)

		var spaceCount = 0; //amount of spaces
		var spaceImageCount = airAlphabet.spaceShots.length;
		for (var i = 0; i < submission.length; i++) {

			var indexOfCharacter = airAlphabet.letters.indexOf(submission[i])

			if(submission[i] == " " || submission[i] == "_"){
				// console.log("space: _")
				var letter = {
					"alphabet"	: "_",
					"spaceImage" : airAlphabet.spaceShots[spaceCount]
				}
				pages.push(letter);
				if(spaceCount >= spaceImageCount - 1){
					spaceCount = 0;
				}else{
					spaceCount++;
				}
			}else if(submission[i] == "*"){
				var letter = {
					"alphabet"	: "*",
					"spaceImage" : airAlphabet.floorplan.url,
					"description" : airAlphabet.floorplan.description
				}
				pages.push(letter);
			}

			if(indexOfCharacter != -1){
				// console.log("letter", submission[i])
				var textPieceIndex = indexOfCharacter + daysSince;
				if(textPieceIndex >= 30){textPieceIndex = textPieceIndex - 30 }
				
				var artworkIndex = 29 - indexOfCharacter - daysSince;
				if(artworkIndex < 0){ artworkIndex = 30 + artworkIndex }

					// console.log(artworkIndex, textPieceIndex)

				var artwork = airAlphabet.artwork[artworkIndex],
						textPiece = airAlphabet.textPiece[textPieceIndex];
				//artwork.counter = artworkIndex;
				//textPieceIndex.counter = textPieceIndex;

				var letter = {
					"indeces" : [artworkIndex, textPieceIndex, daysSince],
					"alphabet"	: submission[i],
					"artwork"		: artwork,
					"textPiece" : textPiece
				}
				pages.push(letter);
			}
		}
		//console.log("pages: ", pages)
		this.setState({ pages: pages,  currentTime : [currentDate, currentZone]}) //set state to pass to render

	}

	onPrint(e){
		//styles
		var siteTitles = document.getElementById("site-titles"),
				backButton = document.getElementById("back-button"),
				about = document.getElementsByTagName("footer")[0],
				button = document.getElementsByClassName("button")[0],
				body = document.getElementsByTagName("body")[0],
				zoom = document.getElementsByClassName("📖-root")[0],
				submissionDiv = document.getElementById("submission");
		// set styles for printing
		siteTitles.classList.add("print-hidden");
		backButton.classList.add("print-hidden");
		about.classList.add("print-hidden");
		button.classList.add("print-hidden");
		submissionDiv.classList.add("print-hidden");
		body.classList.add("print-color");
		zoom.classList.add("print-size");
		window.print();
		// reset styles
		siteTitles.classList.remove("print-hidden");
		backButton.classList.remove("print-hidden");
		about.classList.remove("print-hidden");
		button.classList.remove("print-hidden");
		submissionDiv.classList.remove("print-hidden");
		body.classList.remove("print-color");
		zoom.classList.remove("print-size");
	}

	renderPara(paragraph){
		return(
			<div>
				<p class="bk-text-content bk-para" dangerouslySetInnerHTML={{__html: paragraph}} />
			</div>
		)
	}


	renderPage(page){
		// console.log("rendering item\n", page, "\n")
		
		if(page.alphabet == " " || page.alphabet == "_" || page.alphabet == "*"){
			return (
				<div class="bk-page">
					<img class="bk-space-image" src={page.spaceImage} />
					<div class="bk-letter">{page.alphabet}</div>		
				</div>
			);
		}else{

			if(Array.isArray(page.textPiece.content)){
				return (
					<div class="bk-page">
						<div class="bk-letter">{page.alphabet}</div>
						<div class={"bk-text text-location-" + page.indeces[1]}>
							<Paragraphs paragraphs={page.textPiece.content} renderPara={this.renderPara.bind(this)} />
						</div>
						<div class={"bk-artwork art-location-" + page.indeces[0]}>
							<h2 class="bk-title">{page.artwork.artist}</h2>
							<h2 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.title}} />
							<h3 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.date}} />
							<img class="bk-artwork-image" src={page.artwork.url} />
							<h3 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.caption}} />
						</div>
					</div>
				);

			}else{
				return (
					<div class="bk-page">
						<div class="bk-letter">{page.alphabet}</div>
						<div class={"bk-text text-location-" + page.indeces[1]}>
							<p class="bk-text-content" dangerouslySetInnerHTML={{__html: page.textPiece.content}} />
						</div>
						<div class={"bk-artwork art-location-" + page.indeces[0]}>
							<h2 class="bk-title">{page.artwork.artist}</h2>
							<h2 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.title}} />
							<h3 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.date}} />
							<img class="bk-artwork-image" src={page.artwork.url} />
							<h3 class="bk-title" dangerouslySetInnerHTML={{__html: page.artwork.caption}} />
						</div>
					</div>
				);
			}
		}
	}

	renderMark(page){
		// console.log("rendering item\n", page, "\n")

		if(page.alphabet == " " || page.alphabet == "_" || page.alphabet == "*"){
			return (
				<div></div>
			);
		}else{

			if(Array.isArray(page.textPiece.content)){
				return (
					<div>
						<div class={"bk-mark text-location-" + page.indeces[1]}>
							<Paragraphs paragraphs={page.textPiece.content} renderPara={this.renderPara.bind(this)} />
						</div>
						<div class={"bk-mark art-location-" + page.indeces[0]}></div>
					</div>
				);
			}else{
				return (
					<div>
						<div class={"bk-mark text-location-" + page.indeces[1]}>
							<p class="bk-text-content" dangerouslySetInnerHTML={{__html: page.textPiece.content}} />
						</div>
						<div class={"bk-mark art-location-" + page.indeces[0]}></div>
					</div>
				);
			}
		}
	}


	render(props, state){
		//console.log("submission props:\n", props,"\nsubmission state:\n", state)
		document.getElementsByTagName('body')[0].classList.add("submission");

		return (
			<div id="submission">
				<div id="pdf-interface">
					<div id="catalogue-title">{"BIENNIAL PUBLICATION #" + props.props.submissionCount + ": " + props.props.questionQuery + "?"}</div>
					<div id="page-count">{ state.pages.length + 3 + " pages"}</div>
				</div>
				<div class="site-titles" id="site-titles">
					<h2 class="site-title">13th A.I.R. Biennial</h2>
					<h1 class="site-title">Let’s try listening<br />again</h1>
				</div>
				<div id="meta-info">
					<ul>
						<li id="meta-question">{ props.props.questionQuery + "?" }</li>
						<li id="current-letter">Submission { "#" + props.props.submissionCount }</li>
						<li id="clock">{ state.currentTime[0] + " " + state.currentTime[1] }</li>
						<li id="coordinates">{ "(" + props.props.coordinates + ")" }</li>
						<li id="ip-address">{props.props.ipAddress}</li>
					</ul>
				</div>
				<div id="content">
					<div class="bk-page bk-title-page"> 
						<h2 class="">13th A.I.R. Biennial</h2>
						<h1 class="bk-subtitle">Let’s try listening<br />again</h1>
						<h3 class="bk-question">{ props.props.questionQuery }?</h3>
						<ul class="bk-meta-data">
							<li>Submission { "#" + props.props.submissionCount }</li>
							<li>{ state.currentTime[0] + " " + state.currentTime[1] }</li>
							<li>{ "(" + props.props.coordinates + ")"}</li>
							<li>{props.props.ipAddress}</li>
						</ul>
						<Marks pages={state.pages} renderMark={this.renderMark.bind(this)} />
					</div>
					
					<Pages pages={state.pages} renderPage={this.renderPage.bind(this)} />

					<div class="bk-page bk-question-mark">
						<h3 class="bk-question" style="opacity: 0.5;">?</h3>
						<div class="bk-left">
							<p>This publication is part of<br />13th A.I.R. Biennial, Let’s try listening again<br />January 9 – February 3, 2019</p>
						</div>
						<div class="bk-right">
							<h1>Exhibiting Artists</h1>
							<ul>
								<li>Angeli </li>
								<li>Angie Keefer </li>
								<li>Anna Riley</li>
								<li>Catalina Viejo López  de Roda</li>
								<li>Dulce Gómez</li>
								<li>Fotini Vurgaropulou</li>
								<li>Hagen Verleger</li>
								<li>Irene Mohedano</li>
								<li>Jane Long </li>
								<li>Johanna Unzueta</li>
								<li>Julie Nagle</li>
								<li>Karen Donnellan</li>
								<li>Katie Hector</li>
								<li>Katja Mater</li>
								<li>Katy Mixon</li>
								<li>Keren Benbenisty </li>
								<li>Kyoung eun Kang </li>
								<li>Library Stack </li>
								<li>Lukas Eigler-Harding </li>
								<li>Malin Abrahamsson </li>
								<li>Maren Henson </li>
								<li>Matthew Schrader </li>
								<li>Olivia Baldwin </li>
								<li>Romily Alice Walden </li>
								<li>Sari Carel</li>
								<li> Scaleno Collective </li>
								<li>Shuyi Cao </li>
								<li>Suzanne Mooney </li>
								<li>Tselote Holley </li>
								<li>Zhenya Plechkina</li>
							</ul>
						</div
						><div class="bk-right">
							<h1>About the Biennial</h1>
							<p>This biennial exhibition starts where our open call ended: with the sentence “Let’s try listening again.” Echoing a contemporary sentiment, this title voices an urge to stop the treadmill of self-same thought and perceive what is near, around, yet not always seen. It highlights a pause for respect and discovery that is necessary to imagine new, relevant relations—whether social, intellectual, emotional, or cosmic. The point being: we can’t know everything, but still we need to envision novel forms of communing.</p>
							<p>Listening to the five hundred and forty-four voices that responded to our open call, we gradually selected a constellation of thirty works that resonate with this theme. The exhibition brings together two performances, two distributed projects, and twenty-five works for the gallery by participating artists far and wide.</p>
							<p>The encoded PDF communiqués made on this catalog-website provide visual glimpses of the exhibition and short writings around the thematics of this year’s biennial.</p>
							<p>Gratitude to all applicants. This was hard.</p>
							<p>S. & P.<br /><br /></p>
							<h2>Curated by</h2>
							<p>{Contents.colophon.curators[0]}<br />{Contents.colophon.curators[1]}</p>		
							<h2>Organized by</h2>
							<p>Roxana Fabius <br />Patricia M. Hernandez</p>
							<h2>Site by</h2>
							<p>
								{Contents.colophon.design}<br />
								Typeset in {Contents.colophon.typefaces[0]} and {Contents.colophon.typefaces[1]},
								built<br />with Preact and Bindery.js, hosted by Zeit.co.
							</p>
						</div>
					</div>

					<div class="bk-page bk-end-page"> 
						
						<h2 class="">13th A.I.R. Biennial</h2>
						<h1 class="bk-subtitle">Let’s try listening<br />again</h1>
						<div class="bk-catalogue">
							<div class="bk-right"></div
							><div class="bk-right">
								<h1>About A.I.R.</h1>
								<p>Founded in 1972, A.I.R. is the first artist-run, non-profit gallery for self-identified women artists in the United States. Through its history, A.I.R. has developed a unique cooperative model through which scarce assets have been shared and women’s issues have been raised. As a feminist artist-run organization with a self-directed governing body, A.I.R. is an alternative cultural institution supported by a network of active artist-participants. Its existence proved to be fundamental in the careers of artists such as Nancy Spero, Ana Mendieta, Mary Beth Edelson, Judith Bernstein, Howardena Pindell, Agnes Denes, Kazuko Miyamoto, Elaine Reichek, and many more.</p>
								<h2>Current New York artists:</h2>
								<p>Tomoko Abe, Susan Bee, Liz Biddle, Daria Dorosh, Yvette Dubinsky, Maxine Henryson, Carrie Johnson, Cynthia Karasek, Carolyn Martin, Luca Molnar, Jayanthi Moorthy, Aphrodite Navab, Sylvia Netzer, Ann Pachner, Ada Potter, Ann Schaumburger, Negin Sharifzadeh, Susan Stainman, Joan Snitzer, Erica Stoller, Nancy Storrow, Jane Swavely.</p>
								<p><br />A.I.R. Gallery<br />155 Plymouth Street<br />Brooklyn NY</p>
								<p>airgallery.org</p>
							</div>
						</div>

						<ul class="bk-meta-data">
							<li>Submission {"#" + props.props.submissionCount}</li>
							<li>{ state.currentTime[0] + " " + state.currentTime[1] }</li>
							<li>{ "(" + props.props.coordinates + ")"}</li>
							<li>{props.props.ipAddress}</li>
						</ul>
						<Marks pages={state.pages} renderMark={this.renderMark.bind(this)} />
					</div>

				</div>
				<Link href="/" id="back-button"><span id="back-icon"></span> <span id="back-text">New Submission</span></Link>
				<div class="button" id="print" onClick={this.onPrint.bind(this)} >Print</div>
				<div class="" id="">{ state.thisValue }</div>
			</div>
			
			)
	}

	componentDidMount() {
		// console.log("submission mounted")

		var makingTheBook = function(){
			makeBook({
			  content: '#content',
			  rules: [
			    Bindery.FullBleedPage({
					  selector: '.bk-page',
					  continue: 'same'
					})
			  ],
			  printSetup: {
			  	layout: Bindery.Layout.PAGES,
			  	paper: Bindery.Paper.LETTER_PORTRAIT,
			  	bleed: '0pt',
			  	marks: Bindery.Marks.NONE
			  },
			  pageSetup: {
			  	size: { width: '8.6in', height: '11.01in' },
			  	margin: {top: '0pt', inner: '0pt', outer: '0pt', bottom: '0pt'}
			  },
			  view: Bindery.View.PRINT
			})

			var theBook = document.getElementsByClassName("📖-root")[0];
			setTimeout(function(){
				theBook.setAttribute('style', 'opacity: 1 !important');
			}, 500);
		}


		//get submission count
		var thisState = this;
		
		if(firebase.apps.length != 0){
			firebase.database().ref('submissions')
			.once('value')
			.then(function(snapshot){
			  var submissionCount = snapshot.numChildren();
			  console.log("\n\nsubmissionCount ", submissionCount, "\n\n")
			  thisState.setState({ submissionCount: submissionCount }); 
	  		thisState.props.props.submissionCount = submissionCount;

			})
			.then(function(){
				makingTheBook();
			});
		}

		//interface load
		var pdfInterface = document.getElementById("pdf-interface");
		var backButton = document.getElementById("back-button");
		TweenMax.to(pdfInterface, 0.25, {y: 0, ease: Power3.easeInOut, delay: 0.75})
		TweenMax.to(backButton, 0.25, {y: 0, ease: Power3.easeInOut, delay: 0.75})
		pdfInterface.style.transition = "transform 0.25s";
		backButton.style.transition = "transform 0.25s";

		var scrollPosition = 0;

		window.addEventListener("scroll", function(e){
			if(window.outerWidth > 768){
				if(scrollPosition < window.scrollY){ //scrolling down, hide interface
					pdfInterface.style.transform = "translateY(-3rem)";
					backButton.style.transform = "translateY(-3rem)";
					scrollPosition = window.scrollY;
				}else{ //scrolling up
					pdfInterface.style.transform = "translateY(0)";
					backButton.style.transform = "translateY(0)";
					scrollPosition = window.scrollY;				
				}
			}
		});

	}

	componentWillUnmount(){
		console.log("/submission unmounted")
		var book = document.getElementsByClassName("📖-root")[0],
				measureArea = document.getElementsByClassName("📖-measure-area")[0],
				body = document.getElementsByTagName("body")[0];

		if(book){ body.removeChild(book); }
		if(measureArea){ body.removeChild(measureArea);}

		this.props.props.questionQuery = "";
		
	}
}

// //<List years={years} renderItem={this.renderItem.bind(this)} />