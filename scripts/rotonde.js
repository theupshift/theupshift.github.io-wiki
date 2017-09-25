function load(rotonde) {
	let feed = rotonde.feed,
		con = document.getElementById("feed")

	for (let i = feed.length - 1; i >= 0; i--) {
		let div = document.createElement('div'),
			time = document.createElement('span'),
			entry = document.createElement('span')

		con.appendChild(div)

		div.appendChild(time)
		time.classList.add("db")
		time.classList.add("mb2")
		time.classList.add("f6")
		time.classList.add("mon")
		time.innerHTML = convertTime(feed[i].time)

		div.appendChild(entry)
		entry.classList.add("db")
		entry.classList.add("mb4")
		entry.innerHTML = feed[i].text
	}
}

function convertTime(t) {
	let date = new Date(t * 1000),
	    hours = date.getHours(),
		  minutes = "0" + date.getMinutes(),
		  seconds = "0" + date.getSeconds()

	return pad(hours) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}

function pad(n) {
	return ('0' + n).substr(-2)
}

var request = new XMLHttpRequest()
request.open('GET', 'https://joshavanier.github.io/rotonde/', true)
request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(request.responseText)
		console.log(data)
		load(data)
	} else {}
}
request.send()
