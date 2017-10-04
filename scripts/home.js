var m = Aequirys.convert()
d("date", Aequirys.shorter(m))
d("mortem", Mors.pro(new Date(1997, 2, 17)).toFixed(2) + "%")
function d(i, c) {document.getElementById(i).innerHTML = c}
