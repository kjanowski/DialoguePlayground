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

var agentBody = new Array();
agentBody['head'] = {x: 200, y: 150, rx:45, ry:50};
agentBody['hair'] = {x: 200, y: 140, rx:50, ry:60};

agentBody['leftEye'] = {x: 220, y: 140, r:8, r_neutral:8};
agentBody['rightEye'] = {x: 180, y: 140, r:8, r_neutral:8};
agentBody['leftEyebrowOuter'] = {x: 230, y: 125, y_neutral: 125};
agentBody['leftEyebrowCenter'] = {x: 220, y: 120, y_neutral: 120};
agentBody['leftEyebrowInner'] = {x: 210, y: 125, x_neutral: 210, y_neutral: 125};
agentBody['rightEyebrowOuter'] = {x: 170, y: 125, y_neutral: 125};
agentBody['rightEyebrowCenter'] = {x: 180, y: 120, y_neutral: 120};
agentBody['rightEyebrowInner'] = {x: 190, y: 125, x_neutral: 190, y_neutral: 125};
agentBody['leftLipCorner'] = {x: 220, y: 170, x_neutral: 220, y_neutral: 170};
agentBody['rightLipCorner'] = {x: 180, y: 170, x_neutral: 180, y_neutral: 170};
agentBody['upperLipControl'] = {x: 200, y: 170, y_neutral: 170};
agentBody['lowerLipControl'] = {x: 200, y: 175, y_neutral: 175};

agentBody['neckTop'] = {x: 200, y: 180};
agentBody['neckBottom'] = {x: 200, y: 250};

agentBody['chest'] = {x: 200, y: 280, rx:45, ry:50};
agentBody['waist'] = {x: 200, y: 320, rx:40, ry:45};
agentBody['hips'] = {x: 200, y: 370, rx:40, ry:45};

agentBody['leftShoulder'] = {x: 250, y: 250};
agentBody['leftUpperArm'] = {length: 100, angle: 85, angle_neutral: 85};
agentBody['leftLowerArm'] = {length: 90, angle: 95, angle_neutral: 95};

agentBody['rightShoulder'] = {x: 150, y: 250};
agentBody['rightUpperArm'] = {length: 100, angle: 95, angle_neutral: 95};
agentBody['rightLowerArm'] = {length: 90, angle: 85, angle_neutral: 85};

agentBody['leftHip'] = {x: 220, y: 360};
agentBody['leftKnee'] = {x: 230, y: 480, x_neutral: 230, y_neutral: 480};
agentBody['leftAnkle'] = {x: 220, y: 600, x_neutral: 220, y_neutral: 600};
agentBody['leftToes'] = {x: 230, y: 650, x_neutral: 230, y_neutral: 650};
agentBody['rightHip'] = {x: 180, y: 360};
agentBody['rightKnee'] = {x: 170, y: 480, x_neutral: 170, y_neutral: 480};
agentBody['rightAnkle'] = {x: 180, y: 600, x_neutral: 180, y_neutral: 600};
agentBody['rightToes'] = {x: 170, y: 650, x_neutral: 170, y_neutral: 650};


var mainTask = undefined;
var frameLength = 40;

var activeAnims = new Array();
activeAnims['mouth'] = {task: undefined, counter: 0};
activeAnims['upperLip'] = {task: undefined, counter: 0};
activeAnims['lipCorners'] = {task: undefined, counter: 0};
activeAnims['eyebrows'] = {task: undefined, counter: 0};
activeAnims['eyes'] = {task: undefined, counter: 0};
activeAnims['arms'] = {task: undefined, counter: 0};


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
		}else if(animName == 'emot_neutral')
		{
			animate('eyes', 'neutral');			
			animate('eyebrows', 'neutral');			
			animate('upperLip', 'neutral');			
			animate('lipCorners', 'neutral');			
		}else if(animName == 'arms_wave'){
			animate('arms','wave');
		}else if(animName == 'arms_onHips'){
			animate('arms','onHips');
		}else if(animName == 'arms_cross'){
			animate('arms','cross');
		}else if(animName == 'arms_neutral'){
			animate('arms','neutral');
		}
		
		else console.log("unknown animation: "+animName);
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
				  +"M "+agentBody['neckTop'].x+" "+agentBody['neckTop'].y
				  +" L "+agentBody['neckBottom'].x+" "+agentBody['neckBottom'].y
				  +"\"/>";
	return neckSVG;
}

