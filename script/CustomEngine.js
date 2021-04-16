var bodyContainer = undefined;

var voice = {};
voice.index = 0;
voice.language = 'de';
voice.volume = 1.0;	//from 0 to 1
voice.rate = 1.0;	//from 0.1 to 10
voice.pitch = 1.0;	//from 0 to 2



//----------------------------------------------------------------------
// initialization
//----------------------------------------------------------------------

function initAgent(targetContainer)
{
	window.onload =  () => {
		bodyContainer = targetContainer;
		createBody();
	};
}

//----------------------------------------------------------------------
// wrapper for the agent's API
//----------------------------------------------------------------------

function playAnimation(animName){
	if(animName.length>0)
	try{
		console.log("Can't play animations yet.")
	}catch(error)
	{
		console.log("Could not play animation \""+animName+"\": "+error);
	}
}

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

function stopSpeech(){
	if('speechSynthesis' in window)
	{
		window.speechSynthesis.cancel();
	}
	else{
		console.log("Speech synthesis not supported by this browser.")
	}
}


//----------------------------------------------------------------------
// the agent
//----------------------------------------------------------------------

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


//Problem: when should I call this? On load, the voices are not defined yet...
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
