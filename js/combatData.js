function combatantDataSet(data) {
    var dataSet = []
    var count = 0
    for (var key in data) {
        if (count++ <= unitsInChart & data.hasOwnProperty(key)) {
            dataSet.push(data[key])
        }
    }
    return dataSet
}

function sortCombatData(data) {
    data.sort((a, b) => { return (parseInt(a[sortBy]) - parseInt(b[sortBy])) * (sortDesc ? -1 : 1) })
    return data
}

var mergeUnitFuncs = {
    "damage": mergeInt,
    "damage-m": mergeFloat,
    "damage-b": mergeFloat,
    "damage-*": mergeShorthand,
    "DAMAGE-k": mergeInt,
    "DAMAGE-m": mergeInt,
    "DAMAGE-b": mergeInt,
    "DAMAGE-*": mergeInt,
    "damage%": mergePercent,
    "dps": mergeFloat,
    "dps-*": mergeInt,
    "DPS": mergeInt,
    "DPS-k": mergeInt,
    "DPS-m": mergeInt,
    "DPS-*": mergeInt,
    "encdps": mergeFloat,
    "encdps-*": mergeInt,
    "ENCDPS": mergeInt,
    "ENCDPS-k": mergeInt,
    "ENCDPS-m": mergeInt,
    "ENCDPS-*": mergeInt,
    "hits": mergeInt,
    "crithits": mergeInt,
    "misses": mergeInt,
    "hitfailed": mergeInt,
    "swings": mergeInt,
    "tohit": mergeFloat,
    "TOHIT": mergeInt,
    "healed": mergeInt,
    "healed%": mergePercent,
    "enchps": mergeFloat,
    "enchps-*": mergeInt,
    "ENCHPS": mergeInt,
    "ENCHPS-k": mergeInt,
    "ENCHPS-m": mergeInt,
    "ENCHPS-*": mergeInt,
    "critheals": mergeInt,
    "heals": mergeInt,
    "cures": mergeInt,
    "powerdrain": mergeInt,
    "powerdrain-*": mergeShorthand,
    "powerheal": mergeInt,
    "powerheal-*": mergeShorthand,
    "kills": mergeInt,
    "overHeal": mergeInt,
    "damageShield": mergeInt,
    "absorbHeal": mergeInt
}

function mergeInt(str1, str2) {
    return (parseInt(str1) + parseInt(str2))
}

function mergePercent(str1, str2) {
    return `${(parseInt(str1) + parseInt(str2))}%`
}

function mergeFloat(str1, str2) {
    return (parseFloat(str1) + parseFloat(str2))
}

function shorthandToInt(str) {
    if (str.includes("B")) {
        return parseFloat(str) * 1000000000
    } else if (str.includes("M")) {
        return parseFloat(str) * 1000000
    } else if (str.includes("K")) {
        return parseFloat(str) * 1000
    }
    return parseFloat(str)
}

function intToShorthand(int) {
    if (int > 1000000000) {
        return `${int / 1000000000}B`
    } else if (int > 1000000) {
        return `${int / 1000000}M`
    } else if (int > 1000) {
        return `${int / 1000}K`
    }
    return int
}

function mergeShorthand(str1, str2) {
    var int1 = shorthandToInt(str1)
    var int2 = shorthandToInt(str2)

    return intToShorthand((int1 + int2))
}