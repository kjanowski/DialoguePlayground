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

// the topics of which the dialog consists
var topics = [];

// the object storing the answers
var worldState = {};

// the currently played topic
var currentTopicIndex = -1;

// the currently edited topic
var editedTopicIndex = -1;

// the parameters for drawing the nodes
var drawingParams = {};
drawingParams.node = {width:100, height:50, cornerRadius: 10};
drawingParams.text = {chunkLength: 12};
drawingParams.text.offset = {x:10, y:20};
drawingParams.handleLength = 30;
	


//=====================================================================================================
// modifying the dialogue flow
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Creates a default topic and adds it to the dialogue flow
//-------------------------------------------------------------------------------------
function addTopic(){
	topics.push({name:'Thema', x:0, y:0, emotion:'', movement:'', question:'Frage', answers:[], transitions:[]})
	switchTopic(topics.length-1);
}

//-------------------------------------------------------------------------------------
// Deletes the currently edited topic from the dialogue flow
//-------------------------------------------------------------------------------------
function deleteTopic(){
	//adjust all the transitions
	for(topic of topics){
		for(transition of topic.transitions){
			if(transition.nextTopic > editedTopicIndex){
				//reduce index by one to account for the "hole" in the array
				transition.nextTopic -= 1;
			}else if(transition.nextTopic == editedTopicIndex)
			{
				//disconnect transition completely
				transition.nextTopic = -1;
			}//otherwise, the transition is not affected
		}
	}
	
	//delete the topic
	topics.splice(editedTopicIndex, 1);
	editedTopicIndex = -1; //clear selection immediately to prevent saving of the topic
	switchTopic(-1);
	
	//refresh the dialogue flow display
	drawFlow();
}

//-------------------------------------------------------------------------------------
// Creates a default answer and adds it to the currently edited topic.
//-------------------------------------------------------------------------------------
function addAnswer(){
	saveTopic();
	var editedTopic = topics[editedTopicIndex];
	editedTopic.answers.push({text:'Antwort', value:'Antwort'});
	
	showAnswers();
}

//-------------------------------------------------------------------------------------
// Deletes the given answer from the currently edited topic.
//-------------------------------------------------------------------------------------
function deleteAnswer(index){
	saveTopic();
	var editedTopic = topics[editedTopicIndex];
	editedTopic.answers.splice(index, 1);
	
	showAnswers();
}


//-------------------------------------------------------------------------------------
// Creates a default transition and adds it to the currently edited topic.
//-------------------------------------------------------------------------------------
function addTransition(){
	saveTopic();
	var editedTopic = topics[editedTopicIndex];
	editedTopic.transitions.push({variable:'',operand:'equal',value:'', nextTopic:'-1'});
	
	showTransitions();
}

//-------------------------------------------------------------------------------------
// Deletes the given transition from the currently edited topic.
//-------------------------------------------------------------------------------------
function deleteTransition(index){
	saveTopic();
	var editedTopic = topics[editedTopicIndex];
	editedTopic.transitions.splice(index, 1);
	
	showTransitions();
}


//=====================================================================================================
// synchronizing dialogue flow and GUI
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Sets the currently edited topic and displays its attributes on the editor panel. 
//-------------------------------------------------------------------------------------
function switchTopic(newIndex){
	saveTopic();

	//--------------------------------------------------------------
	// check selection validity 
	//--------------------------------------------------------------
	
	var editor = document.getElementById("topicEditor");

	//hide the editor panel if no topic is selected
	if((newIndex <0)||(newIndex>=topics.length))
	{
		editedTopicIndex=-1; //clear the selection 
		editor.style.display="none";
		drawFlow(); //refresh the node highlight
		return;
	}

	//show the editor panel
	editor.style.display="block";

	//--------------------------------------------------------------
	// select the requested topic and display its attributes 
	//--------------------------------------------------------------
	
	editedTopicIndex = newIndex;
	var editedTopic = topics[editedTopicIndex];
	
	var nameInput = document.getElementById("topicName");
	nameInput.value = editedTopic.name;
	
	var xInput = document.getElementById("topicX");
	xInput.value = editedTopic.x;
	
	var yInput = document.getElementById("topicY");
	yInput.value = editedTopic.y;
	
	var variableInput = document.getElementById("topicVariable");
	variableInput.value = editedTopic.variable;
	
	var emotionSelect = document.getElementById("topicEmotion");
	emotionSelect.value = editedTopic.emotion;

	var movementSelect = document.getElementById("topicMovement");
	movementSelect.value = editedTopic.movement;
	
	var questionInput = document.getElementById("topicQuestion");
	questionInput.value = editedTopic.question;
	
	showAnswers();
	showTransitions();
	
	drawFlow(); //refresh the node highlight
}

