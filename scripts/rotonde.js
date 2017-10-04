function load(rotonde) {
	let feed = rotonde.feed,
		con = document.getElementById("feed")

	for (let i = feed.length - 1; i >= 0; i--) {
		let d = document.createElement('div'),
  			t = document.createElement('span'),
  			e = document.createElement('span')

		con.appendChild(d)
    d.appendChild(time)
		t.className = "db mb2 f6 mon"
		t.innerHTML = convertTime(feed[i].time)

		d.appendChild(entry)
		e.className = "db mb4"
		e.innerHTML = feed[i].text
	}
}

function convertTime(t) {
	let d = new Date(t * 1000),
	    h = d.getHours(),
		  m = "0" + d.getMinutes(),
		  s = "0" + d.getSeconds()

	return pad(h) + ':' + m.substr(-2) + ':' + s.substr(-2)
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
