import { LoadMeasurements } from './index.ts';

document.addEventListener('DOMContentLoaded', function() {
    PopulateMeasurementsTable();

    document.getElementById('toggleButton').addEventListener('click', PopulateMeasurementsTable);
});

async function PopulateMeasurementsTable() {
    const tableBody = document.getElementById('measurementsTableBody');
    const toggleButton = document.getElementById('toggleButton');

    // Clear current table rows
    tableBody.innerHTML = '';

    const measurementsTable = await LoadMeasurements(toggleButton.value);

    measurementsTable.forEach((item) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = item.Rank;
        row.appendChild(rankCell);

        const massCell = document.createElement('td');
        massCell.textContent = item.Mass;
        row.appendChild(massCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = item.Time;
        row.appendChild(timeCell);

        const distanceCell = document.createElement('td');
        distanceCell.textContent = item.Distance;
        row.appendChild(distanceCell);

        const volumeCell = document.createElement('td');
        volumeCell.textContent = item.Volume;
        row.appendChild(volumeCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });

    toggleButton.value = toggleButton.value === 'imperial' ? 'metric' : 'imperial';
}