//-------------------------------------------------------------------------------------
// Lists the answers for the currently edited topic on the editor panel.
//-------------------------------------------------------------------------------------
function showAnswers()
{
	var editedTopic = topics[editedTopicIndex];
	
	var answerEditor = document.getElementById('topicAnswers');
	answerEditor.innerHTML = "";
	
	var i;
	for(i=0; i<editedTopic.answers.length; i++)
	{
		//create a new subpanel for the answer
		var answerPanel = "<div class=\"subpanel\">";
		
		//create an input field for the answer's display text
		answerPanel += "<label for=\"answer_"+i+"_text\">Text:</label>"
					  +"<input type=\"text\" id=\"answer_"+i+"_text\" value=\""+editedTopic.answers[i].text+"\"/><br>";
					  
		//create an input field for the answer's value
		answerPanel += "<label for=\"answer_"+i+"_value\">Wert:</label>"
				      +"<input type=\"text\" id=\"answer_"+i+"_value\" value=\""+editedTopic.answers[i].value+"\"/><br>";

		//create a button for deleting this answer
		answerPanel += "<button type=\"text\" id=\"answer_"+i+"_delete\" onclick=\"deleteAnswer("+i+");\">Antwort löschen</button><br>";
		
		//close the answer subpanel
		answerPanel += "</div>"
		
		//add the new answer panel to the list
		answerEditor.innerHTML +=answerPanel;		
	}
}

//-------------------------------------------------------------------------------------
// Lists the transitions from the currently edited topic on the editor panel.
//-------------------------------------------------------------------------------------
function showTransitions()
{
	var editedTopic = topics[editedTopicIndex];
	
	var transitionEditor = document.getElementById('topicTransitions');
	transitionEditor.innerHTML = "";
	
	var i;
	for(i=0; i<editedTopic.transitions.length; i++)
	{
		//create a new subpanel for the transition
		var transitionPanel = "<div class=\"subpanel\">";

		//create inputs for defining the condition
		transitionPanel +="<div class=\"transitionPanel\">wenn<br>"
						 +"<input type=\"text\" id=\"transition_"+i+"_variable\" value=\""+editedTopic.transitions[i].variable+"\"/>"
						 +getOperandSelectHTML(i)
						 +"<input type=\"text\" id=\"transition_"+i+"_value\" value=\""+editedTopic.transitions[i].value+"\"/><br>";
						 
		//create a dropdown for the target topic
		transitionPanel +="gehe zu <br>"+getTopicSelectHTML(i);
		
		//create a button for deleting this transition
		transitionPanel += "<button type=\"text\" id=\"transition_"+i+"_delete\" onclick=\"deleteTransition("+i+");\">Übergang löschen</button><br>";
		
		//close the subpanel
		transitionPanel +="</div>";
									
		//add the subpanel to the list
		transitionEditor.innerHTML += transitionPanel;
	}
	
	for(i=0; i<editedTopic.transitions.length; i++)
	{
		var operandSelect = document.getElementById("transition_"+i+"_operand");
		var topicSelect = document.getElementById("transition_"+i+"_nextTopic");
		operandSelect.value = editedTopic.transitions[i].operand;
		topicSelect.value = editedTopic.transitions[i].nextTopic;
	}
}