function drawHead(){
	var headSVG = "<ellipse class=\"agent-hair\" cx=\""+agentBody['hair'].x+"\" cy=\""+agentBody['hair'].y+"\" rx=\""+agentBody['hair'].rx+"\" ry=\""+agentBody['hair'].ry+"\"/>";
		headSVG += "<ellipse class=\"agent-head\" cx=\""+agentBody['head'].x+"\" cy=\""+agentBody['head'].y+"\" rx=\""+agentBody['head'].rx+"\" ry=\""+agentBody['head'].ry+"\"/>";
	return headSVG;
}

function drawBrows(){
	var browsSVG = "<path id=\"left-brow\" class=\"agent-brow\" d=\""
				 + "M "+agentBody['leftEyebrowOuter'].x+" "+agentBody['leftEyebrowOuter'].y
				 + " Q "+agentBody['leftEyebrowCenter'].x+" "+agentBody['leftEyebrowCenter'].y+" "+agentBody['leftEyebrowInner'].x+" "+agentBody['leftEyebrowInner'].y
				 + "\"/>"
	browsSVG += "<path id=\"right-brow\" class=\"agent-brow\" d=\""
				 + "M "+agentBody['rightEyebrowOuter'].x+" "+agentBody['rightEyebrowOuter'].y
				 + " Q "+agentBody['rightEyebrowCenter'].x+" "+agentBody['rightEyebrowCenter'].y+" "+agentBody['rightEyebrowInner'].x+" "+agentBody['rightEyebrowInner'].y
				 + "\"/>"
	return browsSVG;
}

function drawEyes(){
	var eyesSVG = "<circle id=\"left-eye\" class=\"agent-eye\" cx=\""+agentBody['leftEye'].x+"\" cy=\""+agentBody['leftEye'].y+"\" r=\""+agentBody['leftEye'].r+"\"/>"
				+ "<circle id=\"right-eye\" class=\"agent-eye\" cx=\""+agentBody['rightEye'].x+"\" cy=\""+agentBody['rightEye'].y+"\" r=\""+agentBody['rightEye'].r+"\"/>";
	return eyesSVG;
}

function drawMouth(){
	var mouthSVG = "<path id=\"mouth\" class=\"agent-mouth\" ";
	mouthSVG += "d=\"M "+agentBody['rightLipCorner'].x+" "+agentBody['rightLipCorner'].y
				   +" Q "+agentBody['upperLipControl'].x+" "+agentBody['upperLipControl'].y+" "+agentBody['leftLipCorner'].x+" "+agentBody['leftLipCorner'].y
				   +" Q "+agentBody['lowerLipControl'].x+" "+agentBody['lowerLipControl'].y+" "+agentBody['rightLipCorner'].x+" "+agentBody['rightLipCorner'].y
	mouthSVG += "\"/>";
	return mouthSVG;
}

function drawArms(){
	var leftUpperArmRad = agentBody['leftUpperArm'].angle/180*Math.PI;
	var leftElbow = {
						x: agentBody['leftShoulder'].x + Math.cos(leftUpperArmRad)*agentBody['leftUpperArm'].length,
						y: agentBody['leftShoulder'].y + Math.sin(leftUpperArmRad)*agentBody['leftUpperArm'].length
					};
	var leftLowerArmRad = agentBody['leftLowerArm'].angle/180*Math.PI;
	var leftWrist = {
						x: leftElbow.x + Math.cos(leftLowerArmRad)*agentBody['leftLowerArm'].length,
						y: leftElbow.y + Math.sin(leftLowerArmRad)*agentBody['leftLowerArm'].length
					};
					
	
	var rightUpperArmRad = agentBody['rightUpperArm'].angle/180*Math.PI;
	var rightElbow = {
						x: agentBody['rightShoulder'].x + Math.cos(rightUpperArmRad)*agentBody['rightUpperArm'].length,
						y: agentBody['rightShoulder'].y + Math.sin(rightUpperArmRad)*agentBody['rightUpperArm'].length
					};
	var rightLowerArmRad = agentBody['rightLowerArm'].angle/180*Math.PI;
	var rightWrist = {
						x: rightElbow.x + Math.cos(rightLowerArmRad)*agentBody['rightLowerArm'].length,
						y: rightElbow.y + Math.sin(rightLowerArmRad)*agentBody['rightLowerArm'].length
					};
	
	
	var armSVG = "<path class=\"agent-arm\" d=\""
				  +"M "+agentBody['leftShoulder'].x+" "+agentBody['leftShoulder'].y
				  +" L "+leftElbow.x+" "+leftElbow.y
				  +" L "+leftWrist.x+" "+leftWrist.y
				  +"\"/>";
	armSVG += "<path class=\"agent-arm\" d=\""
				  +"M "+agentBody['rightShoulder'].x+" "+agentBody['rightShoulder'].y
				  +" L "+rightElbow.x+" "+rightElbow.y
				  +" L "+rightWrist.x+" "+rightWrist.y
				  +"\"/>";
	return armSVG;
}


