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
keypoints['head'] = {x: 200, y: 150, rx:45, ry:50};
keypoints['hair'] = {x: 200, y: 140, rx:50, ry:60};

keypoints['leftEye'] = {x: 220, y: 140, r:8, r_neutral:8};
keypoints['rightEye'] = {x: 180, y: 140, r:8, r_neutral:8};
keypoints['leftEyebrowOuter'] = {x: 230, y: 125, y_neutral: 125};
keypoints['leftEyebrowCenter'] = {x: 220, y: 120, y_neutral: 120};
keypoints['leftEyebrowInner'] = {x: 210, y: 125, x_neutral: 210, y_neutral: 125};
keypoints['rightEyebrowOuter'] = {x: 170, y: 125, y_neutral: 125};
keypoints['rightEyebrowCenter'] = {x: 180, y: 120, y_neutral: 120};
keypoints['rightEyebrowInner'] = {x: 190, y: 125, x_neutral: 190, y_neutral: 125};
keypoints['leftLipCorner'] = {x: 220, y: 170, x_neutral: 220, y_neutral: 170};
keypoints['rightLipCorner'] = {x: 180, y: 170, x_neutral: 180, y_neutral: 170};
keypoints['upperLipControl'] = {x: 200, y: 170, y_neutral: 170};
keypoints['lowerLipControl'] = {x: 200, y: 175, y_neutral: 175};

keypoints['neckTop'] = {x: 200, y: 180};
keypoints['neckBottom'] = {x: 200, y: 250};

keypoints['chest'] = {x: 200, y: 280, rx:45, ry:50};
keypoints['waist'] = {x: 200, y: 320, rx:40, ry:45};
keypoints['hips'] = {x: 200, y: 370, rx:40, ry:45};

keypoints['leftShoulder'] = {x: 250, y: 250};
keypoints['leftElbow'] = {x: 260, y: 350, x_neutral: 260, y_neutral: 350};
keypoints['leftWrist'] = {x: 250, y: 450, x_neutral: 250, y_neutral: 450};
keypoints['rightShoulder'] = {x: 150, y: 250};
keypoints['rightElbow'] = {x: 140, y: 350, x_neutral: 140, y_neutral: 350};
keypoints['rightWrist'] = {x: 150, y: 450, x_neutral: 150, y_neutral: 450};

keypoints['leftHip'] = {x: 220, y: 360};
keypoints['leftKnee'] = {x: 230, y: 480, x_neutral: 230, y_neutral: 480};
keypoints['leftAnkle'] = {x: 220, y: 600, x_neutral: 220, y_neutral: 600};
keypoints['leftToes'] = {x: 230, y: 650, x_neutral: 230, y_neutral: 650};
keypoints['rightHip'] = {x: 180, y: 360};
keypoints['rightKnee'] = {x: 170, y: 480, x_neutral: 170, y_neutral: 480};
keypoints['rightAnkle'] = {x: 180, y: 600, x_neutral: 180, y_neutral: 600};
keypoints['rightToes'] = {x: 170, y: 650, x_neutral: 170, y_neutral: 650};


var mainTask = undefined;
var frameLength = 40;

