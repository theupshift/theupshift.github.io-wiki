(function(b) {
	let a = [
		"I keep a copy of the map from Treasure Island in my wallet.",
    "I have a piece of graphite embedded in my right palm.",
    "There is an ammonite fossil and a meteorite in my sock drawer.",
    "I meditate to chiptune.",
    "I once had a pet plant named Meredith. Sadly, she's dead.",
    "I am horrible at maths.",
    "I love seeing lightning bugs.",
    "I'm not fond of sunlight.",
    "I once stepped on a sea urchin. Yes, it hurt.",
    "I almost drowned in the ocean when I was but a youngling.",
    "I don't know how to use Photoshop.",
    "I sacrificed Arcadia Bay at the end of Life is Strange.",
    "I love playing text-based games, mostly because they don't lag on my Cretaceous-era machine.",
    "I consume M&M's by colour in the following order: red, orange, yellow, green, blue, then brown.",
    "I can wear hoodies at ~98\u2109 weather."
	]
	b.getElementById("randomFact").innerHTML = a[Math.floor(Math.random() * a.length)]
})(this.document)
