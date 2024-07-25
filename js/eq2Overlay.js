function init() {
    encounter.init()
    combatants.init()
    addOverlayListener("CombatData", (e) => update(e))
    startOverlayEvents()
}

function update(data) {
    encounter.clear()
    if (typeof (data.Encounter) == "object") {
        encounter.update(data.Encounter)
    }
    combatants.clear()
    if (typeof (data.Combatant) == "object") {
        combatants.update(data.Combatant)
    }

}

function makeHeader(metrics, tr) {
    for (var key in metrics) {
        if (metrics.hasOwnProperty(key)) {
            var th = document.createElement("th")
            th.innerText = key
            tr.appendChild(th)
        }
    }

}

function makeRow(metrics, data) {
    var tr = document.createElement("tr")

    for (var key in metrics) {
        if (metrics.hasOwnProperty(key)) {
            var td = document.createElement("td")
            td.innerText = data[metrics[key]]
            tr.appendChild(td)
        }
    }

    return tr
}

function colorHex(str) {
    if (colorOverrides[str]) {
        return colorOverrides[str]
    }

    var hash = parseInt(colorSeed)

    if (str.length === 0) return hash
    for (var i = 0; i < str.length; i++) {
        var chr = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }

    colorOverrides[str] = Math.abs(hash).toString(16).substring(0, 6)
    return colorOverrides[str]
}


function barBackground(name, percent) {
    var rgb = colorHex(name)

    return `linear-gradient(90deg, #${rgb}99 0%, #${rgb}99 ${percent}%, rgba(0,0,0,0) ${percent}%, rgba(0,0,0,0) 100%)`
}

var encounter = {
    element: document.createElement("div"),
    table: document.createElement("table"),
    header: document.createElement("tr"),
    metrics: encounterMetrics,

    clear: function () {
        while (this.table.rows[1]) this.table.deleteRow(1)
    },
    update: function (data) {
        var tr = makeRow(this.metrics, data)
        this.table.appendChild(tr)
    },
    makeHeader: function () {
        makeHeader(this.metrics, this.header)
    },
    init: function () {
        this.element.id = "encounter"
        this.makeHeader()
        this.table.appendChild(this.header)
        this.element.appendChild(this.table)
        content.appendChild(this.element)
    },
}
var combatants = {
    element: document.createElement("div"),
    table: document.createElement("table"),
    header: document.createElement("tr"),
    metrics: combatantsMetrics,

    clear: function () {
        while (this.table.rows[1]) this.table.deleteRow(1)
    },
    update: function (data) {
        var combatData = sortCombatData(combatantDataSet(data))
        var maxSortValue = combatData[0] ? parseInt(combatData[0][sortBy]) : 1

        combatData.forEach(function (row) {
            var tr = makeRow(this.metrics, row)
            tr.style.background = barBackground(row["name"], Math.trunc((parseInt(row[sortBy]) / maxSortValue) * 100))
            this.table.appendChild(tr)
        }, this)
    },
    makeHeader: function () {
        makeHeader(this.metrics, this.header)
    },
    init: function () {
        this.element.id = "combatants"
        this.makeHeader()
        this.table.appendChild(this.header)
        this.element.appendChild(this.table)
        content.appendChild(this.element)
    },
}
