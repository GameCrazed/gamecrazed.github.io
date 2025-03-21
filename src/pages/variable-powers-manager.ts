import './variable-power-manager.css';
import { SavePowersToCookies, LoadPowersFromCookies } from '../services/cookie-handler';
import { GenerateGuid } from '../services/guid-handler';

interface Power {
    powerId: string;
    name: string;
    description: string;
    extras: string;
    flaws: string;
    totalCost: number;
    included: boolean;
    ranks: number;
    ppPerRank: number;
    miscPP: number;
}

const powers: Power[] = [];

document.addEventListener('DOMContentLoaded', function () {
    powers.push(...LoadPowersFromCookies());
    RenderPowers();

    document.getElementById('addPowerBtn')?.addEventListener('click', AddPower);
    document.getElementById('generatePowersTableBtn')?.addEventListener('click', GeneratePowerTable);
    document.getElementById('importPowersBtn')?.addEventListener('click', () => document.getElementById('importPowers')?.click());
    document.getElementById('importPowers')?.addEventListener('change', ImportPowers);
    document.getElementById('exportPowersBtn')?.addEventListener('click', ExportPowers);
});

function AddPower(): void {
    const power: Power = {
        powerId: GenerateGuid(),
        name: '',
        description: '',
        extras: '',
        flaws: '',
        totalCost: 0,
        included: false,
        ranks: 0,
        ppPerRank: 0,
        miscPP: 0
    };

    powers.push(power);
    SavePowersToCookies(powers);
    RenderPowers();
}

function RenderPowers(): void {
    GeneratePowerTable();
    UpdateTotalPowersCost();
}