//-------------------------------------------------------------------------------------
// Creates a dropdown for the operand of the given transition's condition.
//-------------------------------------------------------------------------------------
function getOperandSelectHTML(transitionIndex){
	var selectHTML = "<select id=\"transition_"+transitionIndex+"_operand\" value=\"-1\">"
				   + "<option value=\"equal\">gleich</option>"
				   + "<option value=\"notEqual\">ungleich</option>"
				   + "<option value=\"greater\">größer</option>"
				   + "<option value=\"less\">kleiner</option>"
				   + "</select>";
	
	return selectHTML;
}

//-------------------------------------------------------------------------------------
// Creates a dropdown for the target topic of the given transition.
//-------------------------------------------------------------------------------------
function getTopicSelectHTML(transitionIndex){
	var selectHTML = "<select id=\"transition_"+transitionIndex+"_nextTopic\" value=\"''\">";
	
	selectHTML += "<option value=\"'-1'\">---</option>";
	
	var i;
	for(i=0; i<topics.length; i++)
	{
		selectHTML += "<option value=\""+i+"\">"+topics[i].name+"</option>";
	}
	
	selectHTML += "</select>";
	
	return selectHTML;
}

//-------------------------------------------------------------------------------------
// Updates the edited topic with the attributes shown on the editor panel.
//-------------------------------------------------------------------------------------
function saveTopic(){
	console.log("edited topic: "+editedTopicIndex);
	var editedTopic = topics[editedTopicIndex];
	if(editedTopic == undefined)
		return; //skip saving if the current index does not point to a valid topic 
	
	try{
		var nameInput = document.getElementById("topicName");
		editedTopic.name = sanitizeInput(nameInput);
	
		var xInput = document.getElementById("topicX");
		editedTopic.x = xInput.value;
	
		var yInput = document.getElementById("topicY");
		editedTopic.y = yInput.value;
	}catch(error)
	{
		console.log("can\'t access appearance properties");
	}
	try{
		var emotionSelect = document.getElementById("topicEmotion");
		editedTopic.emotion = emotionSelect.value;

		var movementSelect = document.getElementById("topicMovement");
		editedTopic.movement = movementSelect.value;
		
		var questionInput = document.getElementById("topicQuestion");
		editedTopic.question = sanitizeInput(questionInput);
	}catch(error){
		console.log("can\'t access behavior properties");
	}
	
	try{
		var variableInput = document.getElementById("topicVariable");
		editedTopic.variable = sanitizeInput(variableInput);

		
		//answers
		var answerEditor = document.getElementById('topicAnswers');
		
		var i;
		for(i=0; i<editedTopic.answers.length; i++)
		{	
			var textInput = document.getElementById('answer_'+i+'_text');
			var valueInput = document.getElementById('answer_'+i+'_value');
		
			editedTopic.answers[i] = {};
			editedTopic.answers[i].text = sanitizeInput(textInput);
			editedTopic.answers[i].value = sanitizeInput(valueInput);
		}
	}catch(error){
		console.log("can\'t access answer properties");
	}
	
	try{
		for(i=0; i<editedTopic.transitions.length; i++)
		{	
			var variableInput = document.getElementById('transition_'+i+'_variable');
			var operandSelect = document.getElementById('transition_'+i+'_operand');
			var valueInput = document.getElementById('transition_'+i+'_value');
			var nextTopicSelect = document.getElementById('transition_'+i+'_nextTopic');
		
			editedTopic.transitions[i] = {};
			editedTopic.transitions[i].variable = sanitizeInput(variableInput);
			editedTopic.transitions[i].operand = operandSelect.value;
			editedTopic.transitions[i].value = sanitizeInput(valueInput);
			editedTopic.transitions[i].nextTopic = nextTopicSelect.value;
		}
	}catch(error)
	{
		console.log("can\'t access transition properties");
	}
	
	drawFlow();
}

//-------------------------------------------------------------------------------------
// Removes potentially dangerous symbols from an input field and returns the result.
//-------------------------------------------------------------------------------------
function sanitizeInput(input){
	var cleanText = input.value.replace(/[();<>{}""''\/\[\]]/g, "");
	input.value=cleanText;
	return cleanText;
}



//=====================================================================================================
// Playing the Dialogue
//=====================================================================================================


