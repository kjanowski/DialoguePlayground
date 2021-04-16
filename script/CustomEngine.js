/*
	Copyright Kathrin Janowski (https://www.kathrinjanowski.com/en/home), 2021.
  
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

//=====================================================================================================
// global variables
//=====================================================================================================

// the div element that will hold the agent's visible body
var bodyContainer = undefined;

// the parameters to use for speech output
var voice = {};
voice.index = 0;
voice.language = 'de';
voice.volume = 1.0;	//from 0 to 1
voice.rate = 1.0;	//from 0.1 to 10
voice.pitch = 1.0;	//from 0 to 2



//=====================================================================================================
// initialization
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Stores the reference to the body display container, then creates the agent.
//-------------------------------------------------------------------------------------
function initAgent(targetContainer)
{
	window.onload =  () => {
		bodyContainer = targetContainer;
		createBody();
	};
}

//=====================================================================================================
// wrapper for the agent's API
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Plays the requested animation on the agent.
//-------------------------------------------------------------------------------------
function playAnimation(animName){
	if(animName.length>0)
	try{
		console.log("Can't play animations yet.")
	}catch(error)
	{
		console.log("Could not play animation \""+animName+"\": "+error);
	}
}

//-------------------------------------------------------------------------------------
// Makes the agent speak the requested sentence.
//-------------------------------------------------------------------------------------
function speak(utterance)
{
	if('speechSynthesis' in window)
	{
		var msg = new SpeechSynthesisUtterance();
		msg.text = utterance;
		msg.lang = voice.language;
		msg.volume = voice.volume;
		msg.rate = voice.rate;
		msg.pitch = voice.pitch;
		
		var voices = window.speechSynthesis.getVoices(); 
		console.log("#voices: "+voices.length);
		
		msg.voice = voices[voice.index];
		
		window.speechSynthesis.speak(msg);
	}
	else{
		console.log("Speech synthesis not supported by this browser.")
	}
}

//-------------------------------------------------------------------------------------
// Makes the agent stop speaking the current sentence.
//-------------------------------------------------------------------------------------
function stopSpeech(){
	if('speechSynthesis' in window)
	{
		window.speechSynthesis.cancel();
	}
	else{
		console.log("Speech synthesis not supported by this browser.")
	}
}


//=====================================================================================================
// the agent itself
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Assembles the agent's body from SVG elements.
//-------------------------------------------------------------------------------------
function createBody(){
	var svgContent = "<svg width=\"300\" height=\"600\">";
	
	//head
	svgContent += "<circle cx=\"150\" cy=\"150\" r=\"50\" fill=\"yellow\"/>";
	//eyes
	svgContent += "<circle cx=\"130\" cy=\"130\" r=\"10\" fill=\"black\"/>";
	svgContent += "<circle cx=\"170\" cy=\"130\" r=\"10\" fill=\"black\"/>";
	
	//close SVG element
	svgContent += "</svg>";
		
	bodyContainer.innerHTML = svgContent;	
}


//-------------------------------------------------------------------------------------
// Creates a dropdown for choosing one of the available voices.
//-------------------------------------------------------------------------------------
//TODO: when should I call this? On load, the voices are not available yet...
function createVoiceSelector(){
	var dropdown = "";
	if('speechSynthesis' in window)
	{
		var voices = window.speechSynthesis.getVoices();
		console.log("#voices: "+voices.length);
		
		dropdown = "<select id=\"voiceSelect\">";
		var i;
		for(i=0; i<voices.length; i++){
			dropdown += "<option value=\""+i+"\">"+voices[i].name+"</option>";	
		}
		dropdown +="</select>";
	}

	return dropdown;
}
