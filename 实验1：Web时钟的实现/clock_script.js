const deg = 6;
const hour = document.querySelector(".hour");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

const setClock = () => {
	let day = new Date();
	let hh = day.getHours() * 30;
	let mm = day.getMinutes() * deg;
	let ss = day.getSeconds() * deg;

	hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
	min.style.transform = `rotateZ(${mm}deg)`;
	sec.style.transform = `rotateZ(${ss}deg)`;
};

// first time
setClock();
// Update every 1000 ms
setInterval(setClock, 1000);



Number.prototype.pad = function(n) {
	for (var r = this.toString(); r.length < n; r = 0 + r);
	return r;
};

function updateClock() {
	var now = new Date();
	var milli = now.getMilliseconds(),
		sec = now.getSeconds(),
		min = now.getMinutes(),
		hou = now.getHours(),
		mo = now.getMonth(),
		dy = now.getDate(),
		yr = now.getFullYear();
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var tags = ["mon", "d", "y", "h", "m", "s", "mi"],
		corr = [months[mo], dy, yr, hou.pad(2), min.pad(2), sec.pad(2), milli];
	for (var i = 0; i < tags.length; i++)
		document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
}

function initClock() {
	updateClock();
	window.setInterval("updateClock()", 1);
}
