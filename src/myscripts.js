//#region /*----------Core Functions----------*/
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for tab navigation buttons
    document.getElementById('degreeCalcTabNavBtn').addEventListener('click', function() {
        showTab('degreesTab');
    });
    // document.getElementById('throwingDistCalcTabNavBtn').addEventListener('click', function() {
    //     showTab('throwingTab');
    // });
    document.getElementById('measurementsTabNavBtn').addEventListener('click', function() {
        showTab('measurementsTab');
        populateMeasurementsTable();
    });
    document.getElementById('advantagesTabNavBtn').addEventListener('click', function() {
        showTab('advantagesTab');
        populateAdvantagesList();
    });
    document.getElementById('conditionsTabNavBtn').addEventListener('click', function() {
        showTab('conditionsTab');
        populateConditionsList();
    });
    document.getElementById('powersTabNavBtn').addEventListener('click', function() {
        showTab('powersTab');
    });

    // // Event listeners for calculator buttons
    document.getElementById('degreeCalcBtn').addEventListener('click', calculateDegrees);
    // document.getElementById('calcThrowDist').addEventListener('click', calculateThrowingDistance);

    // Event listener for toggle button in measurements table
    document.getElementById('toggleButton').addEventListener('click', populateMeasurementsTable);

    // Event listeners for powers tab buttons
    document.getElementById('importPowersBtn').addEventListener('click', function() {
        document.getElementById('importPowers').click();
    });
    document.getElementById('exportPowersBtn').addEventListener('click', exportPowers);
    document.getElementById('addPowerBtn').addEventListener('click', addPower);
    document.getElementById('importPowers').addEventListener('change', importPowers);

    // Event listener for add creature button in conditions tab
    document.getElementById('addCreatureBtn').addEventListener('click', addConditionCreature);
});

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

function generateGuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function capitalizeFirstLetterOfEachWord(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


//---------------------------------------------------CLEAN THIS UP!
//Including resetting its position when the click-out function is called.

let isDragging = false;
let offsetX, offsetY;

// Function to initialize dragging
function initDrag(e) {
    isDragging = true;
    offsetX = e.clientX - tooltipPopup.offsetLeft;
    offsetY = e.clientY - tooltipPopup.offsetTop;
}

// Function to handle mouse movement during dragging
function doDrag(e) {
    if (isDragging) {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Ensure the tooltip popup stays within the viewport bounds
        let maxX = document.documentElement.clientWidth - tooltipPopup.offsetWidth;
        let maxY = document.documentElement.clientHeight - tooltipPopup.offsetHeight;

        // Adjust position to stay within bounds
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Update position
        tooltipPopup.style.left = `${newX}px`;
        tooltipPopup.style.top = `${newY}px`;
    }
}

// Function to stop dragging
function stopDrag() {
    isDragging = false;
}

// Event listeners for dragging
tooltipPopup.addEventListener('mousedown', initDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('mouseup', stopDrag);

document.addEventListener('click', function (e) {
    if (!tooltipPopup.contains(e.target)) {
        tooltipPopup.style.display = 'none';
    }
});

// Prevent closing when clicking inside the tooltip popup
tooltipPopup.addEventListener('click', function (e) {
    e.stopPropagation();
});

//#region /*----------Degrees Calculator Tab Functions----------*/

function calculateDegrees() {
    const dc = parseInt(document.getElementById('dc').value);
    const roll = parseInt(document.getElementById('roll').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(dc) || isNaN(roll)) {
        resultDiv.textContent = 'Please enter valid numbers for both DC and Roll.';
        return;
    }

    const difference = roll - dc;
    let resultMessage = '';

    if (difference >= 0) {
        // Success
        if (difference <= 4) {
            resultMessage = '1 Degree of Success';
        } else if (difference <= 9) {
            resultMessage = '2 Degrees of Success';
        } else if (difference <= 14) {
            resultMessage = '3 Degrees of Success';
        } else {
            resultMessage = '4 Degrees of Success';
        }
    } else {
        // Failure
        if (difference >= -5) {
            resultMessage = '1 Degree of Failure';
        } else if (difference >= -10) {
            resultMessage = '2 Degrees of Failure';
        } else if (difference >= -15) {
            resultMessage = '3 Degrees of Failure';
        } else {
            resultMessage = '4 Degrees of Failure';
        }
    }

    resultDiv.textContent = resultMessage;
}
//#endregion

//#region /*----------Throwing Distance Calculator Tab Functions----------*/
import { GetMeasurementByMassLbs } from './index.ts';

async function calculateThrowingDistance() {
    const strengthRank = parseInt(document.getElementById('strength').value);
    const massRank = parseInt(document.getElementById('massRank').value);
    const massKg = parseFloat(document.getElementById('throwingMassKg').value);
    let massLbs = parseFloat(document.getElementById('throwingMassLbs').value);
    const throwingResultDiv = document.getElementById('throwingResult');

    console.log("Initial massLbs:", massLbs);
    console.log("Initial massKgs:", massKg);

    if (isNaN(strengthRank)) {
        throwingResultDiv.textContent = 'Please enter a valid Strength Rank.';
        return;
    }

    if (!isNaN(massKg)) {
        massLbs = (massKg * 2.20462).toFixed(2); // Conversion factor from kg to lbs
    }

    console.log("Initial massLbs:", massLbs);

    let closestMassRank;
    try {
        closestMassRank = await GetMeasurementByMassLbs(massLbs);
        console.log("result:", closestMassRank);
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
    console.log("Distance: " + distance);

    throwingResultDiv.innerHTML = `Throwing Distance: ${distance}<br/>Distance Rank: ${throwingDistanceRank}${!isNaN(massKg) ? `<br/>Equivalent Mass In Lbs: ${massLbs}` : ''}<br/>Mass Rank: ${massRankValue}<br/><div style="font-size: 10px; font-weight: normal; padding-top: 10px">Calculation: Strength Rank (${strengthRank}) - Mass Rank (${massRankValue}) = Throwing Distance Rank (${throwingDistanceRank})</div>`;
}

import { GetMeasurementByRank } from './index.ts';
async function RankToDistance(rank) {
    // Check if rank is within valid range
    console.log("Rank:" + rank);
    if (rank < 0) {
        console.log("Range < 6 inches");
        return "Range < 6 inches";
    } else if (rank >= 30) {
        console.log("Range > 4 million miles");
        return "Range > 4 million miles";
    }

    // Access the distance value from MeasurementsTable based on rank
    const result = await GetMeasurementByRank(rank);
    console.log("Distance Result:");
    console.log(result);
    return result.Distance;
}
//#endregion

//#region /*----------Measurements Table Tab Functions----------*/
import { LoadMeasurements } from './index.ts';

async function populateMeasurementsTable() {
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
//#endregion

//#region /*----------Advantages Tab Functions----------*/
import { GetAdvantages, GetToolTipByTag, GetToolTipById } from "./index.ts";

async function populateAdvantagesList() {
    const advantagesListElement = document.getElementById('advantagesList');
    advantagesListElement.innerHTML = '';
    console.log("before get");
    const advantages = await GetAdvantages();

    console.log("Test");
    console.log(advantages);
    await Promise.all(advantages.map(async advantage => {
        console.log(advantage);
        const listItem = document.createElement('li');

        const advantageContainer = document.createElement('div'); // Create a container for advantage name and checkbox
        advantageContainer.classList.add('advantage-container');

        const nameElement = document.createElement('strong');
        nameElement.textContent = advantage.AdvantageName;
        advantageContainer.appendChild(nameElement);

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = advantage.Selected;
        checkbox.addEventListener('change', () => {
            advantage.Selected = checkbox.checked;
            reFilterAdvantages();
        });
        advantageContainer.appendChild(checkbox);

        listItem.appendChild(advantageContainer);

        let descriptionHtml = advantage.Description;

        // Use a regular expression to find all instances of words within {}
        const regex = /\{(.*?)\}/g;
        let match;
        while ((match = regex.exec(descriptionHtml)) !== null) {
            const word = match[1];
            const tooltip = await GetToolTipByTag(word);
            console.log("Tooltip: " + tooltip);
            console.log(tooltip);
            console.log(descriptionHtml);
            descriptionHtml = descriptionHtml.replace(`{${word}}`, `<span class="tooltip" data-tooltip-index="${tooltip.TooltipId}">${tooltip.TooltipTag}</span>`);
            console.log(descriptionHtml);
        }

        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'description';
        descriptionElement.innerHTML = descriptionHtml;
        listItem.appendChild(descriptionElement);

        listItem.addEventListener('click', () => {
            if (!event.target.matches('input[type="checkbox"]')) {
                listItem.classList.toggle('expanded');
            }
        });

        // Add event listener for tooltips
        const tooltips = listItem.querySelectorAll('.tooltip');
        console.log(tooltips);
        tooltips.forEach((tooltip) => {
            tooltip.addEventListener('click', async (event) => {
                event.stopPropagation(); // Prevent toggling the 'expanded' class on li
                const tooltipIndex = event.target.getAttribute('data-tooltip-index');
                const tooltip = await GetToolTipById(tooltipIndex);
                showTooltipPopup(tooltip, event);
            });
        });


        return listItem;
    })).then(listItems => {
        listItems.forEach(listItem => {
            advantagesListElement.appendChild(listItem);
        });
    });
}

function showTooltipPopup(tooltipData, event) {
    console.log(tooltipData);
    const tooltipPopup = document.getElementById('tooltipPopup');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipContent = document.getElementById('tooltipContent');

    tooltipTitle.innerHTML = tooltipData.TooltipTag;
    tooltipContent.innerHTML = tooltipData.TooltipDescription;
    tooltipPopup.style.display = 'block';

    // Position the tooltip
    let top = event.clientY + 10;
    let left = event.clientX + 10;

    // Adjust if the tooltip goes off-screen
    const rect = tooltipPopup.getBoundingClientRect();
    console.log("rect");
    console.log(rect);
    if (top + rect.height > window.innerHeight) {
        top = window.innerHeight - rect.height - 10;
    }
    if (left + rect.width > window.innerWidth) {
        left = window.innerWidth - rect.width - 10;
    }

    tooltipPopup.style.left = left + 'px';
    tooltipPopup.style.top = top + 'px';
}

function filterAdvantages() {
    const searchInput = document.getElementById('searchAdvantages');
    const filterValue = searchInput.value.trim().toLowerCase();
    const listItems = document.querySelectorAll('#advantagesList li');

    const showSelectedOnly = document.getElementById('filterAdvantagesCheckbox').checked;

    listItems.forEach(item => {
        const text = item.querySelector('strong').textContent.trim().toLowerCase();
        const isSelected = advantages.find(advantage => advantage.Name.toLowerCase() === text.toLowerCase());

        if (showSelectedOnly && (!isSelected || !isSelected.Selected)) {
            item.style.visibility = 'hidden';
            item.style.height = '0';
            item.style.border = '0';
            item.style.margin = '0';
            item.style.padding = '0';
        } else {
            const match = text.includes(filterValue);
            if (match) {
                item.style.visibility = 'visible';
                item.style.height = '';
                item.style.border = '';
                item.style.margin = '';
                item.style.padding = '';
            } else {
                item.style.visibility = 'hidden';
                item.style.height = '0';
                item.style.border = '0';
                item.style.margin = '0';
                item.style.padding = '0';
            }
        }
    });
}

function reFilterAdvantages() {
    const showSelectedOnly = document.getElementById('filterAdvantagesCheckbox').checked;

    if (showSelectedOnly) {
        filterAdvantages();
    }
}

//#endregion

//#region /*----------Conditions Tab Functions----------*/
import { GetBasicConditions, GetCombinedConditions } from "./index.ts";

async function populateConditionsList() {
    const conditionsLists = {
        'baseConditionsUList': await GetBasicConditions(),
        'combinedConditionsUList': await GetCombinedConditions()
    };

    for (const [elementId, conditions] of Object.entries(conditionsLists)) {
        const conditionsListElement = document.getElementById(elementId);
        conditionsListElement.innerHTML = '';
        conditions.forEach(condition => {
            const listItem = createListItem(condition);
            conditionsListElement.appendChild(listItem);
        });
    }
}

function createListItem(condition) {
    const listItem = document.createElement('li');

    const conditionContainer = document.createElement('div');
    conditionContainer.classList.add('condition-container');

    const nameElement = document.createElement('strong');
    nameElement.textContent = condition.ConditionName;
    conditionContainer.appendChild(nameElement);

    listItem.appendChild(conditionContainer);

    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'description';
    descriptionElement.innerHTML = condition.Description;
    listItem.appendChild(descriptionElement);

    listItem.addEventListener('click', () => {
        listItem.classList.toggle('expanded');
    });

    return listItem;
}

async function addConditionCreature() {
    const creaturesList = document.getElementById("creaturesList");
    const creatureId = generateGuid();
    const creatureDiv = await createCreatureDiv(creatureId);

    creaturesList.appendChild(creatureDiv);

    // Save to local storage
    saveCreaturesToLocalStorage();
}

async function createCreatureDiv(creatureId) {
    const creatureDiv = document.createElement("div");
    creatureDiv.id = creatureId;
    creatureDiv.classList.add("creature");

    const creatureHeader = createCreatureHeader(creatureId, creatureDiv);
    const buttonsContainer = await createConditionsButtonsContainer(creatureId);

    const effectsList = document.createElement("ul");
    effectsList.classList.add("effects-list");
    effectsList.id = `effects-${creatureId}`;

    const effectsTitle = document.createElement("h4");
    effectsTitle.innerText = "Total Effects";

    creatureDiv.appendChild(creatureHeader);
    creatureDiv.appendChild(buttonsContainer);
    creatureDiv.appendChild(effectsTitle);
    creatureDiv.appendChild(effectsList);

    return creatureDiv;
}

function createCreatureHeader(creatureId, creatureDiv) {
    const creatureHeader = document.createElement("div");
    creatureHeader.classList.add("creature-header");

    // Create delete button with dustbin icon
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "🗑"; // using an emoji for the dustbin icon; replace with icon as needed
    deleteButton.addEventListener("click", () => {
        creatureDiv.remove();
        saveCreaturesToLocalStorage();
    });

    const creatureTitle = document.createElement("h3");
    creatureTitle.innerText = "Creature Name:";

    const creatureNameInput = document.createElement("input");
    creatureNameInput.type = "text";
    creatureNameInput.placeholder = "Enter creature name...";
    creatureNameInput.classList.add("creature-name-input");

    creatureHeader.appendChild(deleteButton);
    creatureHeader.appendChild(creatureTitle);
    creatureHeader.appendChild(creatureNameInput);

    const creatureInjuryTitle = document.createElement("h5");
    creatureInjuryTitle.innerText = "Injuries:";

    const creatureInjuryInput = document.createElement("input");
    creatureInjuryInput.type = "text";
    creatureInjuryInput.placeholder = "0";
    creatureInjuryInput.classList.add("creature-injury-input");

    creatureHeader.appendChild(creatureInjuryTitle);
    creatureHeader.appendChild(creatureInjuryInput);

    return creatureHeader;
}

async function createConditionsButtonsContainer(creatureId) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("conditions-buttons-container");

    try {
        const basicConditions = await GetBasicConditions();
        const combinedConditions = await GetCombinedConditions();

        appendConditionsButtons(buttonsContainer, "Basic Conditions", basicConditions, creatureId, false);
        appendConditionsButtons(buttonsContainer, "Combined Conditions", combinedConditions, creatureId, true);
    } catch (error) {
        console.error("Error fetching conditions: ", error);
    }

    return buttonsContainer;
}

function appendConditionsButtons(container, titleText, conditions, creatureId, isCombined) {
    const title = document.createElement("h4");
    title.innerText = titleText;
    container.appendChild(title);

    conditions.sort((a, b) => a.ConditionName.localeCompare(b.ConditionName)).forEach(condition => {
        const conditionBtn = document.createElement("button");
        conditionBtn.innerText = condition.ConditionName;
        conditionBtn.setAttribute("data-condition", condition.ConditionName);
        conditionBtn.addEventListener("click", function () {
            if (conditionBtn.classList.contains("red")) {
                conditionBtn.classList.remove("red");
                removeEffectFromCreature(creatureId, condition.ConditionName, isCombined);
            } else {
                conditionBtn.classList.add("red");
                addEffectToCreature(creatureId, condition.ConditionName, isCombined);
            }
        });
        container.appendChild(conditionBtn);
    });
}

import { GetCombinedConditionByConditionName } from "./index.ts";
async function addEffectToCreature(creatureId, effectName, isCombinedCondition = false) {
    const effectsList = document.getElementById(`effects-${creatureId}`);
    const effectItem = document.createElement("li");

    if (isCombinedCondition) {
        const combinedCondition = await GetCombinedConditionByConditionName(effectName);
        effectItem.dataset.basicConditions = JSON.stringify(combinedCondition.BasicConditions.split(','));
        appendCombinedCondition(effectItem, combinedCondition);
    } else {
        const basicCondition = await GetBasicConditionByConditionName(effectName);
        appendBasicCondition(effectItem, basicCondition);
    }

    effectsList.appendChild(effectItem);
    preventDuplicateBasicCondition(effectName);

    // Save to local storage
    saveCreaturesToLocalStorage();
}

import { GetBasicConditionByConditionName } from "./index.ts";
function appendCombinedCondition(effectItem, combinedCondition) {
    if (combinedCondition) {
        const description = `<b>${combinedCondition.ConditionName}: </b>${combinedCondition.DescriptionSummary}`;
        effectItem.innerHTML = description;

        const subList = document.createElement("ul");
        console.log("CCCC");
        console.log(combinedCondition.BasicConditions);
        combinedCondition.BasicConditions.split(',').forEach(async basicConditionName => {
            const basicCondition = await GetBasicConditionByConditionName(basicConditionName);
            if (basicCondition) {
                const subListItem = document.createElement("li");
                subListItem.innerHTML = `<b>${basicCondition.ConditionName}: </b>${basicCondition.DescriptionSummary}`;
                subList.appendChild(subListItem);
            }
        });
        effectItem.appendChild(subList);
    }
}

function appendBasicCondition(effectItem, basicCondition) {
    if (basicCondition) {
        effectItem.innerHTML = `<b>${basicCondition.ConditionName}: </b>${basicCondition.DescriptionSummary}`;
    }
}

function preventDuplicateBasicCondition(effectName) {
    const basicConditionBtn = document.querySelector(`button[data-condition="${effectName}"]`);
    if (basicConditionBtn && basicConditionBtn.classList.contains("grey")) {
        alert("This basic condition is currently part of an active combined condition and cannot be added individually.");
        return;
    }
}

async function removeEffectFromCreature(creatureId, effectName, isCombinedCondition = false) {
    const effectsList = document.getElementById(`effects-${creatureId}`);
    const effectItemToRemove = Array.from(effectsList.getElementsByTagName("li")).find(item =>
        item.innerHTML.includes(`<b>${effectName}: </b>`));

    if (effectItemToRemove) {
        if (isCombinedCondition) {
            await reEnableBasicConditionButtons(effectItemToRemove, effectsList);
        }
        effectsList.removeChild(effectItemToRemove);

        // Save to local storage
        saveCreaturesToLocalStorage();
    }
}

async function reEnableBasicConditionButtons(effectItemToRemove, effectsList) {
    const basicConditionsList = JSON.parse(effectItemToRemove.dataset.basicConditions);
    for (const basicConditionName of basicConditionsList) {
        if (!await isBasicConditionPartOfOtherCombined(effectItemToRemove, effectsList, basicConditionName)) {
            const basicConditionBtn = document.querySelector(`button[data-condition="${basicConditionName}"]`);
            if (basicConditionBtn) {
                basicConditionBtn.classList.remove("grey");
                basicConditionBtn.disabled = false;
            }
        }
    }
}

async function isBasicConditionPartOfOtherCombined(effectItemToRemove, effectsList, basicConditionName) {
    return Array.from(effectsList.children).some(async child =>
        child !== effectItemToRemove &&
        JSON.parse(child.dataset.basicConditions || "[]").includes(basicConditionName));
}

function removeBasicConditionFromList(effectsList, basicConditionName) {
    const basicEffectDescription = `<b>${basicConditionName}: </b>`;
    const basicEffectItemToRemove = Array.from(effectsList.getElementsByTagName("li")).find(item =>
        item.innerHTML.includes(basicEffectDescription));
    if (basicEffectItemToRemove) {
        effectsList.removeChild(basicEffectItemToRemove);
    }
}

function saveCreaturesToLocalStorage() {
    const creaturesList = document.getElementById("creaturesList");
    const creatures = [];

    creaturesList.childNodes.forEach(creatureDiv => {
        const creature = {
            id: creatureDiv.id,
            name: creatureDiv.querySelector(".creature-name-input").value,
            injuries: creatureDiv.querySelector(".creature-injury-input").value,
            activeConditions: []
        };

        const conditionButtons = creatureDiv.querySelectorAll('button[data-condition]');
        conditionButtons.forEach(button => {
            if (button.classList.contains('red')) {
                creature.activeConditions.push(button.getAttribute('data-condition'));
            }
        });

        creatures.push(creature);
    });

    localStorage.setItem("creatures", JSON.stringify(creatures));
}

function loadCreaturesFromLocalStorage() {
    const creaturesList = document.getElementById("creaturesList");
    const creatures = JSON.parse(localStorage.getItem("creatures"));

    if (creatures) {
        creatures.forEach(async creature => {
            const creatureDiv = await createCreatureDiv(creature.id);

            // Set the saved name and injuries
            const nameInput = creatureDiv.querySelector(".creature-name-input");
            nameInput.value = creature.name;

            const injuryInput = creatureDiv.querySelector(".creature-injury-input");
            injuryInput.value = creature.injuries;

            // Append the creature to the list first
            creaturesList.appendChild(creatureDiv);

            // Simulate button clicks to activate conditions
            for (const conditionName of creature.activeConditions) {
                const button = creatureDiv.querySelector(`button[data-condition="${conditionName}"]`);
                if (button) {
                    button.classList.add("red");
                    await addEffectToCreature(creature.id, conditionName, false);
                }
            }
        });
    }
}
//#endregion

//#region /*----------Powers Tab Functions----------*/
function addPower() {
    let power = {
        powerId: generateGuid(),
        name: '',
        description: '',
        extras: '',
        flaws: '',
        totalCost: 0,
        included: false
    };

    savePowersToLocalStorage(power);
    renderPowers();
}

function loadPowersFromLocalStorage() {
    const localPowers = JSON.parse(localStorage.getItem('powers')) || [];

    if (localPowers !== undefined && localPowers.length != 0) {
        powers.push(...localPowers);
    }

    renderPowers();
}

function renderPowers() {
    generatePowerTable();

    updateTotalPowersCost();
}

function generatePowerTable() {
    const numColumns = document.getElementById('powersNumColumns').value || 2;
    const tableContainer = document.getElementById('powersTableContainer');

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

                cell.appendChild(getPowerHtml(powers[powerBoxIndex]));
                powerBoxIndex++;
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Append table to the container
    tableContainer.appendChild(table);
}

function getPowerHtml(power) {
    if (power == null) {
        return;
    }

    //-----Create the encompassing powerBox div-----//
    // Create the main powerBox div
    const powerBoxDiv = document.createElement('div');
    powerBoxDiv.classList.add('powerBox');
    powerBoxDiv.id = power.powerId;

    if (power.included) {
        powerBoxDiv.classList.add('power-active');
    }

    //-----Create the Power Header section-----//
    // Create the powerHeader Div
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
                updatePower(power.powerId, 'name', this.value);
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
                    updatePower(power.powerId, 'included', this.checked);
                    updateTotalPowersCost();
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
                removePower(power.powerId);
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
                inputValue: ((parseInt(power.ppPerRank || 0)) * parseInt(power.ranks || 0)) + parseInt(power.miscPP || 0),
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
                    costInput.value = costItem.inputValue;
                    costInput.readOnly = costItem.readonly || false;
                    costInput.onchange = function () {
                        updatePower(power.powerId, costItem.powerKey, this.value);
                    };

                    return costInput;
                })());

                return costItemDiv;
            })());
        });

        return powerCost
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
                    updatePower(power.powerId, item.key, this.value);
                };
                return textarea;
            })());
        });

        return powerDescription
    })());

    return powerBoxDiv;
}

