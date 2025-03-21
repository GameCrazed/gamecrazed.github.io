import { GetMeasurementByMassLbs, GetMeasurementByRank } from '../services/database-handler';

interface Measurement {
    Rank: number;
    Distance: string;
}

document.addEventListener('DOMContentLoaded', function () {
    const calcThrowDistButton = document.getElementById('calcThrowDist') as HTMLButtonElement;
    if (calcThrowDistButton) {
        calcThrowDistButton.addEventListener('click', calculateThrowingDistance);
    }
});

async function calculateThrowingDistance(): Promise<void> {
    const strengthRank = parseInt((document.getElementById('strength') as HTMLInputElement).value);
    const massRank = parseInt((document.getElementById('massRank') as HTMLInputElement).value);
    const massKg = parseFloat((document.getElementById('throwingMassKg') as HTMLInputElement).value);
    let massLbs = parseFloat((document.getElementById('throwingMassLbs') as HTMLInputElement).value);
    const throwingResultDiv = document.getElementById('throwingResult') as HTMLDivElement;

    if (isNaN(strengthRank)) {
        throwingResultDiv.textContent = 'Please enter a valid Strength Rank.';
        return;
    }

    if (!isNaN(massKg)) {
        massLbs = parseFloat((massKg * 2.20462).toFixed(2)); // Conversion factor from kg to lbs
    }

    let closestMassRank: Measurement = { Rank: 0, Distance: '' };
    if (!isNaN(massLbs)) {
        try {
            closestMassRank = await GetMeasurementByMassLbs(massLbs) as Measurement;
        } catch (error) {
            throwingResultDiv.textContent = 'Error loading measurements data: ' + error;
            return;
        }
    }

    let massRankValue: number;
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

async function RankToDistance(rank: number): Promise<string> {
    if (rank < 0) {
        return "Range < 6 inches";
    } else if (rank >= 30) {
        return "Range > 4 million miles";
    }

    const result = await GetMeasurementByRank(rank) as Measurement;
    return result.Distance;
}