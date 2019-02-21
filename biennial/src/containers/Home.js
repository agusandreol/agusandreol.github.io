//preact
import { h, Component } from 'preact';
import { Link } from 'preact-router';
import moment from 'moment-timezone';
import geolocation from 'geolocation';
var needle = require('needle');
// firebase
import firebase from "firebase/app";
//import 'firebase/auth';
import 'firebase/database';
import firebaseInfo from "Root/services/firebase";

export default class Home extends Component {

	constructor(props){
		super(props);
		console.log("constructor\n", this.props)

		var ipAddress = "UNKNOWN",
				currentPosition = "40.7038431, -73.9892643",
				startingTime = new Date(),
				hours = (startingTime.getHours().toString().length == 1) ? "0" + startingTime.getHours() : startingTime.getHours(),
				minutes = (startingTime.getMinutes().toString().length == 1) ? "0" + startingTime.getMinutes() : startingTime.getMinutes(),
				seconds = (startingTime.getSeconds().toString().length == 1) ? "0" + startingTime.getSeconds() : startingTime.getSeconds(),
				currentDate = hours + ":" + minutes + ":" + seconds,
				currentZone = moment.tz(startingTime, Intl.DateTimeFormat().resolvedOptions().timeZone).format('z');

		this.state = {
									thisValue : '',
									currentLetter: '_',
									ipAddress: ipAddress,
									coords: currentPosition,
									currentDate : [currentDate, currentZone],
									pages : [],
									submissionCount: ""
								}
	};

	componentWillMount(props, state) {	
		this.props.props.questionQuery = ""; //resets submission

		// initialize database:
		var config = {
		  apiKey: firebaseInfo.apiKey,
	    authDomain: firebaseInfo.authDomain,
	    databaseURL: firebaseInfo.databaseURL,
	    storageBucket: firebaseInfo.storageBucket
		};
		
		if (firebase.apps.length == 0){
			firebase.initializeApp(config);
		}
	}

	renderItem(item){
		//console.log("rendering item\n", item)
		return (
			<div>
				<h1>{ item }</h1>
			</div>
		);
	}

	onInput(e){
		//console.log("onInput: ", e.key, this.props.props)
		console.log("key: ", e.key)
		// update state for submission

		var currentState, 
				thisLetter = '_';

		if(this.state.thisValue.length <= 80){
			if(e.key == "Backspace"){
				currentState = this.state.thisValue.slice(0, -1);
			}else if(e.key == "ENTER" || e.key == "enter" || e.key == "Enter"){
				currentState = this.state.thisValue;
				thisLetter = "_";
				/* NEEDS TO SUBMIT THE LINK! */
				document.getElementById("submit").click();

			}else if(e.key == "Meta" || e.key == "Shift" || e.key == "CapsLock" || e.key == "Alt" || e.key == "Control" || e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowUp" || e.key == "ArrowDown"){
				currentState = this.state.thisValue;
			}else if(e.key == '"' || e.key == ";" || e.key == "~" || e.key == "`" || e.key == "/" || e.key == "^" || e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5" || e.key == "6" || e.key == "7" || e.key == "8" || e.key == "9" || e.key == "0" || e.key == "?" || e.key == "<" || e.key == ">" || e.key == "(" || e.key == "[" || e.key == "{" || e.key == ")" || e.key == "]" || e.key == "}" || e.key == "|" || e.key == "+" || e.key == "=" || e.key == "&" || e.key == "%" || e.key == "#" || e.key == "$" || e.key == "@" || e.key == "!" || e.key == "*" || e.key == "." || e.key == "\\"){
				currentState = this.state.thisValue + "*";
				thisLetter = "*";	
			}else if(e.key == " " || e.key == "_"){
				currentState = this.state.thisValue + " ";
				thisLetter = "_";	
			}else if(e.key == "-" || e.key == "-" || e.key == "–" || e.key == "—"){
				currentState = this.state.thisValue + "-";
				thisLetter = "-";	
			}else{
				currentState = this.state.thisValue + e.key;
				thisLetter = e.key;
				// ABCDEFGHIJKLMNOPQRSTUVWXYZ :,-
			}
		}else{
			if(e.key == "Backspace"){
				currentState = this.state.thisValue.slice(0, -1);
			}else{
				currentState = this.state.thisValue;
			}
		}

			//console.log("currentState: ", currentState.toUpperCase())
			this.setState({ thisValue : currentState.toUpperCase(), currentLetter : thisLetter.toUpperCase() })
			this.props.props.questionQuery = currentState.toUpperCase();
			this.props.props.currentLetter = thisLetter.toUpperCase();

			// check length of input (if greater than 1, allow Link)
			var submitButton = document.getElementById("submit");
			if(currentState.length >= 1){
				if(submitButton){ submitButton.classList.add("submit-ready"); }
			}else{
				if(submitButton){ submitButton.classList.remove("submit-ready"); }
			}
	}

	render({}, { thisValue, currentLetter, ipAddress, coords, currentDate }){
		document.getElementsByTagName('body')[0].classList.remove("submission"); // remove submission on back button

		//render:
		return (
			<div>
				<div class="site-titles">
					<h2 class="site-title">13th A.I.R. Biennial</h2>
					<h1 class="site-title">Let’s try listening <br />again</h1>
				</div>
				<div class="input">
					<input class="input-content" id="input-focus" maxlength="80" autocomplete="off" value={thisValue} onkeyup={this.onInput.bind(this)} />
					<div id="mobile-question">?</div>
					<div id="input-view">
						<div id="visible-content"></div>
						<div id="blinking"></div>
						<span id="question-mark" >?</span>
					</div>
				</div>
				<div id="meta-info">
					<ul>
						<li id="current-letter">{currentLetter}</li>
						<li id="clock">{currentDate[0] + " " + currentDate[1]}</li>
						<li id="coordinates">({coords})</li>
						<li id="ip-address">{ipAddress}</li>
					</ul>
				</div>
				<Link class="button" id="submit" href="/submission" props={thisValue}>Submit</Link>
			</div>
		)
	}

