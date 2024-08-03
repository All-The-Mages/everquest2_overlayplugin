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
    if (typeof toNumberUnitFuncs[sortBy] == 'undefined') { return data }
    data.sort((a, b) => { return (toNumberUnitFuncs[sortBy](a[sortBy]) - toNumberUnitFuncs[sortBy](b[sortBy])) * (sortDesc ? -1 : 1) })
    return data
}

function extractPets(combatData) {
    var pets = []

    for (var i = combatData.length - 1; i >= 0; i--) {
        if (combatData[i].name.includes("'s ")) {
            pets.push(combatData[i])
            combatData.splice(i, 1);
        }
    }

    return { pets, combatData }
}

function mergePets(combatData) {
    var data = extractPets(combatData)

    var pets = data.pets.map((pet) => {
        pet.owner = pet.name.substring(0, pet.name.indexOf("'s "))
        return pet
    })

    return data.combatData.map((unit) => {
        var unitPets = pets.filter((pet) => { return pet.owner == unit.name })
        unitPets.forEach((pet) => {
            unit = mergeCombants(unit, pet)
        })

        return unit
    })
}

function mergeCombants(primaryUnit, secondaryUnit) {
    var merged = {}

    for (var key in primaryUnit) {
        if (primaryUnit.hasOwnProperty(key)) {
            if (mergeUnitFuncs[key]) {
                merged[key] = mergeUnitFuncs[key](primaryUnit[key], secondaryUnit[key])
            } else {
                merged[key] = primaryUnit[key]
            }
        }
    }
    return merged
}

var toNumberUnitFuncs = {
    "damage": toNumber,
    "damage-m": toNumber,
    "damage-b": toNumber,
    "damage-*": shorthandToInt,
    "DAMAGE-k": toNumber,
    "DAMAGE-m": toNumber,
    "DAMAGE-b": toNumber,
    "DAMAGE-*": toNumber,
    "damage%": toNumber,
    "dps": toNumber,
    "dps-*": toNumber,
    "DPS": toNumber,
    "DPS-k": toNumber,
    "DPS-m": toNumber,
    "DPS-*": toNumber,
    "encdps": toNumber,
    "encdps-*": toNumber,
    "ENCDPS": toNumber,
    "ENCDPS-k": toNumber,
    "ENCDPS-m": toNumber,
    "ENCDPS-*": toNumber,
    "hits": toNumber,
    "crithits": toNumber,
    "misses": toNumber,
    "hitfailed": toNumber,
    "swings": toNumber,
    "tohit": toNumber,
    "TOHIT": toNumber,
    "healed": toNumber,
    "healed%": toNumber,
    "enchps": toNumber,
    "enchps-*": toNumber,
    "ENCHPS": toNumber,
    "ENCHPS-k": toNumber,
    "ENCHPS-m": toNumber,
    "ENCHPS-*": toNumber,
    "critheals": toNumber,
    "heals": toNumber,
    "cures": toNumber,
    "powerdrain": toNumber,
    "powerdrain-*": shorthandToInt,
    "powerheal": toNumber,
    "powerheal-*": shorthandToInt,
    "kills": toNumber,
    "overHeal": toNumber,
    "damageShield": toNumber,
    "absorbHeal": toNumber
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

function toNumber(str) {
    return parseFloat(str) || 0
}

function mergeInt(str1, str2) {
    return ((parseInt(str1) || 0) + (parseInt(str2) || 0))
}

function mergePercent(str1, str2) {
    return `${mergeInt(str1, str2)}%`
}

function mergeFloat(str1, str2) {
    return (toNumber(str1) + toNumber(str2))
}

function shorthandToInt(str) {
    if (typeof (str) != "string") { return 0 }
    if (str.includes("B")) {
        return toNumber(str) * 1000000000
    } else if (str.includes("M")) {
        return toNumber(str) * 1000000
    } else if (str.includes("K")) {
        return toNumber(str) * 1000
    }
    return toNumber(str)
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