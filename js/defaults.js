var unitsInChart = 8

// Working sortBy options right now are "damage", "healed", and "damagetaken"
var sortBy = "damage"
var sortDesc = true

var encounterMetrics = {
    "Encounter": "title",
    "Duration": "duration",
    "DMG": "damage-*",
    "DPS": "encdps-*",
    "Healed": "healed",
    "DMG Taken": "damagetaken-*",
}

var combatantsMetrics = {
    "Name": "name",
    "DMG": "damage-*",
    "DPS": "encdps",
    "Crit%": "crithit%",
}

var colorSeed = 0

var colorOverrides = {
    "Yourname": "cc0044",
    "Wizard01": "00aaff",
}