//containers have routes inside
import { h, render } from 'preact';
import Application from 'Root/components/Application';
import {TweenMax} from "gsap/TweenMax";


const thisValue = ""; // start out empty

render(<Application questionQuery={ thisValue } />, document.getElementById('root'));

// basic interaction (tween max etc.)
window.onkeypress = function(e){
	//console.log("keypress: ", e.key)
}

var about = document.getElementById("about");
var open = false;

about.onclick = function(){
	
	var footer = document.getElementsByTagName('footer')[0],
			height = footer.clientHeight - 60,
			button = document.getElementsByClassName("button")[0],
			about  = document.getElementById("about-content"),
			meta  = document.getElementById("meta-info"),
			aboutButton = document.getElementById("about");

	if(!open){
		TweenMax.to(footer, 0.5, {y: -1*height})
		TweenMax.to(button, 0.5, {y: -1*height})
		if(meta) { TweenMax.to(meta, 0.5, {y: -1*height}) }
		TweenMax.to(about, 0.5, {opacity: 1})
		open = true;
		aboutButton.innerHTML = 'X';
		footer.style.overflow = "scroll";
	}else{
		TweenMax.to(footer, 0.5, {y: 0})
		TweenMax.to(button, 0.5, {y: 0})
		if(meta) { TweenMax.to(meta, 0.5, {y: 0}) }
		TweenMax.to(about, 0.5, {opacity: 0})
		open = false;
		footer.style.overflow = "hidden";
		aboutButton.innerHTML = 'ABOUT';
		var inputFocus = document.getElementById("input-focus");
		if(inputFocus) { inputFocus.focus(); }
	}
}