function updatePower(powerId, field, value) {
    const index = powers.findIndex(power => power.powerId === powerId);

    if (index === -1) {
        console.error(`Power with powerId '${powerId}' not found`);
        return;
    }

    powers[index][field] = field === 'totalCost' ? parseInt(value) || 0 : value;

    renderPowers();
    savePowersToLocalStorage();
}

function savePowersToLocalStorage(power) {
    if (power !== null && typeof power === 'object') {
        powers.push(power);
    }
    localStorage.setItem('powers', JSON.stringify(powers));
}

function removePower(powerId) {
    const powerElement = document.getElementById(powerId);
    if (powerElement) {
        powerElement.remove();
        removePowerFromLocalStorage(powerId);
    }
    renderPowers();
}

function removePowerFromLocalStorage(powerId) {
    if (powerId !== null) {
        const index = powers.findIndex(power => power.powerId === powerId);

        if (index > -1) {
            powers.splice(index, 1);
        }

        localStorage.setItem('powers', JSON.stringify(powers));
    }
}

function updateTotalPowersCost() {
    let totalCost = 0;
    document.querySelectorAll('.powerBox').forEach(item => {
        const includePowerCheckbox = item.querySelector('.includePower');
        const totalPointCostInput = item.querySelector('#totalCost');
        if (includePowerCheckbox && includePowerCheckbox.checked) {
            totalCost += parseInt(totalPointCostInput.value || '0', 10);
        }
    });
    document.getElementById('totalPointCost').textContent = totalCost;
}

function exportPowers() {
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

function importPowers(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedPowers = JSON.parse(e.target.result);
            // Validate the imported data (basic validation)
            if (Array.isArray(importedPowers) && importedPowers.every(item => item.name && item.description)) {
                powers.splice(0, powers.length, ...importedPowers);
                renderPowers();
            } else {
                alert("Invalid JSON file structure.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };
    reader.readAsText(file);
}
//#endregion

const powers = [];