//-------------------------------------------------------------------------------------
// Plays the dialogue flow, starting from the currently edited topic.
//-------------------------------------------------------------------------------------
function play(){
	saveTopic();
	currentTopicIndex = editedTopicIndex;
	playTopic();
}

//-------------------------------------------------------------------------------------
// Plays the currently active topic.
//-------------------------------------------------------------------------------------
function playTopic(){
	drawFlow();
	
	console.log("current topic: "+currentTopicIndex);
	var currentTopic = topics[currentTopicIndex];
	if(currentTopic == undefined)
		return; //stop playing if the current index does not point to a valid topic 
	
	playAnimation(currentTopic.movement);
	playAnimation(currentTopic.emotion);
	
	//replace any variables
	var question = currentTopic.question;
	for(variable in worldState)
	{
		question = question.replace("$"+variable, worldState[variable]);	
	}
	speak(question);
	
	var answerOptions = document.getElementById("answerOptions");
	
	var i;
	var options = "";
	for(i=0; i<currentTopic.answers.length; i++)
		options += "<button type=\"button\" onclick=\"selectAnswer('"+i+"');\">"+currentTopic.answers[i].text+"</button>";
	
	answerOptions.innerHTML = options;
	answerOptions.style.display="inline-block";
}

//-------------------------------------------------------------------------------------
// Handles the user input for answering the agent's prompt.
//-------------------------------------------------------------------------------------
function selectAnswer(answerIndex)
{
	var answerOptions = document.getElementById("answerOptions");
	answerOptions.style.display = "none";
	
	stopSpeech();
	
	//store the answer
	var currentTopic = topics[currentTopicIndex];
	var answer = currentTopic.answers[answerIndex];
	if(currentTopic.variable.length>0)
	worldState[currentTopic.variable] = answer.value;

	//advance to next 
	var found=false;
	var i=0;
	while((!found)&&(i<currentTopic.transitions.length)){
		var variable = currentTopic.transitions[i].variable;
		if(variable.length>0)
		{
			//check the transition's condition
			var operand = currentTopic.transitions[i].operand;
			var value = currentTopic.transitions[i].value;
			
			if(operand == "equal")
				found = (worldState[variable] == value);
			else if(operand == "notEqual")
				found = (worldState[variable] != value);
			else if(operand == "greater")
				found = (worldState[variable] > value*1);
			else if(operand == "less")
				found = (worldState[variable] < value*1);
		}else
			found=true; //no condition, i.e. always valid
		
		if(!found) i++;
	}
	
	//IDEA: could store all valid transitions and pick one randomly from that pool?

	//was a suitable transition found?
	if(found){
		//take it
		var nextTopicIndex = currentTopic.transitions[i].nextTopic;
		currentTopicIndex = nextTopicIndex;
		playTopic();
	}
}


//=====================================================================================================
// importing and exporting the whole dialogue
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Writes the dialogue's current data to the import/export field.
//-------------------------------------------------------------------------------------
function exportDialogueData(){
	var dialogueData = document.getElementById("dialogueData");
	dialogueData.value = JSON.stringify(topics);
}

//-------------------------------------------------------------------------------------
// Replaces the dialogue data with that found in the import/export field.
//-------------------------------------------------------------------------------------
function importDialogueData(){
	editedTopicIndex = -1; //clear selection explicitly to prevent saving
	switchTopic(-1);
	
	var dialogueData = document.getElementById("dialogueData");
	
	//sanitize import data
	var data = dialogueData.value;
	
	var cleanData = data.replace(/[();<>\/]/g, "");
	dialogueData.value=cleanData;
	
	topics = JSON.parse(cleanData);
	
	drawFlow();
}


//=====================================================================================================
// editor GUI
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Collapses or expands a section of the topic editor.
//-------------------------------------------------------------------------------------
function toggle(accordionID){
	saveTopic();
	var accordion = document.getElementById(accordionID);
	var caption = document.getElementById(accordionID+"_caption");
	var content = document.getElementById(accordionID+"_content");
	
	if(content.style.display == "none"){
		content.style.display="block";
		caption.innerHTML = "▲"+caption.innerHTML.substring(1);
	}else{
		content.style.display="none";
		caption.innerHTML = "▼"+caption.innerHTML.substring(1);		
	}
}