var activeAnims = new Array();
activeAnims['mouth'] = {task: undefined, counter: 0};
activeAnims['upperLip'] = {task: undefined, counter: 0};
activeAnims['lipCorners'] = {task: undefined, counter: 0};
activeAnims['eyebrows'] = {task: undefined, counter: 0};
activeAnims['eyes'] = {task: undefined, counter: 0};


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
	{
		if(animName == "emot_happy")
		{
			animate('eyes', 'neutral');			
			animate('eyebrows', 'neutral');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'smile');
		}else if(animName == 'emot_sad')
		{
			animate('eyes', 'neutral');			
			animate('eyebrows', 'sadness');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'frown');			
		}else if(animName == 'emot_angry')
		{
			animate('eyes', 'neutral');			
			animate('eyebrows', 'anger');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'frown');			
		}else if(animName == 'emot_surprised')
		{
			animate('eyes', 'grow');			
			animate('eyebrows', 'surprise');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'neutral');			
		}else if(animName == 'emot_scared')
		{
			animate('eyes', 'grow');			
			animate('eyebrows', 'fear');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'fear');			
		}else if(animName == 'emot_disgusted')
		{
			animate('eyes', 'shrink');			
			animate('eyebrows', 'neutral');			
			animate('upperLip', 'raise');			
			animate('lipCorners', 'neutral');			
		}
		else console.log("unknown animation: "+animName);
	}else{
		animate('eyes', 'neutral');			
		animate('eyebrows', 'neutral');
		animate('upperLip', 'neutral');			
		animate('lipCorners', 'neutral');
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
	var svgContent = "<svg width=\"300\" height=\"700\">";
	
	//neck
	svgContent += drawNeck();	
	//head
	svgContent += drawHead();
	//brows
	svgContent += drawBrows();
	//eyes
	svgContent += drawEyes();
	//mouth
	svgContent += drawMouth();
	
	//arms
	svgContent += drawArms();
	//legs
	svgContent += drawLegs();	
	//torso
	svgContent += drawTorso();

	
	//close SVG element
	svgContent += "</svg>";
		
	bodyContainer.innerHTML = svgContent;	
}

function drawNeck(){
	var neckSVG = "<path class=\"agent-neck\" d=\""
				  +"M "+keypoints['neckTop'].x+" "+keypoints['neckTop'].y
				  +" L "+keypoints['neckBottom'].x+" "+keypoints['neckBottom'].y
				  +"\"/>";
	return neckSVG;
}

function drawHead(){
	var headSVG = "<ellipse class=\"agent-hair\" cx=\""+keypoints['hair'].x+"\" cy=\""+keypoints['hair'].y+"\" rx=\""+keypoints['hair'].rx+"\" ry=\""+keypoints['hair'].ry+"\"/>";
		headSVG += "<ellipse class=\"agent-head\" cx=\""+keypoints['head'].x+"\" cy=\""+keypoints['head'].y+"\" rx=\""+keypoints['head'].rx+"\" ry=\""+keypoints['head'].ry+"\"/>";
	return headSVG;
}

