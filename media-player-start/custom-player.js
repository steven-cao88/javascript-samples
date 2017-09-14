var media = document.querySelector('video');
var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var rwd = document.querySelector('.rwd');
var fwd = document.querySelector('.fwd');

var timerWrapper = document.querySelector('.timer');
var timer = document.querySelector('.timer span');
var timerBar = document.querySelector('.timer div');

var currentTime = 0;

media.removeAttribute('controls');
controls.style.visibility = 'visible';

play.addEventListener('click', playPauseMedia);

function playPauseMedia() {
	rwd.classList.remove('active');
	fwd.classList.remove('active');
	clearInterval(intervalRwd);
	clearInterval(intervalFwd);

	if (media.paused) {
		play.setAttribute('data-icon', 'u');
		media.play();
	} else {
		play.setAttribute('data-icon', 'P');
		media.pause();
	}
}

stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

function stopMedia() {
	media.pause();
	media.currentTime = 0;
	play.setAttribute('data-icon', 'P');

	rwd.classList.remove('active');
	fwd.classList.remove('active');
	clearInterval(intervalRwd);
	clearInterval(intervalFwd);
}

rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);

var intervalFwd;
var intervalRwd;

function mediaBackward() {
	clearInterval(intervalFwd);
	fwd.classList.remove('active');

	if (rwd.classList.contains('active')) {
		rwd.classList.remove('active');
		clearInterval(intervalRwd);
		media.play();
	} else {
		rwd.classList.add('active');
		media.pause();
		intervalRwd = setInterval(windBackward, 200);
	}
}

function mediaForward() {
	clearInterval(intervalRwd);
	rwd.classList.remove('active');

	if (fwd.classList.contains('active')) {
		fwd.classList.remove('active');
		clearInterval(intervalFwd);
		media.play();
	} else {
		fwd.classList.add('active');
		media.pause();
		intervalFwd = setInterval(windForward, 200);
	}
}

function windBackward() {
	if (media.currentTime <= 3) {
		stopMedia();
	} else {
		media.currentTime -= 3;
	}
}

function windForward() {
	if (media.currentTime >= media.duration - 3) {
		stopMedia();
	} else {
		media.currentTime += 3;
	}
}

media.addEventListener('timeupdate', function(e) {
	currentTime = media.currentTime;
	setTime(currentTime);
});

function setTime(currentTime) {
	var hours = Math.floor(currentTime / 3600);
	var minutes = Math.floor((currentTime - hours * 60) / 60);
	var seconds = Math.floor(currentTime - minutes * 60);
	var hourValue;
	var minuteValue;
	var secondValue;

	if (hours < 10) {
		hourValue = '0' + hours;
	} else {
		hourValue = hours;
	}

	if (minutes < 10) {
		minuteValue = '0' + minutes;
	} else {
		minuteValue = minutes;
	}

	if (seconds < 10) {
	    secondValue = '0' + seconds;
	} else {
	    secondValue = seconds;
	}

	var mediaTime = hourValue + ':' + minuteValue + ':' + secondValue;
	timer.textContent = mediaTime;

	var barLength = timerWrapper.clientWidth * (currentTime / media.duration);
	timerBar.style.width = barLength + 'px';
}

timerWrapper.addEventListener('click', jumpPosition);

function jumpPosition(e) {
	var leftBorderPosition = timerWrapper.getBoundingClientRect().left;
	var clickedPosition = e.x;
	var selectedTime = ((clickedPosition - leftBorderPosition) / timerWrapper.clientWidth) * media.duration;
	media.currentTime = selectedTime;
	setTime(selectedTime);
}