function GeneratePowerTable(): void {
    const numColumns = parseInt((document.getElementById('powersNumColumns') as HTMLInputElement)?.value) || 2;
    const tableContainer = document.getElementById('powersTableContainer');

    if (!tableContainer) return;

    // Clear any existing table
    tableContainer.innerHTML = '';

    // Create table element
    const table = document.createElement('table');
    table.setAttribute('id', 'powers-table');

    // Counter to keep track of powerBox elements
    let powerBoxIndex = 0;

    // Create (powers/column)rndUp rows, or 2 if no powers
    for (let i = 0; i < (powers.length > 0 ? Math.ceil(powers.length / (numColumns || 2)) : 2); i++) {
        const row = document.createElement('tr');

        // Create cells for each row based on the number of columns (default is 2 columns)
        for (let j = 0; j < numColumns; j++) {
            const cell = document.createElement('td');
            cell.style.width = `${100 / numColumns}%`;

            // Check if there are enough powerBoxes
            if (powerBoxIndex < powers.length) {
                // Append the powerBox to the cell
                cell.appendChild(GetPowerHtml(powers[powerBoxIndex]));
                powerBoxIndex++;
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Append table to the container
    tableContainer.appendChild(table);
}

function GetPowerHtml(power: Power): HTMLDivElement {

    // Create the main powerBox div
    const powerBoxDiv = document.createElement('div');
    powerBoxDiv.classList.add('powerBox');
    powerBoxDiv.id = power.powerId;

    if (power.included) {
        powerBoxDiv.classList.add('power-active');
    }

    // Create the Power Header section
    powerBoxDiv.appendChild((function () {
        const powerHeaderDiv = document.createElement('div');
        powerHeaderDiv.className = 'powerHeader';

        // Create the powerName input field
        powerHeaderDiv.appendChild((function () {
            const powerNameInput = document.createElement('input');
            powerNameInput.id = 'powerName';
            powerNameInput.type = 'text';
            powerNameInput.placeholder = 'Power Name';
            powerNameInput.value = power.name || '';
            powerNameInput.onchange = function () {
                UpdatePower(power.powerId, 'name', (this as HTMLInputElement).value);
            };

            return powerNameInput;
        })());

        // Create the checkboxContainer div
        powerHeaderDiv.appendChild((function () {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkboxContainer';

            // Create the checkboxLabel label
            checkboxContainer.appendChild((function () {
                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = 'Power Active';

                return checkboxLabel;
            })());

            // Create the includePowerCheckbox checkbox
            checkboxContainer.appendChild((function () {
                const includePowerCheckbox = document.createElement('input');
                includePowerCheckbox.type = 'checkbox';
                includePowerCheckbox.className = 'includePower';
                includePowerCheckbox.checked = power.included ? true : false;
                includePowerCheckbox.onchange = function () {
                    UpdatePower(power.powerId, 'included', (this as HTMLInputElement).checked);
                    UpdateTotalPowersCost();
                };

                return includePowerCheckbox;
            })());

            return checkboxContainer;
        })());

        // Create the removePower button
        powerHeaderDiv.appendChild((function () {
            const removePowerButton = document.createElement('button');
            removePowerButton.className = 'delete-button';
            removePowerButton.textContent = 'Remove';
            removePowerButton.onclick = function () {
                RemovePower(power.powerId);
            };
            return removePowerButton;
        })());

        return powerHeaderDiv;
    })());

    //-----Create the Power Cost section-----//
    powerBoxDiv.appendChild((function () {
        const powerCost = document.createElement('div');
        powerCost.className = 'powerCost';

        const costItemInputs = [
            {
                labelText: 'Ranks',
                inputValue: power.ranks || '',
                powerKey: 'ranks'
            },
            {
                labelText: 'PP/Rank',
                inputValue: power.ppPerRank || '',
                powerKey: 'ppPerRank'
            },
            {
                labelText: 'Misc',
                inputValue: power.miscPP || '',
                powerKey: 'miscPP'
            },
            {
                labelText: 'Total',
                inputValue: ((parseInt(power.ppPerRank?.toString() || '0')) * parseInt(power.ranks?.toString() || '0')) + parseInt(power.miscPP?.toString() || '0'),
                powerKey: 'totalCost',
                readonly: true
            }
        ];

        costItemInputs.forEach(costItem => {
            powerCost.appendChild((function () {
                const costItemDiv = document.createElement('div');
                costItemDiv.className = 'costItem';

                costItemDiv.appendChild((function () {
                    const costLabel = document.createElement('label');
                    costLabel.textContent = costItem.labelText;

                    return costLabel;
                })());

                costItemDiv.appendChild((function () {
                    const costInput = document.createElement('input');
                    costInput.id = costItem.powerKey;
                    costInput.type = 'text';
                    costInput.inputMode = 'numeric';
                    costInput.placeholder = costItem.labelText;
                    costInput.value = costItem.inputValue.toString();
                    costInput.readOnly = costItem.readonly || false;
                    costInput.onchange = function () {
                        UpdatePower(power.powerId, costItem.powerKey as keyof Power, (this as HTMLInputElement).value);
                    };

                    return costInput;
                })());

                return costItemDiv;
            })());
        });

        return powerCost;
    })());

    ////-----Create the Power Description section-----//
    powerBoxDiv.appendChild((function () {
        const powerDescription = document.createElement('div');

        const textAreas = [
            {
                placeholder: 'Description',
                value: power.description || '',
                key: 'description'
            },
            {
                placeholder: 'Extras',
                value: power.extras || '',
                key: 'extras'
            },
            {
                placeholder: 'Flaws',
                value: power.flaws || '',
                key: 'flaws'
            }
        ];

        textAreas.forEach(item => {
            powerDescription.appendChild((function () {
                const textarea = document.createElement('textarea');
                textarea.placeholder = item.placeholder;
                textarea.value = item.value;
                textarea.onchange = function () {
                    UpdatePower(power.powerId, item.key as keyof Power, (this as HTMLTextAreaElement).value);
                };
                return textarea;
            })());
        });

        return powerDescription;
    })());

    return powerBoxDiv;
}

function UpdatePower(powerId: string, field: keyof Power, value: any): void {
    const index = powers.findIndex(power => power.powerId === powerId);

    if (index === -1) {
        console.error(`Power with powerId '${powerId}' not found`);
        return;
    }

    (powers[index][field] as any) = field === 'totalCost' ? parseInt(value) || 0 : value;

    SavePowersToCookies(powers); // Save the updated powers array to cookies
    RenderPowers();
}

function RemovePower(powerId: string): void {
    const index = powers.findIndex(power => power.powerId === powerId);

    if (index === -1) {
        console.error(`Power with powerId '${powerId}' not found`);
        return;
    }

    powers.splice(index, 1); // Remove the power from the array
    SavePowersToCookies(powers); // Save the updated powers array to cookies
    RenderPowers(); // Re-render the powers
}

function UpdateTotalPowersCost(): void {
    let totalCost = 0;
    document.querySelectorAll<HTMLDivElement>('.powerBox').forEach(item => {
        const includePowerCheckbox = item.querySelector<HTMLInputElement>('.includePower');
        const totalPointCostInput = item.querySelector<HTMLInputElement>('#totalCost');
        if (includePowerCheckbox && includePowerCheckbox.checked) {
            totalCost += parseInt(totalPointCostInput?.value || '0', 10);
        }
    });
    const totalPointCostElement = document.getElementById('totalPointCost');
    if (totalPointCostElement) {
        totalPointCostElement.textContent = totalCost.toString();
    }
}

function ExportPowers(): void {
    const dataStr = JSON.stringify(powers, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "powers.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function ImportPowers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedPowers: Power[] = JSON.parse(e.target?.result as string);
            // Validate the imported data (basic validation)
            const requiredFields: (keyof Power)[] = ['powerId', 'name', 'description', 'extras', 'flaws', 'totalCost', 'included'];
            const isValid = Array.isArray(importedPowers) && importedPowers.every(item =>
                requiredFields.every(field => field in item)
            );

            if (isValid) {
                powers.splice(0, powers.length, ...importedPowers);
                SavePowersToCookies(powers); // Save the imported powers to cookies
                RenderPowers();
            } else {
                alert("Invalid JSON file structure.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };
    reader.readAsText(file);
}