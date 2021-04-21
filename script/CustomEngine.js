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

var keypoints = new Array();
keypoints['head'] = {x: 150, y: 150, r:50};
keypoints['leftEye'] = {x: 170, y: 140, r:10};
keypoints['rightEye'] = {x: 130, y: 140, r:10};
keypoints['leftLipCorner'] = {x: 170, y: 170, x_neutral: 170, y_neutral: 170};
keypoints['rightLipCorner'] = {x: 130, y: 170, x_neutral: 130, y_neutral: 170};
keypoints['upperLipControl'] = {x: 150, y: 170};
keypoints['lowerLipControl'] = {x: 150, y: 175, y_neutral: 175};

var mainTask = undefined;
var frameLength = 40;

var activeAnims = new Array();
activeAnims['mouth'] = {task: undefined, counter: 0};
activeAnims['lipCorners'] = {task: undefined, counter: 0};


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
		if(animName == "emot_happy")
		{
			animate('lipCorners', 'smile');
		}else if(animName == 'emot_sad')
		{
			animate('lipCorners', 'frown');			
		}
		else console.log("unknown animation: "+animName);
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
	//update voice
	var voiceSelect = document.getElementById("voiceSelect");
	if (voiceSelect != undefined){
		voice.index = voiceSelect.value;
	}
	
	if('speechSynthesis' in window)
	{
		animate('mouth', 'speak');
		
		var msg = new SpeechSynthesisUtterance();
		msg.text = utterance;
		msg.lang = voice.language;
		msg.volume = voice.volume;
		msg.rate = voice.rate;
		msg.pitch = voice.pitch;
		msg.onend = function(){
				animate('mouth', 'silent');
			};
		
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
		animate('mouth', 'silent');
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
	mainTask = setInterval(drawBody, frameLength);
}

function drawBody(){
	var svgContent = "<svg width=\"300\" height=\"600\">";
	
	//head
	svgContent += drawHead();
	//eyes
	svgContent += drawEyes();
	//mouth
	svgContent += drawMouth();
	
	//close SVG element
	svgContent += "</svg>";
		
	bodyContainer.innerHTML = svgContent;	
}

function drawHead(){
	var headSVG = "<circle class=\"agent-head\" cx=\""+keypoints['head'].x+"\" cy=\""+keypoints['head'].y+"\" r=\""+keypoints['head'].r+"\"/>";
	return headSVG;
}


function drawEyes(){
	var eyesSVG = "<circle id=\"left-eye\" class=\"agent-eye\" cx=\""+keypoints['leftEye'].x+"\" cy=\""+keypoints['leftEye'].y+"\" r=\""+keypoints['leftEye'].r+"\"/>"
				+ "<circle id=\"right-eye\" class=\"agent-eye\" cx=\""+keypoints['rightEye'].x+"\" cy=\""+keypoints['rightEye'].y+"\" r=\""+keypoints['rightEye'].r+"\"/>";
	return eyesSVG;
}

function drawMouth(){
	var mouthSVG = "<path id=\"mouth\" class=\"agent-mouth\" ";
	mouthSVG += "d=\"M "+keypoints['rightLipCorner'].x+" "+keypoints['rightLipCorner'].y
				   +" Q "+keypoints['upperLipControl'].x+" "+keypoints['upperLipControl'].y+" "+keypoints['leftLipCorner'].x+" "+keypoints['leftLipCorner'].y
				   +" Q "+keypoints['lowerLipControl'].x+" "+keypoints['lowerLipControl'].y+" "+keypoints['rightLipCorner'].x+" "+keypoints['rightLipCorner'].y
	mouthSVG += "\"/>";
	return mouthSVG;
}






function animate(channel, name){
	if(activeAnims[channel] == undefined)
	{
		console.log("unknown channel: "+channel);
		return;
	}
	
	console.log("animate: "+channel+", "+name);
	if(activeAnims[channel].task != undefined)
	{
		clearInterval(activeAnims[channel].task);
		activeAnims[channel].task = undefined;
	}

	activeAnims[channel].counter = 0;
	if(channel == 'mouth')
	{
		if(name == 'speak'){
			console.log("starting animation: speak");
			activeAnims['mouth'].task = setInterval(anim_mouth_speak, frameLength);
		}else if(name == 'silent')
			resetAnim_mouth();
	}else if(channel =='lipCorners'){
		if(name == 'smile')
			activeAnims['lipCorners'].task = setInterval(anim_lips_smile, frameLength);
		else if(name == 'frown')
			activeAnims['lipCorners'].task = setInterval(anim_lips_frown, frameLength);
		else resetAnim_lipCorners();
	}
	
}


