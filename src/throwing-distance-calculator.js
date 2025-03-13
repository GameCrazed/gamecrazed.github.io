import { GetMeasurementByMassLbs, GetMeasurementByRank } from './database-handler.ts';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calcThrowDist').addEventListener('click', calculateThrowingDistance);
});

async function calculateThrowingDistance() {
    const strengthRank = parseInt(document.getElementById('strength').value);
    const massRank = parseInt(document.getElementById('massRank').value);
    const massKg = parseFloat(document.getElementById('throwingMassKg').value);
    let massLbs = parseFloat(document.getElementById('throwingMassLbs').value);
    const throwingResultDiv = document.getElementById('throwingResult');

    if (isNaN(strengthRank)) {
        throwingResultDiv.textContent = 'Please enter a valid Strength Rank.';
        return;
    }

    if (!isNaN(massKg)) {
        massLbs = (massKg * 2.20462).toFixed(2); // Conversion factor from kg to lbs
    }

    let closestMassRank;
    try {
        closestMassRank = await GetMeasurementByMassLbs(massLbs);
    } catch (error) {
        throwingResultDiv.textContent = 'Error loading measurements data: ' + error;
        return;
    }

    let massRankValue;
    if (!isNaN(massRank)) {
        massRankValue = massRank;
    } else if (!isNaN(massLbs)) {
        massRankValue = closestMassRank.Rank;
    } else {
        throwingResultDiv.textContent = 'Please enter a Mass Rank or Weight.';
        return;
    }

    const throwingDistanceRank = strengthRank - massRankValue;
    const distance = await RankToDistance(throwingDistanceRank);

    throwingResultDiv.innerHTML = `Throwing Distance: ${distance}<br/>Distance Rank: ${throwingDistanceRank}${!isNaN(massKg) ? `<br/>Equivalent Mass In Lbs: ${massLbs}` : ''}<br/>Mass Rank: ${massRankValue}<br/><div style="font-size: 10px; font-weight: normal; padding-top: 10px">Calculation: Strength Rank (${strengthRank}) - Mass Rank (${massRankValue}) = Throwing Distance Rank (${throwingDistanceRank})</div>`;
}

async function RankToDistance(rank) {
    if (rank < 0) {
        return "Range < 6 inches";
    } else if (rank >= 30) {
        return "Range > 4 million miles";
    }

    const result = await GetMeasurementByRank(rank);
    return result.Distance;
}