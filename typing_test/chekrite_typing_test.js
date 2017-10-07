var texts = [
	"ChekRite is a data capture system for managing inspections and checklists. We will help you ensure Compliance, increase Consistency of your processes and reduce Costs.",
	"ChekRite helps ensure the right thing is done the right way at the right time. Our unique approach to data capture enforces consistency in your standard processes.",
	"Your business needs to ensure your operations are working within the laws and regulations laid down by government and industry specific regulators. ChekRite gives you the confidence that employees are following correct processes and procedures."
];

//texts = ["hello"];

var lastTime = 0;
var currentTime = 0;
var passedTime = 0;
var selectedText = '';
var enteredText = '';
var animationCount = 0;

$(document).ready(function() {
	$('#typingArea').bind("paste",function(e) {
      		e.preventDefault();
  	});

	$("#typingArea").click(function() {
		reset();
		generateText();
		monitorTime();
	});

	$("#submit").click(function() {
		generateResult();
	});

	$("#show").click(function() {
		$("#text").html("Simple select the box");
		$(".chekrite-container").show();
		$("#showChekRite").hide();
		$("#typingArea").hide();
		$("#submit").hide();
		$("#shareButtons").css({
			"position" : "relative",
			"top": "-400px"
		});
		$("#done").css("visibility", "visible");
	});

	$("input[type=checkbox]").on("click", function() {
		if (animationCount < 2) {
			$(".chekrite-box").animate({
				left: "-=330"
			}, 1000, function() {});

			animationCount++;
		}
	});

	$("#tile3 input[type=checkbox]").on("click", function() {
		$("#done").removeAttr('disabled');
	});
});

function generateText() {
	var currentIndex = $("#text").attr("index");
	var index = generateRandomIndex(texts.length);
	
	do {
		index = generateRandomIndex(texts.length);
	} while (index == currentIndex && texts.length != 1);

	selectedText = texts[index];
	
	$("#text").html(selectedText);
	$("#text").attr("index", index);
	
	// allow typing
	$("#typingArea").removeAttr('disabled');
}

function generateRandomIndex(arrayLength) {
	return Math.floor(Math.random() * arrayLength);
}

function monitorTime() {
	currentTime = new Date().getTime();

	if (lastTime != 0) {
		passedTime += (currentTime - lastTime) / 1000;
	}

	lastTime += currentTime;
}

function generateResult() {
	monitorTime();

	enteredText = $("#typingArea").val();

	// calculate speed (words per minute)
	var enteredWords = enteredText.split(" "); 
	var numberOfWords = enteredWords.length;
	var wordsPerMinute = Math.round(numberOfWords * 60 / passedTime);
	var result = '';

	// check text
	if (enteredText.length < selectedText.length) {
		result += '<div>You did not complete the text</div>';
	} else {
		result = '<div>You typed approximately: ' + enteredWords.length +
			' words at a rate of ' + wordsPerMinute + ' words per minute</div>';
		if (enteredText.length > selectedText.length) {
			result += '<div>You entered more characters than the text';
		}
		var errors = checkText();
		result += '<div>Number of Errors: ' + errors + '</div>';
	}

	result += '<div>Click the textbox to play again</div>';

	$("#text").html(result);
	$("#showChekRite").show();
	$("#shareButtons").css("visibility", "visible");
}

function checkText() {
	if (enteredText == selectedText) {
		return 0;
	}
	var checkLength = Math.min(enteredText.length, selectedText.length);
	var errors = 0;
	for (var i = 0; i < checkLength; i++) {
		if (enteredText.charAt(i) != selectedText.charAt(i)) {
			errors++;
		}
	}
	return errors;
}

function reset() {
	lastTime = currentTime = passedTime = 0;
	selectedText = enteredText = '';
	// clear content of typing area
	$("#typingArea").val('');
	// clear content of result area and hide it
	$("#result").html();
	$("#result").css("display", "none");
}