function drawLegs(){
	var legSVG = "<path class=\"agent-foot\" d=\""
				  +"M "+agentBody['leftAnkle'].x+" "+agentBody['leftAnkle'].y
				  +" L "+agentBody['leftToes'].x+" "+agentBody['leftToes'].y
				  +"\"/>";			  
	legSVG += "<path class=\"agent-foot\" d=\""
				  +"M "+agentBody['rightAnkle'].x+" "+agentBody['rightAnkle'].y
				  +" L "+agentBody['rightToes'].x+" "+agentBody['rightToes'].y
				  +"\"/>";			  

	legSVG += "<path class=\"agent-leg\" d=\""
				  +"M "+agentBody['leftHip'].x+" "+agentBody['leftHip'].y
				  +" L "+agentBody['leftKnee'].x+" "+agentBody['leftKnee'].y
				  +" L "+agentBody['leftAnkle'].x+" "+agentBody['leftAnkle'].y
				  +"\"/>";
	legSVG += "<path class=\"agent-leg\" d=\""
				  +"M "+agentBody['rightHip'].x+" "+agentBody['rightHip'].y
				  +" L "+agentBody['rightKnee'].x+" "+agentBody['rightKnee'].y
				  +" L "+agentBody['rightAnkle'].x+" "+agentBody['rightAnkle'].y
				  +"\"/>";
	legSVG += "<ellipse class=\"agent-hips\" cx=\""+agentBody['hips'].x+"\" cy=\""+agentBody['hips'].y+"\" rx=\""+agentBody['hips'].rx+"\" ry=\""+agentBody['hips'].ry+"\"/>";
	
	return legSVG;
}


function drawTorso(){
	var torsoSVG = "<path class=\"agent-sleeve\" d=\""
				  +"M "+agentBody['neckBottom'].x+" "+agentBody['neckBottom'].y
				  +" L "+agentBody['leftShoulder'].x+" "+agentBody['leftShoulder'].y
				  +"\"/>";
		torsoSVG += "<path class=\"agent-sleeve\" d=\""
				  +"M "+agentBody['neckBottom'].x+" "+agentBody['neckBottom'].y
				  +" L "+agentBody['rightShoulder'].x+" "+agentBody['rightShoulder'].y
				  +"\"/>";
		torsoSVG += "<ellipse class=\"agent-torso\" cx=\""+agentBody['waist'].x+"\" cy=\""+agentBody['waist'].y+"\" rx=\""+agentBody['waist'].rx+"\" ry=\""+agentBody['waist'].ry+"\"/>";
		torsoSVG += "<ellipse class=\"agent-torso\" cx=\""+agentBody['chest'].x+"\" cy=\""+agentBody['chest'].y+"\" rx=\""+agentBody['chest'].rx+"\" ry=\""+agentBody['chest'].ry+"\"/>";
		
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
	}else if(channel =='arms'){
		if(name == 'wave')
			activeAnims['arms'].task = setInterval(anim_arms_wave, frameLength);
		else if(name == 'onHips')
			activeAnims['arms'].task = setInterval(anim_arms_onHips, frameLength);
		else if(name == 'cross')
			activeAnims['arms'].task = setInterval(anim_arms_cross, frameLength);
		else if (name=='neutral')
			resetAnim_arms();
	}
	
}


/*--------------------------------------------------------
   facial animations
---------------------------------------------------------*/

function anim_mouth_speak(){
	var duration = 16;
	var step = 2;
	
	if(activeAnims['mouth'].counter <= duration/2){
		agentBody['lowerLipControl'].y = agentBody['lowerLipControl'].y_neutral + activeAnims['mouth'].counter*step;
	}else if(activeAnims['mouth'].counter <= duration){
		agentBody['lowerLipControl'].y = agentBody['lowerLipControl'].y_neutral + (duration - activeAnims['mouth'].counter)*step;
		if(activeAnims['mouth'].counter == duration)
			activeAnims['mouth'].counter = -1;
	}
	activeAnims['mouth'].counter++;
}