function anim_mouth_speak(){
	var duration = 16;
	var step = 2;
	
	if(activeAnims['mouth'].counter <= duration/2){
		keypoints['lowerLipControl'].y = keypoints['lowerLipControl'].y_neutral + activeAnims['mouth'].counter*step;
	}else if(activeAnims['mouth'].counter <= duration){
		keypoints['lowerLipControl'].y = keypoints['lowerLipControl'].y_neutral + (duration - activeAnims['mouth'].counter)*step;
		if(activeAnims['mouth'].counter == duration)
			activeAnims['mouth'].counter = -1;
	}
	activeAnims['mouth'].counter++;
}


function anim_lips_smile(){
	var duration = 8;
	var step_x = 2;
	var step_y = 1;
	
	if(activeAnims['lipCorners'].counter <= duration){
		keypoints['leftLipCorner'].x = keypoints['leftLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		keypoints['leftLipCorner'].y = keypoints['leftLipCorner'].y_neutral - activeAnims['lipCorners'].counter*step_y;
		keypoints['rightLipCorner'].x = keypoints['rightLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		keypoints['rightLipCorner'].y = keypoints['rightLipCorner'].y_neutral - activeAnims['lipCorners'].counter*step_y;
		
	}else{
		//clear animation
		clearInterval(activeAnims['lipCorners'].task);
		activeAnims['lipCorners'].task = undefined;
	}
	activeAnims['lipCorners'].counter++;
}

function anim_lips_frown(){
	var duration = 8;
	var step_x = 1;
	var step_y = 1;
	
	if(activeAnims['lipCorners'].counter <= duration){
		keypoints['leftLipCorner'].x = keypoints['leftLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		keypoints['leftLipCorner'].y = keypoints['leftLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		keypoints['rightLipCorner'].x = keypoints['rightLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		keypoints['rightLipCorner'].y = keypoints['rightLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		
	}else{
		//clear animation
		clearInterval(activeAnims['lipCorners'].task);
		activeAnims['lipCorners'].task = undefined;
	}
	activeAnims['lipCorners'].counter++;
}


function resetAnim_mouth(){
	keypoints['lowerLipControl'].y = keypoints['lowerLipControl'].y_neutral;
}


function resetAnim_lipCorners(){
	keypoints['leftLipCorner'].x = keypoints['leftLipCorner'].x_neutral;
	keypoints['leftLipCorner'].y = keypoints['leftLipCorner'].y_neutral;
	keypoints['rightLipCorner'].x = keypoints['rightLipCorner'].x_neutral;
	keypoints['rightLipCorner'].y = keypoints['rightLipCorner'].y_neutral;
}

//-------------------------------------------------------------------------------------
// Creates a dropdown for choosing one of the available voices.
//-------------------------------------------------------------------------------------
function updateVoiceSelect(){
	if('speechSynthesis' in window)
	{
		animate('mouth', 'speak');
		
		var msg = new SpeechSynthesisUtterance();
		msg.text = "Lade Stimmen.";
		msg.onend = function(){
			var section = document.getElementById("voiceSelection")
	
			var dropdown = "";
			if('speechSynthesis' in window)
			{
				var voices = window.speechSynthesis.getVoices();
				console.log("#voices: "+voices.length);
				
				dropdown = "<select id=\"voiceSelect\" value=\"0\">";
				var i;
				for(i=0; i<voices.length; i++){
					dropdown += "<option value=\""+i+"\">"+voices[i].name+"</option>";	
				}
				dropdown +="</select>";
			}

			section.innerHTML = dropdown;
			
			animate('mouth', 'silent');
		};
		
		window.speechSynthesis.speak(msg);	
	}
	else{
		console.log("Speech synthesis not supported by this browser.")
	}
}