function drawBrows(){
	var browsSVG = "<path id=\"left-brow\" class=\"agent-brow\" d=\""
				 + "M "+keypoints['leftEyebrowOuter'].x+" "+keypoints['leftEyebrowOuter'].y
				 + " Q "+keypoints['leftEyebrowCenter'].x+" "+keypoints['leftEyebrowCenter'].y+" "+keypoints['leftEyebrowInner'].x+" "+keypoints['leftEyebrowInner'].y
				 + "\"/>"
	browsSVG += "<path id=\"right-brow\" class=\"agent-brow\" d=\""
				 + "M "+keypoints['rightEyebrowOuter'].x+" "+keypoints['rightEyebrowOuter'].y
				 + " Q "+keypoints['rightEyebrowCenter'].x+" "+keypoints['rightEyebrowCenter'].y+" "+keypoints['rightEyebrowInner'].x+" "+keypoints['rightEyebrowInner'].y
				 + "\"/>"
	return browsSVG;
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

function drawArms(){
	var armSVG = "<path class=\"agent-arm\" d=\""
				  +"M "+keypoints['leftShoulder'].x+" "+keypoints['leftShoulder'].y
				  +" L "+keypoints['leftElbow'].x+" "+keypoints['leftElbow'].y
				  +" L "+keypoints['leftWrist'].x+" "+keypoints['leftWrist'].y
				  +"\"/>";
	armSVG += "<path class=\"agent-arm\" d=\""
				  +"M "+keypoints['rightShoulder'].x+" "+keypoints['rightShoulder'].y
				  +" L "+keypoints['rightElbow'].x+" "+keypoints['rightElbow'].y
				  +" L "+keypoints['rightWrist'].x+" "+keypoints['rightWrist'].y
				  +"\"/>";
	return armSVG;
}


function drawLegs(){
	var legSVG = "<path class=\"agent-foot\" d=\""
				  +"M "+keypoints['leftAnkle'].x+" "+keypoints['leftAnkle'].y
				  +" L "+keypoints['leftToes'].x+" "+keypoints['leftToes'].y
				  +"\"/>";			  
	legSVG += "<path class=\"agent-foot\" d=\""
				  +"M "+keypoints['rightAnkle'].x+" "+keypoints['rightAnkle'].y
				  +" L "+keypoints['rightToes'].x+" "+keypoints['rightToes'].y
				  +"\"/>";			  

	legSVG += "<path class=\"agent-leg\" d=\""
				  +"M "+keypoints['leftHip'].x+" "+keypoints['leftHip'].y
				  +" L "+keypoints['leftKnee'].x+" "+keypoints['leftKnee'].y
				  +" L "+keypoints['leftAnkle'].x+" "+keypoints['leftAnkle'].y
				  +"\"/>";
	legSVG += "<path class=\"agent-leg\" d=\""
				  +"M "+keypoints['rightHip'].x+" "+keypoints['rightHip'].y
				  +" L "+keypoints['rightKnee'].x+" "+keypoints['rightKnee'].y
				  +" L "+keypoints['rightAnkle'].x+" "+keypoints['rightAnkle'].y
				  +"\"/>";
	legSVG += "<ellipse class=\"agent-hips\" cx=\""+keypoints['hips'].x+"\" cy=\""+keypoints['hips'].y+"\" rx=\""+keypoints['hips'].rx+"\" ry=\""+keypoints['hips'].ry+"\"/>";
	
	return legSVG;
}


function drawTorso(){
	var torsoSVG = "<path class=\"agent-sleeve\" d=\""
				  +"M "+keypoints['neckBottom'].x+" "+keypoints['neckBottom'].y
				  +" L "+keypoints['leftShoulder'].x+" "+keypoints['leftShoulder'].y
				  +"\"/>";
		torsoSVG += "<path class=\"agent-sleeve\" d=\""
				  +"M "+keypoints['neckBottom'].x+" "+keypoints['neckBottom'].y
				  +" L "+keypoints['rightShoulder'].x+" "+keypoints['rightShoulder'].y
				  +"\"/>";
		torsoSVG += "<ellipse class=\"agent-torso\" cx=\""+keypoints['waist'].x+"\" cy=\""+keypoints['waist'].y+"\" rx=\""+keypoints['waist'].rx+"\" ry=\""+keypoints['waist'].ry+"\"/>";
		torsoSVG += "<ellipse class=\"agent-torso\" cx=\""+keypoints['chest'].x+"\" cy=\""+keypoints['chest'].y+"\" rx=\""+keypoints['chest'].rx+"\" ry=\""+keypoints['chest'].ry+"\"/>";
		
	return torsoSVG;
}



//==========================================================================
// animations
//==========================================================================


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
	}else if(channel =='upperLip'){
		if(name == 'raise')
			activeAnims['upperLip'].task = setInterval(anim_upperLip_raise, frameLength);
		else if(name== 'neutral')
			resetAnim_upperLip();
	}else if(channel =='lipCorners'){
		if(name == 'smile')
			activeAnims['lipCorners'].task = setInterval(anim_lips_smile, frameLength);
		else if(name == 'frown')
			activeAnims['lipCorners'].task = setInterval(anim_lips_frown, frameLength);
		else if(name == 'fear')
			activeAnims['lipCorners'].task = setInterval(anim_lips_fear, frameLength);
		else if(name== 'neutral')
			resetAnim_lipCorners();
	}else if(channel =='eyebrows'){
		if(name == 'surprise')
			activeAnims['eyebrows'].task = setInterval(anim_brows_surprise, frameLength);
		else if(name == 'sadness')
			activeAnims['eyebrows'].task = setInterval(anim_brows_sadness, frameLength);
		else if(name == 'fear')
			activeAnims['eyebrows'].task = setInterval(anim_brows_fear, frameLength);
		else if(name == 'anger')
			activeAnims['eyebrows'].task = setInterval(anim_brows_anger, frameLength);
		else if(name=='neutral')
			resetAnim_eyebrows();
	}else if(channel =='eyes'){
		if(name == 'grow')
			activeAnims['eyes'].task = setInterval(anim_eyes_grow, frameLength);
		else if(name == 'shrink')
			activeAnims['eyes'].task = setInterval(anim_eyes_shrink, frameLength);
		else if(name== 'neutral')
			resetAnim_eyes();
	}
	
}


