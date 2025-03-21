import './measurements-table.css';
import { LoadMeasurements } from '../services/database-handler';

interface Measurement {
    Rank: string;
    Mass: string;
    Time: string;
    Distance: string;
    Volume: string;
}

document.addEventListener('DOMContentLoaded', function() {
    PopulateMeasurementsTable();

    const toggleButton = document.getElementById('toggleButton') as HTMLButtonElement;
    if (toggleButton) {
        toggleButton.addEventListener('click', PopulateMeasurementsTable);
    }
});

async function PopulateMeasurementsTable(): Promise<void> {
    const tableBody = document.getElementById('measurementsTableBody') as HTMLTableSectionElement;
    const toggleButton = document.getElementById('toggleButton') as HTMLButtonElement;

    if (!tableBody || !toggleButton) return;

    // Clear current table rows
    tableBody.innerHTML = '';

    const measurementsTable: Measurement[] = await LoadMeasurements(toggleButton.value) as Measurement[];

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