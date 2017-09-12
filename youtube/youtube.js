// Get references to DOM elements we need to manipulate
var searchTerm = document.querySelector('.search');
var searchForm = document.querySelector('form');
var submitBtn = document.querySelector('.submit');
var section = document.querySelector('section');

// When the window (tab) has finished loading, run onClientLoad() to get it all started
window.onload = onClientLoad;

// Load and inialize the API, then run the onYouTubeApiLoad() function once this is done
function onClientLoad() {
	gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Attach your key to the API
function onYouTubeApiLoad() {
	gapi.client.setApiKey('AIzaSyA8-n-RFvUXDOBY000zeaeBtdc1_zJZG84');
	// Attach an event listener to the form so that a search is carried out when it is submitted — the search() function
	searchForm.addEventListener('submit', search);
}

function search(e) {
	// use preventDefault() to stop form actually submitting
	e.preventDefault();

	// create a search request using the Data API;
	var request = gapi.client.youtube.search.list({
		// set what kind of data the response will include
		part: 'snippet',
		// set the number of results that will be returned
		maxResults: 10,
		// set the search query to search for
		q: searchTerm.value
	});

	// send the request, and specify a function to run when the response returns
	request.execute(onSearchResponse);
}

// This function automatically has the response passed in as a parameter
function onSearchResponse(response) {
	// Empty the <section> element
	while (section.firstChild) {
		section.removeChild(section.firstChild);
	}

	// Store the actual results of the search in a variable
	var results = response.items;

	// loop through the results and run displayVideo() on each
	for(var i = 0; i < results.length; i++) {
		displayVideo(results[i], i);
	}
}

function displayVideo(result, i) {
	// Create a div with a unique ID for each video, and append it to the <section>
    // The YouTube Iframe Player API will replace each one with
    // an <iframe> containing the corresponding video
    var vid = document.createElement('div');
    vidId = 'vid' + i;
    vid.id = vidId;
    section.appendChild(vid);

    // Use the YT.Player() constructor to create a new video player object,
    // Specifying the ID of the element to be replaced by it (the <div>),
    // A height and width, and an event handler to handle the custom onReady event
    var player = new YT.Player(vidId, {
    	height: '360',
    	width: '480',
    	videoId: result.id.videoId,
    	events: {
    		'onReady': onPlayerReady
    	}
    });

    // The onPlayerReady() handler grabs the ID of each video, and checks its duration
    // If the duration is 0, the video can't be played, so we just delete it
    function onPlayerReady(e) {
    	var myId = e.target.a.id;
    	var duration = e.target.getDuration();
    	if (duration === 0) {
    		console.log('Video ' + myId + ' cannot be played, so it was deleted.');
    		section.removeChild(e.target.a);
    	} else {
    		var myId = e.target.a.id;
    		console.log('Video ' + myId + ' ready to play.');
    	}
    }
}