/*--------------------------------------------------------
   facial animations
---------------------------------------------------------*/

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

function anim_upperLip_raise(){
	var duration = 5;
	var step = 3;
	
	if(activeAnims['upperLip'].counter <= duration){
		keypoints['upperLipControl'].y = keypoints['upperLipControl'].y_neutral - activeAnims['upperLip'].counter*step;
	}else{
		//clear animation
		clearInterval(activeAnims['upperLip'].task);
		activeAnims['upperLip'].task = undefined;
	}
	activeAnims['upperLip'].counter++;
}

function anim_eyes_grow(){
	var duration = 3;
	var step = 1;
	
	if(activeAnims['eyes'].counter <= duration){
		keypoints['leftEye'].r = keypoints['leftEye'].r_neutral + activeAnims['eyes'].counter*step;
		keypoints['rightEye'].r = keypoints['rightEye'].r_neutral + activeAnims['eyes'].counter*step;
	}else{
		//clear animation
		clearInterval(activeAnims['eyes'].task);
		activeAnims['eyes'].task = undefined;
	}
	activeAnims['eyes'].counter++;
}

function anim_eyes_shrink(){
	var duration = 2;
	var step = 1;
	
	if(activeAnims['eyes'].counter <= duration){
		keypoints['leftEye'].r = keypoints['leftEye'].r_neutral - activeAnims['eyes'].counter*step;
		keypoints['rightEye'].r = keypoints['rightEye'].r_neutral - activeAnims['eyes'].counter*step;
	}else{
		//clear animation
		clearInterval(activeAnims['eyes'].task);
		activeAnims['eyes'].task = undefined;
	}
	activeAnims['eyes'].counter++;
}