function anim_upperLip_raise(){
	var duration = 5;
	var step = 3;
	
	if(activeAnims['upperLip'].counter <= duration){
		agentBody['upperLipControl'].y = agentBody['upperLipControl'].y_neutral - activeAnims['upperLip'].counter*step;
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
		agentBody['leftEye'].r = agentBody['leftEye'].r_neutral + activeAnims['eyes'].counter*step;
		agentBody['rightEye'].r = agentBody['rightEye'].r_neutral + activeAnims['eyes'].counter*step;
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
		agentBody['leftEye'].r = agentBody['leftEye'].r_neutral - activeAnims['eyes'].counter*step;
		agentBody['rightEye'].r = agentBody['rightEye'].r_neutral - activeAnims['eyes'].counter*step;
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
		agentBody['leftLipCorner'].x = agentBody['leftLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		agentBody['leftLipCorner'].y = agentBody['leftLipCorner'].y_neutral - activeAnims['lipCorners'].counter*step_y;
		agentBody['rightLipCorner'].x = agentBody['rightLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		agentBody['rightLipCorner'].y = agentBody['rightLipCorner'].y_neutral - activeAnims['lipCorners'].counter*step_y;
		
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
		agentBody['leftLipCorner'].x = agentBody['leftLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		agentBody['leftLipCorner'].y = agentBody['leftLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		agentBody['rightLipCorner'].x = agentBody['rightLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		agentBody['rightLipCorner'].y = agentBody['rightLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		
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
		agentBody['leftLipCorner'].x = agentBody['leftLipCorner'].x_neutral + activeAnims['lipCorners'].counter*step_x;
		agentBody['leftLipCorner'].y = agentBody['leftLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		agentBody['rightLipCorner'].x = agentBody['rightLipCorner'].x_neutral - activeAnims['lipCorners'].counter*step_x;
		agentBody['rightLipCorner'].y = agentBody['rightLipCorner'].y_neutral + activeAnims['lipCorners'].counter*step_y;
		
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
		agentBody['leftEyebrowOuter'].y = agentBody['leftEyebrowOuter'].y_neutral - activeAnims['eyebrows'].counter*step;	
		agentBody['leftEyebrowCenter'].y = agentBody['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step;
		agentBody['leftEyebrowInner'].y = agentBody['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step;
		
		agentBody['rightEyebrowOuter'].y = agentBody['rightEyebrowOuter'].y_neutral - activeAnims['eyebrows'].counter*step;	
		agentBody['rightEyebrowCenter'].y = agentBody['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step;
		agentBody['rightEyebrowInner'].y = agentBody['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step;		
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
		agentBody['leftEyebrowCenter'].y = agentBody['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		agentBody['leftEyebrowInner'].y = agentBody['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;
		
		agentBody['rightEyebrowCenter'].y = agentBody['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		agentBody['rightEyebrowInner'].y = agentBody['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;	
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
		agentBody['leftEyebrowCenter'].y = agentBody['leftEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		agentBody['leftEyebrowInner'].x = agentBody['leftEyebrowInner'].x_neutral - activeAnims['eyebrows'].counter*step_x;
		agentBody['leftEyebrowInner'].y = agentBody['leftEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;
		
		agentBody['rightEyebrowCenter'].y = agentBody['rightEyebrowCenter'].y_neutral - activeAnims['eyebrows'].counter*step_center;
		agentBody['rightEyebrowInner'].x = agentBody['rightEyebrowInner'].x_neutral + activeAnims['eyebrows'].counter*step_x;
		agentBody['rightEyebrowInner'].y = agentBody['rightEyebrowInner'].y_neutral - activeAnims['eyebrows'].counter*step_inner;	
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
		agentBody['leftEyebrowCenter'].y = agentBody['leftEyebrowCenter'].y_neutral + activeAnims['eyebrows'].counter*step_center;
		agentBody['leftEyebrowInner'].x = agentBody['leftEyebrowInner'].x_neutral - activeAnims['eyebrows'].counter*step_x;
		agentBody['leftEyebrowInner'].y = agentBody['leftEyebrowInner'].y_neutral + activeAnims['eyebrows'].counter*step_inner;
		
		agentBody['rightEyebrowCenter'].y = agentBody['rightEyebrowCenter'].y_neutral + activeAnims['eyebrows'].counter*step_center;
		agentBody['rightEyebrowInner'].x = agentBody['rightEyebrowInner'].x_neutral + activeAnims['eyebrows'].counter*step_x;
		agentBody['rightEyebrowInner'].y = agentBody['rightEyebrowInner'].y_neutral + activeAnims['eyebrows'].counter*step_inner;	
	}else{
		//clear animation
		clearInterval(activeAnims['eyebrows'].task);
		activeAnims['eyebrows'].task = undefined;
	}
	activeAnims['eyebrows'].counter++;
}


function anim_arms_wave(){
	var step_upper = 12;
	var step_lower = 10;
	
	if(activeAnims['arms'].counter <= 12){
		agentBody['rightUpperArm'].angle = agentBody['rightUpperArm'].angle_neutral + activeAnims['arms'].counter*step_upper;
		agentBody['rightLowerArm'].angle = agentBody['rightLowerArm'].angle_neutral + activeAnims['arms'].counter*step_upper;		
	}
	else if(activeAnims['arms'].counter <= 22){
		agentBody['rightLowerArm'].angle += step_lower;		
	}
	else if(activeAnims['arms'].counter <= 32){
		agentBody['rightLowerArm'].angle -= step_lower;		
	}
	else if(activeAnims['arms'].counter <= 42){
		agentBody['rightLowerArm'].angle += step_lower;		
	}
	else if(activeAnims['arms'].counter <= 52){
		agentBody['rightLowerArm'].angle -= step_lower;		
	}
	else if(activeAnims['arms'].counter <= 64){
		agentBody['rightUpperArm'].angle = agentBody['rightUpperArm'].angle_neutral +(64-activeAnims['arms'].counter)*step_upper;
		agentBody['rightLowerArm'].angle = agentBody['rightLowerArm'].angle_neutral +(64-activeAnims['arms'].counter)*step_upper;
	}
	
	else{
		//clear animation
		clearInterval(activeAnims['arms'].task);
		activeAnims['arms'].task = undefined;
	}
	activeAnims['arms'].counter++;
}

/*--------------------------------------------------------
   neutral animations
---------------------------------------------------------*/

function resetAnim_mouth(){
	agentBody['lowerLipControl'].y = agentBody['lowerLipControl'].y_neutral;
}

function resetAnim_upperLip(){
	agentBody['upperLipControl'].y = agentBody['upperLipControl'].y_neutral;
}

function resetAnim_lipCorners(){
	agentBody['leftLipCorner'].x = agentBody['leftLipCorner'].x_neutral;
	agentBody['leftLipCorner'].y = agentBody['leftLipCorner'].y_neutral;
	agentBody['rightLipCorner'].x = agentBody['rightLipCorner'].x_neutral;
	agentBody['rightLipCorner'].y = agentBody['rightLipCorner'].y_neutral;
}

function resetAnim_eyebrows(){
	agentBody['leftEyebrowOuter'].y = agentBody['leftEyebrowOuter'].y_neutral;
	agentBody['leftEyebrowCenter'].y = agentBody['leftEyebrowCenter'].y_neutral;
	agentBody['leftEyebrowInner'].x = agentBody['leftEyebrowInner'].x_neutral;
	agentBody['leftEyebrowInner'].y = agentBody['leftEyebrowInner'].y_neutral;
	agentBody['rightEyebrowOuter'].y = agentBody['rightEyebrowOuter'].y_neutral;
	agentBody['rightEyebrowCenter'].y = agentBody['rightEyebrowCenter'].y_neutral;
	agentBody['rightEyebrowInner'].x = agentBody['rightEyebrowInner'].x_neutral;
	agentBody['rightEyebrowInner'].y = agentBody['rightEyebrowInner'].y_neutral;
}

function resetAnim_eyes(){
	agentBody['leftEye'].r = agentBody['leftEye'].r_neutral;
	agentBody['rightEye'].r = agentBody['rightEye'].r_neutral;
}

function resetAnim_arms(){
	agentBody['leftUpperArm'].angle = agentBody['leftUpperArm'].angle_neutral;
	agentBody['leftLowerArm'].angle = agentBody['leftLowerArm'].angle_neutral;
	agentBody['rightUpperArm'].angle = agentBody['rightUpperArm'].angle_neutral;
	agentBody['rightLowerArm'].angle = agentBody['rightLowerArm'].angle_neutral;
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