	componentDidMount() {
		console.log("mounted:\n");
		// populate current letter
		var currentLetterDisplay = document.getElementById("current-letter");
		currentLetterDisplay.innerHTML = '_';
		// adjust scale of visible area
		var targetView = document.getElementById("input-view");
		targetView.style.transform = "scale(1)";

		var ipAddress = "UNKNOWN",
				currentPosition = "40.7038431, -73.9892643";

		var thisState = this;

		thisState.props.props.ipAddress = ipAddress;
		thisState.props.props.coordinates = currentPosition;

		function getIP(){
			var data = [];
      var options = {
			  headers: { 'X-Custom-Header': 'lets try listening again' }
			}

			var local = "http://localhost:8888/ip-info.php",
					staging = "https://letstrylisteningagain.now.sh/ip-info.php",
					launched = "https://letstrylisteningagain.com/ip-info.php";

			needle("post", launched, data, options)
			.then(function(resp){	
		  	if(resp.body.length > 0){
		  		var fullResponse = JSON.parse(resp.body);
		  		//console.log("fullResponse: \n", fullResponse)
		  		ipAddress = fullResponse.ip;
		  		currentPosition = fullResponse.lat + ", " + fullResponse.long;

		  		if(ipAddress == "UNKNOWN"){
		  			geolocation.getCurrentPosition(function (err, position) {
						  if (err) throw err
						  console.log("\nLocation services:\n", position.coords.latitude + ", "+ position.coords.longitude)
							currentPosition = position.coords.latitude + ", " + position.coords.longitude;
							thisState.setState({ ipAddress: ipAddress, coords: currentPosition }); 
				  		thisState.props.props.ipAddress = ipAddress;
							thisState.props.props.coordinates = currentPosition;	
							// console.log("\n\n" + thisState.props)
						})
		  		}else{
		  			thisState.setState({ ipAddress: ipAddress, coords: currentPosition }); 
			  		thisState.props.props.ipAddress = ipAddress;
						thisState.props.props.coordinates = currentPosition;
		  		}
		  	}
			})
			.catch(function(err){
				console.log(err)
			  	ipAddress = "UNKNOWN";
		  		currentPosition = "40.7038431, -73.9892643";
		  		geolocation.getCurrentPosition(function (err, position) {
					  if (err) throw err
					  console.log("\n\nLocation services: ", position.coords.latitude + ", "+ position.coords.longitude, "\n\n")
						currentPosition = position.coords.latitude + ", " + position.coords.longitude;
						thisState.setState({ ipAddress: ipAddress, coords: currentPosition }); 
			  		thisState.props.props.ipAddress = ipAddress;
						thisState.props.props.coordinates = currentPosition;	
					})
			})
    }
    getIP(); // ** NEED TO TEST THIS IN WEBPACK LOCAL:8888 to see if it works! **
    

    this.timer = setInterval(() => {
	  	var startingTime = new Date(),
					hours = (startingTime.getHours().toString().length == 1) ? "0" + startingTime.getHours() : startingTime.getHours(),
					minutes = (startingTime.getMinutes().toString().length == 1) ? "0" + startingTime.getMinutes() : startingTime.getMinutes(),
					seconds = (startingTime.getSeconds().toString().length == 1) ? "0" + startingTime.getSeconds() : startingTime.getSeconds(),
					currentDate = hours + ":" + minutes + ":" + seconds,
					currentZone = moment.tz(startingTime, Intl.DateTimeFormat().resolvedOptions().timeZone).format('z');
      this.setState({ currentDate : [currentDate, currentZone] });
    }, 1000);

		
		// check length of input (if greater than 1, allow Link)
		var submitButton = document.getElementById("submit");
		var visibleContent = document.getElementById("visible-content");
		if(visibleContent.length >= 1){
			submitButton.classList.add("submit-ready");
		}else{
			submitButton.classList.remove("submit-ready");
		}

		var inputFocus = document.getElementById("input-focus");
		if(window.outerWidth > 768){ inputFocus.focus(); }

	}

	componentDidUpdate(prevProps, prevState) {

		// update fake input area
		var visibleContent = document.getElementById("visible-content");
		visibleContent.innerHTML = prevProps.props.questionQuery;
		var inputFocus = document.getElementById("input-focus"),
				inputArea = document.getElementsByClassName("input")[0],
				inputBody = document.getElementsByTagName("body")[0];
		if(window.outerWidth > 768){ inputFocus.focus();}

		//resize typing mechanism
		var qMark = document.getElementById("question-mark"),
				blinkingCursor = document.getElementById("blinking"),
				textWidth = visibleContent.offsetWidth,
				qWidth = qMark.offsetWidth,
				cursorWidth = blinkingCursor.offsetWidth,
				windowWidth = document.getElementsByTagName('body')[0].clientWidth,
				targetView = document.getElementById("input-view"),
				totalWidth = targetView.offsetWidth;

		if(totalWidth >= (windowWidth*0.9)){
			targetView.style.transform = "scale(" + ((windowWidth*0.9)/totalWidth) + ")";
		}else{
			targetView.style.transform = "scale(1)"
		}

		inputArea.onclick = function(){
			if(window.outerWidth > 768){ inputFocus.focus();}			
		}

		inputBody.onclick = function(){
			if(window.outerWidth > 768){ inputFocus.focus();}
		}
	}
}