function anim_lips_smile(){
	var duration = 8;
	var step_x = 1;
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

function anim_lips_fear(){
	var duration = 8;
	var step_x = 1;
	var step_y = 1;
	
	if(activeAnims['lipCorners'].counter <= duration){
		keypoints['leftLipCorner'].x = keypoints['leftLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		keypoints['leftLipCorner'].y = keypoints['leftLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		keypoints['rightLipCorner'].x = keypoints['rightLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		keypoints['rightLipCorner'].y = keypoints['rightLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		
	}else{
		//clear animation
		clearInterval(activeAnims['lipCorners'].task);
		activeAnims['lipCorners'].task = undefined;
	}
	activeAnims['lipCorners'].counter++;
}

function anim_brows_surprise(){
	var duration = 8;
	var step = 2;
	
	if(activeAnims['eyebrows'].counter <= duration){
		keypoints['leftEyebrowOuter'].y = keypoints['leftEyebrowOuter'].y_neutral - activeAnims['eyebrows'].counter*step;	
		keypoints['leftEyebrowCenter'].y = keypoints['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step;
		keypoints['leftEyebrowInner'].y = keypoints['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step;
		
		keypoints['rightEyebrowOuter'].y = keypoints['rightEyebrowOuter'].y_neutral - activeAnims['eyebrows'].counter*step;	
		keypoints['rightEyebrowCenter'].y = keypoints['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step;
		keypoints['rightEyebrowInner'].y = keypoints['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step;		
	}else{
		//clear animation
		clearInterval(activeAnims['eyebrows'].task);
		activeAnims['eyebrows'].task = undefined;
	}
	activeAnims['eyebrows'].counter++;
}

function anim_brows_sadness(){
	var duration = 8;
	var step_center = 1;
	var step_inner = 2;
	
	if(activeAnims['eyebrows'].counter <= duration){
		keypoints['leftEyebrowCenter'].y = keypoints['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		keypoints['leftEyebrowInner'].y = keypoints['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;
		
		keypoints['rightEyebrowCenter'].y = keypoints['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		keypoints['rightEyebrowInner'].y = keypoints['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;	
	}else{
		//clear animation
		clearInterval(activeAnims['eyebrows'].task);
		activeAnims['eyebrows'].task = undefined;
	}
	activeAnims['eyebrows'].counter++;
}

function anim_brows_fear(){
	var duration = 8;
	var step_center = 1;
	var step_inner = 2;
	var step_x = 1;
	
	if(activeAnims['eyebrows'].counter <= duration){
		keypoints['leftEyebrowCenter'].y = keypoints['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		keypoints['leftEyebrowInner'].x = keypoints['leftEyebrowInner'].x_neutral - activeAnims['eyebrows'].counter*step_x;
		keypoints['leftEyebrowInner'].y = keypoints['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;
		
		keypoints['rightEyebrowCenter'].y = keypoints['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		keypoints['rightEyebrowInner'].x = keypoints['rightEyebrowInner'].x_neutral + activeAnims['eyebrows'].counter*step_x;
		keypoints['rightEyebrowInner'].y = keypoints['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;	
	}else{
		//clear animation
		clearInterval(activeAnims['eyebrows'].task);
		activeAnims['eyebrows'].task = undefined;
	}
	activeAnims['eyebrows'].counter++;
}

function anim_brows_anger(){
	var duration = 8;
	var step_center = 1;
	var step_inner = 2;
	var step_x = 1;
	
	if(activeAnims['eyebrows'].counter <= duration){
		keypoints['leftEyebrowCenter'].y = keypoints['leftEyebrowCenter'].y_neutral + activeAnims['eyebrows'].counter*step_center;
		keypoints['leftEyebrowInner'].x = keypoints['leftEyebrowInner'].x_neutral - activeAnims['eyebrows'].counter*step_x;
		keypoints['leftEyebrowInner'].y = keypoints['leftEyebrowInner'].y_neutral + activeAnims['eyebrows'].counter*step_inner;
		
		keypoints['rightEyebrowCenter'].y = keypoints['rightEyebrowCenter'].y_neutral + activeAnims['eyebrows'].counter*step_center;
		keypoints['rightEyebrowInner'].x = keypoints['rightEyebrowInner'].x_neutral + activeAnims['eyebrows'].counter*step_x;
		keypoints['rightEyebrowInner'].y = keypoints['rightEyebrowInner'].y_neutral + activeAnims['eyebrows'].counter*step_inner;	
	}else{
		//clear animation
		clearInterval(activeAnims['eyebrows'].task);
		activeAnims['eyebrows'].task = undefined;
	}
	activeAnims['eyebrows'].counter++;
}

/*--------------------------------------------------------
   neutral animations
---------------------------------------------------------*/

function resetAnim_mouth(){
	keypoints['lowerLipControl'].y = keypoints['lowerLipControl'].y_neutral;
}

function resetAnim_upperLip(){
	keypoints['upperLipControl'].y = keypoints['upperLipControl'].y_neutral;
}

function resetAnim_lipCorners(){
	keypoints['leftLipCorner'].x = keypoints['leftLipCorner'].x_neutral;
	keypoints['leftLipCorner'].y = keypoints['leftLipCorner'].y_neutral;
	keypoints['rightLipCorner'].x = keypoints['rightLipCorner'].x_neutral;
	keypoints['rightLipCorner'].y = keypoints['rightLipCorner'].y_neutral;
}

function resetAnim_eyebrows(){
	keypoints['leftEyebrowOuter'].y = keypoints['leftEyebrowOuter'].y_neutral;
	keypoints['leftEyebrowCenter'].y = keypoints['leftEyebrowCenter'].y_neutral;
	keypoints['leftEyebrowInner'].x = keypoints['leftEyebrowInner'].x_neutral;
	keypoints['leftEyebrowInner'].y = keypoints['leftEyebrowInner'].y_neutral;
	keypoints['rightEyebrowOuter'].y = keypoints['rightEyebrowOuter'].y_neutral;
	keypoints['rightEyebrowCenter'].y = keypoints['rightEyebrowCenter'].y_neutral;
	keypoints['rightEyebrowInner'].x = keypoints['rightEyebrowInner'].x_neutral;
	keypoints['rightEyebrowInner'].y = keypoints['rightEyebrowInner'].y_neutral;
}

function resetAnim_eyes(){
	keypoints['leftEye'].r = keypoints['leftEye'].r_neutral;
	keypoints['rightEye'].r = keypoints['rightEye'].r_neutral;
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