//=====================================================================================================
// dialogue flow display
//=====================================================================================================

//-------------------------------------------------------------------------------------
// Draws the topic nodes and the transitions between them.
//-------------------------------------------------------------------------------------
function drawFlow(){
	var svgCanvas = document.getElementById("flowViewer");
	
	var edgeLayer = "";
	var nodeLayer = "";
	
	var i;
	for(i=0; i<topics.length; i++){
		var topic = topics[i];
		
		//draw the node
		nodeLayer += createNode(i);
		
		//draw outgoing edges
		for(transition of topic.transitions)
		{
			var nextTopic = topics[transition.nextTopic];
			
			if (nextTopic != undefined)
			{
				
				var startX = topic.x*1 + drawingParams.node.width;
				var startY = topic.y*1 + drawingParams.node.height*0.5;
				
				var startHandleX = startX + drawingParams.handleLength;
								
				var endX = nextTopic.x*1 ;
				var endY = nextTopic.y*1 + drawingParams.node.height*0.5;
				
				var endHandleX = endX - drawingParams.handleLength;

				var midX = (startX+endX)/2;
				var midY = (startY+endY)/2;
				
				edgeLayer += "<path class=\"flowEdge\" d=\""
						   + "M "+startX+" "+startY
						   + " Q "+startHandleX+" "+startY+" "+midX+" "+midY
						   + " Q "+endHandleX+" "+endY+" "+endX+" "+endY
						   +"\"/>"
				
				//draw arrow
				var arrowTop = endY - 5;
				var arrowBottom = endY + 5;
				var arrowEnd = endX -10;
				
				edgeLayer += "<polygon class=\"flowArrow\" points=\""+endX+","+endY+" "+arrowEnd+","+arrowBottom+" "+arrowEnd+","+arrowTop+"\"/>";
			}
		}
	}
	
	svgCanvas.innerHTML = edgeLayer+nodeLayer;
}



//-------------------------------------------------------------------------------------
// Creates a topic node.
//-------------------------------------------------------------------------------------
function createNode(topicIndex){
	var topic = topics[topicIndex];
	
	//prepare the class
	var nodeClass = "flowNode";
	if(topicIndex == editedTopicIndex)
		nodeClass +=" edited";
	if(topicIndex == currentTopicIndex)
		nodeClass +=" played";
		
	//create a rectangle
	var nodeSVG = "<rect class=\""+nodeClass+"\" x=\""+topic.x+"\" y=\""+topic.y+"\" "
				+ "width=\""+drawingParams.node.width+"\" height=\""+drawingParams.node.height+"\" "
				   + "rx=\""+drawingParams.node.cornerRadius+"\" ry=\""+drawingParams.node.cornerRadius+"\" " 
				   + "onclick=\"switchTopic("+topicIndex+")\"/>";
				   
	//label it with the topic name -------------------------------------
	
	//calculate the text position
	var textX = topic.x*1 +drawingParams.text.offset.x;
	var textY = topic.y*1 +drawingParams.text.offset.y;
	
	nodeSVG += "<text x=\""+textX+"\" y=\""+textY+"\" onclick=\"switchTopic("+topicIndex+")\">"

	//chop longer topic names into separate lines
	var chunkStart=0;
	var chunkEnd=chunkStart+drawingParams.text.chunkLength;
	var offsetY = 0;
	while (chunkStart<topic.name.length)
	{
		var textChunk;
		if(chunkEnd<topic.name.length)
			textChunk = topic.name.substring(chunkStart, chunkEnd);
		else textChunk = topic.name.substring(chunkStart);
		
		var lineY = textY + offsetY;
		nodeSVG += "<tspan x=\""+textX+"\" y=\""+lineY+"\">"+textChunk+"</tspan>";
		offsetY += drawingParams.text.offset.y;
		
		chunkStart = chunkEnd;
		chunkEnd = chunkEnd+drawingParams.text.chunkLength;
	}
	
	//close text element
	nodeSVG +="</text>";	

	return nodeSVG;
}




















