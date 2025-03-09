
//#region /*----------Core Functions----------*/
        // window.onload = () => {
        //     // Navigation Tab Buttons
        //     document.getElementById("degreeCalcTabNavBtn").addEventListener("click", function () { showTab("degreesTab"); }, false);
        //     document.getElementById("throwingDistCalcTabNavBtn").addEventListener("click", function () { showTab("throwingTab"); }, false);
        //     document.getElementById("measurementsTabNavBtn").addEventListener("click", function () { showTab("measurementsTab"); }, false);
        //     document.getElementById("advantagesTabNavBtn").addEventListener("click", function () { showTab("advantagesTab"); }, false);
        //     document.getElementById("conditionsTabNavBtn").addEventListener("click", function () { showTab("conditionsTab"); }, false);
        //     document.getElementById("powersTabNavBtn").addEventListener("click", function () { showTab("powersTab"); }, false);

        //     // Page Buttons
        //     document.getElementById("degreeCalcBtn").addEventListener("click", calculateDegrees, false);
        //     document.getElementById("calcThrowDist").addEventListener("click", calculateThrowingDistance, false);
        //     document.getElementById("addPowerBtn").addEventListener("click", addPower, false);
        //     document.getElementById("exportPowersBtn").addEventListener("click", exportPowers, false);
        //     document.getElementById('importPowersBtn').addEventListener('click', () => { document.getElementById('importPowers').click(); });
        //     document.getElementById('importPowers').addEventListener('change', importPowers);
        //     document.getElementById('addCreatureBtn').addEventListener('click', addConditionCreature);

        //     // Populate Tables and Lists
        //     populateMeasurementsTable();
        //     populateAdvantagesList();
        //     populateConditionsList();
        //     loadPowersFromLocalStorage();
        //     loadCreaturesFromLocalStorage();

        //     // Search Bars
        //     const powersSearchInput = document.getElementById('searchAdvantages');
        //     powersSearchInput.addEventListener('input', filterAdvantages);
        //     document.getElementById('filterAdvantagesCheckbox').addEventListener('change', filterAdvantages);

        // };

        document.addEventListener('DOMContentLoaded', function() {
            // Event listeners for tab navigation buttons
            document.getElementById('degreeCalcTabNavBtn').addEventListener('click', function() {
                showTab('degreesTab');
            });
            document.getElementById('throwingDistCalcTabNavBtn').addEventListener('click', function() {
                showTab('throwingTab');
            });
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
        
            // Event listeners for calculator buttons
            document.getElementById('degreeCalcBtn').addEventListener('click', calculateDegrees);
            document.getElementById('calcThrowDist').addEventListener('click', calculateThrowingDistance);
        
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
        function calculateThrowingDistance() {
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
                massLbs = massKg * 2.20462; // Conversion factor from kg to lbs
            }

            let massRankValue;
            if (!isNaN(massRank)) {
                massRankValue = massRank;
            } else if (!isNaN(massLbs)) {
                for (let i = 0; i < measurementsTable.length; i++) {
                    if (i === 0 && massLbs <= measurementsTable[i].MassInLbs) {
                        massRankValue = measurementsTable[i].Rank;
                        break;
                    } else if (i > 0 && massLbs > measurementsTable[i - 1].MassInLbs && massLbs <= measurementsTable[i].MassInLbs) {
                        massRankValue = measurementsTable[i].Rank;
                        break;
                    }
                }
            } else {
                throwingResultDiv.textContent = 'Please enter a Mass Rank or Weight.';
                return;
            }

            const throwingDistanceRank = strengthRank - massRankValue + 5;
            const distance = rankToDistance(throwingDistanceRank);

            throwingResultDiv.innerHTML = `Throwing Distance: ${distance}<br/>Distance Rank: ${throwingDistanceRank - 5}${!isNaN(massKg) ? `<br/>Equivalent Mass In Lbs: ${massLbs.toFixed(2)}` : ''}<br/>Mass Rank: ${massRankValue}<br/><div style="font-size: 10px; font-weight: normal; padding-top: 10px">Calculation: Strength Rank (${strengthRank}) - Mass Rank (${massRankValue}) = Throwing Distance Rank (${throwingDistanceRank - 5})</div>`;
        }

        function rankToDistance(rank) {
            // Check if rank is within valid range
            if (rank < 0) {
                return "Range < 6 inches";
            } else if (rank >= measurementsTable.length) {
                return "Range > 4 million miles";
            }

            // Access the distance value from measurementsTable based on rank
            return measurementsTable[rank].Distance;
        }
        //#endregion

        //#region /*----------Measurements Table Tab Functions----------*/
        import { loadMeasurements } from './dist/bundle.js';

        async function populateMeasurementsTable() {
            const tableBody = document.getElementById('measurementsTableBody');
            const toggleButton = document.getElementById('toggleButton');

            // Clear current table rows
            tableBody.innerHTML = '';

            const measurementsTable = await loadMeasurements(toggleButton.value);

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
        function populateAdvantagesList() {
            const advantagesListElement = document.getElementById('advantagesList');
            advantagesListElement.innerHTML = '';

            advantages.forEach(advantage => {
                const listItem = document.createElement('li');

                const advantageContainer = document.createElement('div'); // Create a container for advantage name and checkbox
                advantageContainer.classList.add('advantage-container');

                const nameElement = document.createElement('strong');
                nameElement.textContent = advantage.Name;
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

                advantage.Tooltips.forEach((tooltip, index) => {
                    const tooltipHtml = `<span class="tooltip" data-tooltip-index="${index}">${tooltip.TooltipTag}</span>`;
                    descriptionHtml = descriptionHtml.replace(`{tooltip${index}}`, tooltipHtml);
                });

                const descriptionElement = document.createElement('div');
                descriptionElement.className = 'description';
                descriptionElement.innerHTML = descriptionHtml;
                listItem.appendChild(descriptionElement);

                listItem.addEventListener('click', () => {
                    if (!event.target.matches('input[type="checkbox"]')) {
                        listItem.classList.toggle('expanded');
                    }
                });

                //---------------------------------------------------CLEAN THIS UP!
                // Add event listener for tooltips
                const tooltips = listItem.querySelectorAll('.tooltip');
                tooltips.forEach((tooltip, index) => {
                    tooltip.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent toggling the 'expanded' class on li
                        showTooltipPopup(advantage.Tooltips[index]);
                    });
                });


                advantagesListElement.appendChild(listItem);
            });
        }

        //---------------------------------------------------CLEAN THIS UP!
        function showTooltipPopup(tooltipData) {
            const tooltipPopup = document.getElementById('tooltipPopup');
            const tooltipTitle = document.getElementById('tooltipTitle');
            const tooltipContent = document.getElementById('tooltipContent');

            tooltipTitle.innerHTML = capitalizeFirstLetterOfEachWord(tooltipData.TooltipTag);
            tooltipContent.innerHTML = tooltipData.TooltipDescription;
            tooltipPopup.style.display = 'block';
            tooltipPopup.style.left = event.clientX + 'px';
            tooltipPopup.style.top = event.clientY + 'px';
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
        function populateConditionsList() {
            const conditionsLists = {
                'baseConditionsUList': basicConditions,
                'combinedConditionsUList': combinedConditions
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
            nameElement.textContent = condition.Name;
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

        function addConditionCreature() {
            const creaturesList = document.getElementById("creaturesList");
            const creatureId = generateGuid();
            const creatureDiv = createCreatureDiv(creatureId);

            creaturesList.appendChild(creatureDiv);

            // Save to local storage
            saveCreaturesToLocalStorage();
        }

        function createCreatureDiv(creatureId) {
            const creatureDiv = document.createElement("div");
            creatureDiv.id = creatureId;
            creatureDiv.classList.add("creature");

            const creatureHeader = createCreatureHeader(creatureId, creatureDiv);
            const buttonsContainer = createConditionsButtonsContainer(creatureId);

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

        function createConditionsButtonsContainer(creatureId) {
            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("conditions-buttons-container");

            appendConditionsButtons(buttonsContainer, "Basic Conditions", basicConditions, creatureId, false);
            appendConditionsButtons(buttonsContainer, "Combined Conditions", combinedConditions, creatureId, true);

            return buttonsContainer;
        }

        function appendConditionsButtons(container, titleText, conditions, creatureId, isCombined) {
            const title = document.createElement("h4");
            title.innerText = titleText;
            container.appendChild(title);

            conditions.sort((a, b) => a.Name.localeCompare(b.Name)).forEach(condition => {
                const conditionBtn = document.createElement("button");
                conditionBtn.innerText = condition.Name;
                conditionBtn.setAttribute("data-condition", condition.Name);
                conditionBtn.addEventListener("click", function () {
                    if (conditionBtn.classList.contains("red")) {
                        conditionBtn.classList.remove("red");
                        removeEffectFromCreature(creatureId, condition.Name, isCombined);
                    } else {
                        conditionBtn.classList.add("red");
                        addEffectToCreature(creatureId, condition.Name, isCombined);
                    }
                });
                container.appendChild(conditionBtn);
            });
        }

        function addEffectToCreature(creatureId, effectName, isCombinedCondition = false) {
            const effectsList = document.getElementById(`effects-${creatureId}`);
            const effectItem = document.createElement("li");

            if (isCombinedCondition) {
                const combinedCondition = combinedConditions.find(c => c.Name === effectName);
                appendCombinedCondition(effectItem, combinedCondition);
                //disableBasicConditionButtons(combinedCondition);
                effectItem.dataset.basicConditions = JSON.stringify(combinedCondition.basicConditions);

            } else {
                const basicCondition = basicConditions.find(bc => bc.Name === effectName);
                appendBasicCondition(effectItem, basicCondition);
            }

            effectsList.appendChild(effectItem);
            preventDuplicateBasicCondition(effectName);

            // Save to local storage
            saveCreaturesToLocalStorage();
        }

        function appendCombinedCondition(effectItem, combinedCondition) {
            if (combinedCondition) {
                const description = `<b>${combinedCondition.Name}: </b>${combinedCondition.DescriptionSummary}`;
                effectItem.innerHTML = description;

                const subList = document.createElement("ul");
                combinedCondition.basicConditions.forEach(basicConditionName => {
                    const basicCondition = basicConditions.find(bc => bc.Name === basicConditionName);
                    if (basicCondition) {
                        const subListItem = document.createElement("li");
                        subListItem.innerHTML = `<b>${basicCondition.Name}: </b>${basicCondition.DescriptionSummary}`;
                        subList.appendChild(subListItem);
                    }
                });
                effectItem.appendChild(subList);
            }
        }

        function disableBasicConditionButtons(combinedCondition) {
            combinedCondition.basicConditions.forEach(basicConditionName => {
                const basicConditionBtn = document.querySelector(`button[data-condition="${basicConditionName}"]`);
                if (basicConditionBtn) {
                    basicConditionBtn.classList.add("grey");
                    basicConditionBtn.disabled = true;
                }
            });
        }

        function appendBasicCondition(effectItem, basicCondition) {
            if (basicCondition) {
                effectItem.innerHTML = `<b>${basicCondition.Name}: </b>${basicCondition.DescriptionSummary}`;
            }
        }

        function preventDuplicateBasicCondition(effectName) {
            const basicConditionBtn = document.querySelector(`button[data-condition="${effectName}"]`);
            if (basicConditionBtn && basicConditionBtn.classList.contains("grey")) {
                alert("This basic condition is currently part of an active combined condition and cannot be added individually.");
                return;
            }
        }

        function removeEffectFromCreature(creatureId, effectName, isCombinedCondition = false) {
            const effectsList = document.getElementById(`effects-${creatureId}`);
            const effectItemToRemove = Array.from(effectsList.getElementsByTagName("li")).find(item =>
                item.innerHTML.includes(`<b>${effectName}: </b>`));

            if (effectItemToRemove) {
                if (isCombinedCondition) {
                    reEnableBasicConditionButtons(effectItemToRemove, effectsList);
                }
                effectsList.removeChild(effectItemToRemove);

                // Save to local storage
                saveCreaturesToLocalStorage();
            }
        }

        function reEnableBasicConditionButtons(effectItemToRemove, effectsList) {
            const basicConditions = JSON.parse(effectItemToRemove.dataset.basicConditions);
            basicConditions.forEach(basicConditionName => {
                if (!isBasicConditionPartOfOtherCombined(effectItemToRemove, effectsList, basicConditionName)) {
                    const basicConditionBtn = document.querySelector(`button[data-condition="${basicConditionName}"]`);
                    if (basicConditionBtn) {
                        basicConditionBtn.classList.remove("grey");
                        basicConditionBtn.disabled = false;
                    }
                }
            });
        }

        function isBasicConditionPartOfOtherCombined(effectItemToRemove, effectsList, basicConditionName) {
            return Array.from(effectsList.children).some(child =>
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
                creatures.forEach(creature => {
                    const creatureDiv = createCreatureDiv(creature.id);

                    // Set the saved name and injuries
                    const nameInput = creatureDiv.querySelector(".creature-name-input");
                    nameInput.value = creature.name;

                    const injuryInput = creatureDiv.querySelector(".creature-injury-input");
                    injuryInput.value = creature.injuries;

                    // Append the creature to the list first
                    creaturesList.appendChild(creatureDiv);

                    // Simulate button clicks to activate conditions
                    creature.activeConditions.forEach(conditionName => {
                        const button = creatureDiv.querySelector(`button[data-condition="${conditionName}"]`);
                        if (button) {
                            button.click();
                        }
                    });
                });
            }
        }

        // function appendConditionsButtons(container, titleText, conditions, creatureId, isCombined) {
        //     const title = document.createElement("h4");
        //     title.innerText = titleText;
        //     container.appendChild(title);

        //     conditions.sort((a, b) => a.Name.localeCompare(b.Name)).forEach(condition => {
        //         const conditionBtn = document.createElement("button");
        //         conditionBtn.innerText = condition.Name;
        //         conditionBtn.setAttribute("data-condition", condition.Name);
        //         conditionBtn.addEventListener("click", function () {
        //             if (conditionBtn.classList.contains("red")) {
        //                 conditionBtn.classList.remove("red");
        //                 removeEffectFromCreature(creatureId, condition.Name, isCombined);
        //             } else {
        //                 conditionBtn.classList.add("red");
        //                 addEffectToCreature(creatureId, condition.Name, isCombined);
        //             }

        //             // Save to local storage
        //             saveCreaturesToLocalStorage();
        //         });
        //         container.appendChild(conditionBtn);
        //     });
        // }
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

        //#region /*----------Data Tables----------*/
        const measurementsTable11 = [
            { Rank: -5, Mass: '1.5 lb.', Time: '1/8 second', Distance: '6 inches', Volume: '1/32 cft.', MassInLbs: 1.5, metricMass: '750 grams', metricDistance: '15 cm', metricVolume: '.0008 m³' },
            { Rank: -4, Mass: '3 lbs.', Time: '1/4 second', Distance: '1 foot', Volume: '1/16 cft.', MassInLbs: 3, metricMass: '1.5 kg', metricDistance: '50 cm', metricVolume: '.0017 m³' },
            { Rank: -3, Mass: '6 lbs.', Time: '1/2 second', Distance: '3 feet', Volume: '1/8 cft.', MassInLbs: 6, metricMass: '3 kg', metricDistance: '1 m', metricVolume: '.0035 m³' },
            { Rank: -2, Mass: '12 lbs.', Time: '1 second', Distance: '6 feet', Volume: '1/4 cft.', MassInLbs: 12, metricMass: '6 kg', metricDistance: '2 m', metricVolume: '.007 m³' },
            { Rank: -1, Mass: '25 lbs.', Time: '3 seconds', Distance: '15 feet', Volume: '1/2 cft.', MassInLbs: 25, metricMass: '12 kg', metricDistance: '4 m', metricVolume: '.014 m³' },
            { Rank: 0, Mass: '50 lbs.', Time: '6 seconds', Distance: '30 feet', Volume: '1 cubic ft. (cft.)', MassInLbs: 50, metricMass: '24 kg', metricDistance: '8 m', metricVolume: '.025 m³' },
            { Rank: 1, Mass: '100 lbs.', Time: '12 seconds', Distance: '60 feet', Volume: '2 cft.', MassInLbs: 100, metricMass: '50 kg', metricDistance: '16 m', metricVolume: '.05 m³' },
            { Rank: 2, Mass: '200 lbs.', Time: '30 seconds', Distance: '120 feet', Volume: '4 cft.', MassInLbs: 200, metricMass: '100 kg', metricDistance: '32 m', metricVolume: '.1 m³' },
            { Rank: 3, Mass: '400 lbs.', Time: '1 minute', Distance: '250 feet', Volume: '8 cft.', MassInLbs: 400, metricMass: '200 kg', metricDistance: '64 m', metricVolume: '.2 m³' },
            { Rank: 4, Mass: '800 lbs.', Time: '2 minutes', Distance: '500 feet', Volume: '15 cft.', MassInLbs: 800, metricMass: '400 kg', metricDistance: '125 m', metricVolume: '.4 m³' },
            { Rank: 5, Mass: '1,600 lbs.', Time: '4 minutes', Distance: '900 feet', Volume: '30 cft.', MassInLbs: 1600, metricMass: '800 kg', metricDistance: '250 m', metricVolume: '.8 m³' },
            { Rank: 6, Mass: '3,200 lbs.', Time: '8 minutes', Distance: '1,800 feet', Volume: '60 cft.', MassInLbs: 3200, metricMass: '1600 kg', metricDistance: '500 m', metricVolume: '1.7 m³' },
            { Rank: 7, Mass: '3 tons', Time: '15 minutes', Distance: '1/2 mile', Volume: '125 cft.', MassInLbs: 6000, metricMass: '3.2 tons', metricDistance: '1 km', metricVolume: '3.5 m³' },
            { Rank: 8, Mass: '6 tons', Time: '30 minutes', Distance: '1 mile', Volume: '250 cft.', MassInLbs: 12000, metricMass: '6 tons', metricDistance: '2 km', metricVolume: '7 m³' },
            { Rank: 9, Mass: '12 tons', Time: '1 hour', Distance: '2 miles', Volume: '500 cft.', MassInLbs: 24000, metricMass: '12 tons', metricDistance: '4 km', metricVolume: '15 m³' },
            { Rank: 10, Mass: '25 tons', Time: '2 hours', Distance: '4 miles', Volume: '1,000 cft.', MassInLbs: 50000, metricMass: '25 tons', metricDistance: '8 km', metricVolume: '30 m³' },
            { Rank: 11, Mass: '50 tons', Time: '4 hours', Distance: '8 miles', Volume: '2,000 cft.', MassInLbs: 100000, metricMass: '50 tons', metricDistance: '16 km', metricVolume: '60 m³' },
            { Rank: 12, Mass: '100 tons', Time: '8 hours', Distance: '16 miles', Volume: '4,000 cft.', MassInLbs: 200000, metricMass: '100 tons', metricDistance: '32 km', metricVolume: '120 m³' },
            { Rank: 13, Mass: '200 tons', Time: '16 hours', Distance: '30 miles', Volume: '8,000 cft.', MassInLbs: 400000, metricMass: '200 tons', metricDistance: '64 km', metricVolume: '250 m³' },
            { Rank: 14, Mass: '400 tons', Time: '1 day', Distance: '60 miles', Volume: '15,000 cft.', MassInLbs: 800000, metricMass: '400 tons', metricDistance: '125 km', metricVolume: '500 m³' },
            { Rank: 15, Mass: '800 tons', Time: '2 days', Distance: '120 miles', Volume: '32,000 cft.', MassInLbs: 1600000, metricMass: '800 tons', metricDistance: '250 km', metricVolume: '1,000 m³' },
            { Rank: 16, Mass: '1,600 tons', Time: '4 days', Distance: '250 miles', Volume: '65,000 cft.', MassInLbs: 3200000, metricMass: '1,600 tons', metricDistance: '500 km', metricVolume: '2,000 m³' },
            { Rank: 17, Mass: '3.2 ktons', Time: '1 week', Distance: '500 miles', Volume: '125,000 cft.', MassInLbs: 6400000, metricMass: '3.2 ktons', metricDistance: '1,000 km', metricVolume: '4,000 m³' },
            { Rank: 18, Mass: '6 ktons', Time: '2 weeks', Distance: '1,000 miles', Volume: '250,000 cft.', MassInLbs: 12000000, metricMass: '6 ktons', metricDistance: '2,000 km', metricVolume: '8,000 m³' },
            { Rank: 19, Mass: '12 ktons', Time: '1 month', Distance: '2,000 miles', Volume: '500,000 cft.', MassInLbs: 24000000, metricMass: '12 ktons', metricDistance: '4,000 km', metricVolume: '15,000 m³' },
            { Rank: 20, Mass: '25 ktons', Time: '2 months', Distance: '4,000 miles', Volume: '1 million cft.', MassInLbs: 50000000, metricMass: '25 ktons', metricDistance: '8,000 km', metricVolume: '30,000 m³' },
            { Rank: 21, Mass: '50 ktons', Time: '4 months', Distance: '8,000 miles', Volume: '2 million cft.', MassInLbs: 100000000, metricMass: '50 ktons', metricDistance: '16,000 km', metricVolume: '60,000 m³' },
            { Rank: 22, Mass: '100 ktons', Time: '8 months', Distance: '16,000 miles', Volume: '4 million cft.', MassInLbs: 200000000, metricMass: '100 ktons', metricDistance: '32,000 km', metricVolume: '120,000 m³' },
            { Rank: 23, Mass: '200 ktons', Time: '1.5 years', Distance: '32,000 miles', Volume: '8 million cft.', MassInLbs: 400000000, metricMass: '200 ktons', metricDistance: '64,000 km', metricVolume: '250,000 m³' },
            { Rank: 24, Mass: '400 ktons', Time: '3 years', Distance: '64,000 miles', Volume: '15 million cft.', MassInLbs: 800000000, metricMass: '400 ktons', metricDistance: '125,000 km', metricVolume: '500,000 m³' },
            { Rank: 25, Mass: '800 ktons', Time: '6 years', Distance: '125,000 miles', Volume: '32 million cft.', MassInLbs: 1600000000, metricMass: '800 ktons', metricDistance: '250,000 km', metricVolume: '1 million m³' },
            { Rank: 26, Mass: '1,600 ktons', Time: '12 years', Distance: '250,000 miles', Volume: '65 million cft.', MassInLbs: 3200000000, metricMass: '1,600 ktons', metricDistance: '500,000 km', metricVolume: '2 million m³' },
            { Rank: 27, Mass: '3,200 ktons', Time: '25 years', Distance: '500,000 miles', Volume: '125 million cft.', MassInLbs: 6400000000, metricMass: '3,200 ktons', metricDistance: '1 million km', metricVolume: '4 million m³' },
            { Rank: 28, Mass: '6,400 ktons', Time: '50 years', Distance: '1 million miles', Volume: '250 million cft.', MassInLbs: 12800000000, metricMass: '6,400 ktons', metricDistance: '2 million km', metricVolume: '8 million m³' },
            { Rank: 29, Mass: '12,500 ktons', Time: '100 years', Distance: '2 million miles', Volume: '500 million cft.', MassInLbs: 25000000000, metricMass: '12,500 ktons', metricDistance: '4 million km', metricVolume: '15 million m³' },
            { Rank: 30, Mass: '25,000 ktons', Time: '200 years', Distance: '4 million miles', Volume: '1 billion cft.', MassInLbs: 50000000000, metricMass: '25,000 ktons', metricDistance: '8 million km', metricVolume: '30 million m³' },
            { Rank: '+1', Mass: 'x2', Time: 'x2', Distance: 'x2', Volume: 'x2', MassInLbs: 'x2' }
        ];

        const conversionFactors = {
            mass: 0.453592, // lbs to kg
            distance: 0.3048, // feet to meters
            volume: 0.0283168 // cubic feet to cubic meters
        };

        const advantages = [
            {
                Name: 'Accurate Attack',
                Description: 'When you make an {tooltip0} (see Maneuvers, page 249) you can take a penalty of up to –5 on the effect modifier of the attack and add the same number (up to +5) to your attack bonus.',
                Tooltips: [
                    {
                        TooltipTag: 'accurate attack',
                        TooltipDescription: ' When you make an attack, you can take a penalty of up to –2 on the effect modifier of the attack and add the same number(up to + 2) to your attack bonus. Your effect modifier cannot be reduced below + 0 and your attack bonus cannot more than double in this way. The changes are declared before you make the attack check and last until the start of your next turn.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Agile Feint',
                Description: 'You can use your Acrobatics bonus or movement speed rank in place of Deception to {tooltip0} and {tooltip1} in combat as if your skill bonus or speed rank were your Deception bonus (see the Deception skill description). Your opponent opposes the attempt with Acrobatics or Insight (whichever is better).',
                Tooltips: [
                    {
                        TooltipTag: 'feint',
                        TooltipDescription: 'You can use Deception as a standard action to mislead an opponent in combat. Make a Deception check as a standard action opposed by the better of your target’s Deception or Insight. If your Deception check succeeds, the target is vulnerable against your next attack, until the end of your next round(see Vulnerable in the Conditions section of The Basics chapter).'
                    },
                    {
                        TooltipTag: 'trick',
                        TooltipDescription: 'You can use Deception to mislead an opponent into taking a potentially unwise action, such as trying to hit you while standing in front of an electrical junction box or at the edge of a precipice. If your Deception check opposed by Deception or Insight succeeds, your opponent is heedless of the potential danger and may hit the junction box or lose his balance and fall, if his attack against you fails. (On the other hand, if the attack succeeds, it might slam you into the junction box or send you flying off the edge. You’re taking a risk.)<br/><br/>More than one degree of failure on the Deception check means you put yourself in a bad position; you are vulnerable against the target’s attacks until the start of your next round!'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'All-Out Attack',
                Description: 'When you make an {tooltip0} (see Maneuvers, page 249) you can take a penalty of up to –5 on your active defenses(Dodge and Parry) and add the same number(up to + 5) to your attack bonus.',
                Tooltips: [
                    {
                        TooltipTag: 'all-out attack',
                        TooltipDescription: 'When you make an attack you can take a penalty of up to –2 on your active defenses(Dodge and Parry) and add the same number(up to + 2) to your attack bonus. Your defense bonuses cannot be reduced below + 0 and your attack bonus cannot more than doublehe changes to attack and defense bonus are declared before you make the attack check and last until the start of your next turn.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Animal Empathy',
                Description: ' You have a special connection with animals. You can use interaction skills on animals normally, and do not have to speak a language the animal understands; you communicate your intent through gestures and body language and learn things by studying animal behavior. Characters normally have a –10 circumstance penalty to use interaction skills on animals, due to their Intellect and lack of language.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Artificer',
                Description: ' You can use the Expertise: Magic skill to create temporary magical devices. See {tooltip0}, page 212, for details.',
                Tooltips: [
                    {
                        TooltipTag: 'Magical Inventions',
                        TooltipDescription: ' For magical, rather than technological, inventions, use the normal inventing rules, but substitute the Expertise: Magic skill for the Technology skill on the design and construction checks.',
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Assessment',
                Description: 'You’re able to quickly size up an opponent’s combat capabilities. Choose a target you can accurately perceive and have the GM make a secret Insight check for you as a free action, opposed by the target’s Deception check result.<br/><br/>If you win, the GM tells you the target’s attack and defense bonuses relative to yours(lower, higher, or equal). With each additional degree of success, you learn one of the target’s bonuses exactly.<br/><br/>If you lose the opposed roll, you don’t find out anything. With more than one degree of failure, the GM may lie or otherwise exaggerate the target’s bonuses.',
                Tooltips: [{}],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Attractive',
                Description: 'You’re particularly attractive, giving you a +2 circumstance bonus on Deception and Persuasion checks to deceive, seduce, or change the attitude of anyone who finds your looks appealing. With a second rank, you are Very Attractive, giving you a + 5 circumstance bonushis bonus does not count as part of your regular skill bonus in terms of the series power level, but also does not apply to people or situations which(in the GM’s opinion) would not be in fluenced by your appearance.<br/><br/>While superheroes tend to be a fairly good - looking lot, this advantage is generally reserved for characters with particularly impressive looks.',
                Tooltips: [{}],
                AdvantageType: 'Skill, Ranked(2)',
                Selected: false
            },
            {
                Name: 'Beginner\'s Luck',
                Description: 'By spending a hero point, you gain an effective 5 ranks in one skill of your choice you currently have at 4 or fewer ranks, including skills you have no ranks in, even if they can’t be used untrained. These temporary skill ranks last for the duration of the scene and grant you their normal benefits.',
                Tooltips: [{}],
                AdvantageType: 'Fortune',
                Selected: false
            },
            {
                Name: 'Benefit',
                Description: 'You have some significant perquisite or fringe benefit. The exact nature of the benefit is for you and the Gamemaster to determine. As a rule of thumb it should not exceed the benefits of any other advantage, or a power effect costing 1 point(see {tooltip0} in the <b>Powers</b> chapter). It should also be significant enough to cost at least 1 power point. An example is Diplomatic Immunity(see Sample Benefits). A license to practice law or medicine, on the other hand, should not be considered a Benefit; it’s simply a part of having training in the appropriate Expertise skill and has no significant game effect.<br/><br/>Benefits may come in ranks for improved levels of the same benefit. The GM is the final arbiter as to what does and does not constitute a Benefit in the setting. Keep in mind some qualities may constitute Benefits in some series, but not in others, depending on whether or not they have any real impact on the game.<br/><br/>{tooltip1}',
                Tooltips: [
                    {
                        TooltipTag: '<b>Feature</b>',
                        TooltipDescription: ' You have one or more minor features, effects granting you an occasionally useful ability, one per rank. This effect is essentially a version of the Benefit advantage(see page 134) but a power rather than a virtue of skill, talent, or social background. For example, diplomatic immunity or wealth are Benefits; fur, the ability to mimic sounds, or a hidden compartment in your hollow leg are Features.<br/><br/> It’s up to the GM what capabilities qualify as Features; generally, if something has no real game effect, it’s just a descriptor. If it has an actual game system benefit, it may be a Feature. There’s no need to define every possible Feature a character may have down to the last detail.<br/><br/>Some Features may be sustained duration rather than permanent with no change in cost. This suits active Fea tures a character has to use and maintain rather than having them as passive traits requiring no effort whatsoever.',
                    },
                    {
                        TooltipTag: '<b>Sample Benefits</b>',
                        TooltipDescription: 'The following are some potential Benefits. The GM is free to choose any suitable Benefit for the series.<br/><br/><ul><li><b>Alternate Identity:</b> You have an alternate identity, complete with legal paperwork (driver’s license, birth certificate, etc.). This is different from a costumed identity, which doesn’t necessarily have any special legal status (but may in some settings).</li><li><b>Ambidexterity:</b> You are equally adept using either hand, suffering no circumstance penalty for using your off-hand (as you don’t have one).</li><li><b>Cipher:</b> Your true history is well hidden, making it difficult to dig up information about you. Investigation checks concerning you are made at a –5 circumstance penalty per rank in this benefit.</li><li><b>Diplomatic Immunity:</b> By dint of your diplomatic status, you cannot be prosecuted for crimes in nations other than your own. All another nation can do is deport you to your home nation.</li><li><b>Security Clearance:</b> You have access to classified government information, installations, and possibly equipment and personnel.</li><li><b>Status:</b> By virtue of birth or achievement, you have special status. Examples include nobility, knighthood, aristocracy, and so forth.</li><li><b>Wealth:</b> You have greater than average wealth or material resources, such as well-off (rank 1), independently wealthy (rank 2), a millionaire (rank 3), multimillionaire (rank 4), or billionaire (rank 5).</li></ul>',
                    }
                ],
                AdvantageType: 'General, Ranked',
                Selected: false
            },
            {
                Name: 'Chokehold',
                Description: ' If you successfully grab and restrain an opponent (see {tooltip0}, page 248), you can apply a chokehold, causing your opponent to begin suffocating for as long as you continue to restrain your target(see {tooltip1}, page 238).',
                Tooltips: [
                    {
                        TooltipTag: 'Grab',
                        TooltipDescription: 'You attempt to grab a target. Make an attack check against the target. If successful, the target makes a resistance check against your Strength(or the rank of a grabbing effect) using the better of Strength or Dodge. If you win with one degree of success, the target is restrained (immobile and vulnerable)wo or more degrees leave your opponent bound(defenseless, immobile, and impaired). You can attempt to improve an existing hold with another grab action on a following turn. Any resulting degrees of success are cumulative, but if you lose, the target escapes.<br<br/>You are hindered and vulnerable while grabbing and holding an opponent. You can maintain a successful grab as a free action each turn, but cannot perform other actions requiring the use of your grabbing limb(s) while doing so. Since maintaining a grab is a free action, you can take a standard action to inflict your Strength damage to a grabbed target on subsequent turns after the grab is established.<br/><br/>You can drag a restrained or bound target along with you when you movehe target gets a Strength resistance check against your Strength. If it fails, you move and the target moves along with youf the target resists, you are immobilized that turn unless you release your hold on the target.<br/><br/>You can end a grab(releasing your target) as a free action. If you are unable to take the free action maintain the hold, the target is automatically released. A target can attempt to escape from a grab as a move action(see Escape below).<br/><br/><b>Escape:</b>  You attempt to escape from a successful grab (see Grab). Make a check of your Athletics or Acrobatics against the routine check result of your opponent’s Strength or grab effect rankf you succeed, you end the grab and can move away from your opponent, up to your normal ground speed minus one rank, if you choose. If you fail, you are still grabbed.',
                    },
                    {
                        TooltipTag: 'Suffocation',
                        TooltipDescription: 'Characters can hold their breath for ten rounds (one minute) plus a number of rounds equal to twice their Stamina. After that time they must make a Fortitude check(DC 10) each round to continue holding their breath. The DC increases by + 1 for each previous success. Failure on the Fortitude check means the character becomes incapacitated. On the following round the character is dying. A dying character cannot stabilize until able to breathe again. Heroes with Immunity to Suffocation can go an unlimited time without air.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Close Attack',
                Description: 'You have a +1 bonus to close attacks checks per rank in this advantage. Your total attack bonus is still limited by power level. This advantage best suits characters with a level of overall close combat skill(armed and unarmed). For capability with a particular type of attack, use the Close Combat skill.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Connected',
                Description: 'You know people who can help you out from time to time. It might be advice, information, help with a legal matter, or access to resources. You can call in such favors by making a Persuasion check. The GM sets the DC of the check, based on the aid required. A simple favor is DC 10, ranging up to DC 25 or higher for especially difficult, dangerous, or expensive favors. You can spend a hero point to automatically secure the favor, if the GM allows it. The GM has the right to veto any request if it is too involved or likely to spoil the plot of the adventure. Use of this advantage always requires at least a few minutes(and often much longer) and the means to contact your allies to ask for their help.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Contacts',
                Description: ' You have such extensive and well-informed contacts you can make an Investigation check to gather information in only one minute, assuming you have some means of getting in touch with your contacts. Further Investigation checks to gather information on the same subject require the normal length of time, since you must go beyond your immediate network of contacts.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Daze',
                Description: 'You can make a Deception or Intimidation check as a standard action(choose which skill when you acquire the advantage) to cause an opponent to hesitate in combat. Make a skill check as a standard action against your target’s resistance check(the same skill, Insight, or Will defense, whichever has the highest bonus). If you win, your target is dazed(able to take only a standard action) until the end of your next round. The ability to Daze with Deception and with Intimidation are separate advantages. Take this advantage twice in order to be able to do both.',
                Tooltips: [{}],
                AdvantageType: 'Skill, Ranked (2)',
                Selected: false
            },
            {
                Name: 'Defensive Attack',
                Description: 'When you make a {tooltip0} (see <b>Maneuvers</b>, page 249), you can take a penalty of up to –5 on your attack bonus and add the same number (up to +5) to both your active defenses (Dodge and Parry).',
                Tooltips: [
                    {
                        TooltipTag: 'defensive attack',
                        TooltipDescription: 'When you make an attack you can take a penalty of up to –2 on your attack bonus and add the same number (up to + 2) to your active defenses(Dodge and Parry). Your attack bonus cannot be reduced below + 0 and your defense bonuses cannot more than double. The changes to attack and defense bonus last until the start of your next turn. This maneuver does not apply to effects requiring no attack check or allowing no resistance check.',
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Defensive Roll',
                Description: 'You can avoid damage through agility and “rolling” with an attack. You receive a bonus to your Toughness equal to your advantage rank, but it is considered an active defense similar to {tooltip0} and {tooltip1} (see Active Defenses in the Abilities chapter), so you lose this bonus whenever you are vulnerable or defenseless. Your total Toughness, including this advantage, is still limited by power level.<br/><br/>This advantage is common for heroes who lack either superhuman speed or toughness, relying on their agility and training to avoid harm.',
                Tooltips: [
                    {
                        TooltipTag: 'Dodge',
                        TooltipDescription: 'Dodge defense is based on Agility rank. It includes reaction time, quickness, nimbleness, and overall coordination, used to avoid ranged attacks or other hazards where reflexes and speed are important.'
                    },
                    {
                        TooltipTag: 'Parry',
                        TooltipDescription: 'Parry defense is based on Fighting. It is the ability to counter, duck, or otherwise evade a foe’s attempts to strike you in close combat through superior fighting ability.'
                    }
                ],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Diehard',
                Description: ' When your condition becomes dying (see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter) you automatically stabilize on the following round without any need for a Fortitude check, although further damage—such as a finishing attack—can still kill you.',
                Tooltips: [
                    {
                        TooltipTag: 'Conditions',
                        TooltipDescription: 'A dying character is incapacitated (defenseless, stunned, and unaware) and near death. When the character gains this condition, immediately make a Fortitude check(DC 15). If the check succeeds, nothing happens. With two degrees of success, the character stabilizes, removing this condition. If the check fails, the character remains dying. Three or more total degrees of failure mean the character dies: so three failed Fortitude checks or one or two checks adding up to three degrees. Dying characters make a Fortitude check each round until they either die or stabilize. Another character can stabilize a dying character with a successful Treatment check (DC 15) or use of a Healing effect (see the Powers chapter).'
                    }
                ],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Eidetic Memory',
                Description: 'You have perfect recall of everything you’ve experienced. You have a + 5 circumstance bonus on checks to remember things, including resistance checks against effects that alter or erase memories. You can also make Expertise skill checks to answer questions and provide information as if you were trained, meaning you can answer questions involving difficult or obscure knowledge even without ranks in the skill, due to the sheer amount of trivia you have picked up.',
                Tooltips: [{}],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Equipment',
                Description: 'You have 5 points per rank in this advantage to spend on equipment. This includes vehicles and headquarters. See the <b>Gadgets & Gear</b> chapter for details on equipment and its costs. Many heroes rely almost solely on Equipment in conjunction with their skills and other advantages.',
                Tooltips: [{}],
                AdvantageType: 'General, Ranked',
                Selected: false
            },
            {
                Name: 'Evasion',
                Description: 'You have a +2 circumstance bonus to Dodge resistance checks to avoid area effects(see the <b>{tooltip0}</b> extra in the Powers chapter). If you have 2 ranks in this advantage, your circumstance bonus increases to + 5.',
                Tooltips: [
                    {
                        TooltipTag: 'Area',
                        TooltipDescription: 'This extra allows an effect that normally works on a single target to affect an area. No attack check is needed; the effect simply fills the designated area, based on the type of modifier. Potential targets in the area are permitted a Dodge resistance check(DC 10 + effect rank) to avoid some of the effect(reflecting ducking for cover, dodging out of the way, and so forth). A successful resistance check reduces the Area effect to half its normal rank against that target(round down, minimum of 1 rank).'
                    }
                ],
                AdvantageType: 'Combat, Ranked (2)',
                Selected: false
            },
            {
                Name: 'Extraordinary Effort',
                Description: 'When using extra effort (see <b>{tooltip0}</b> in <b>The Basics</b> chapter), you can gain two of the listed benefits, even stacking two of the same type of benefit. However, you also double the cost of the effort; you’re exhausted starting the turn after your extraordinary effort. If you are already fatigued, you are incapacitated. If you are already exhausted, you cannot use extraordinary effort. Spending a hero point at the start of your next turn reduces the cost of your extraordinary effort to merely fatigued, the same as a regular extra effort.',
                Tooltips: [
                    {
                        TooltipTag: 'Extra Effort',
                        TooltipDescription: 'Players can have their heroes use extra effort simply by declaring they are doing so. Extra effort is a free action and can be performed at any time during the hero’s turn (but is limited to once per turn). A hero using extra effort gains one of the following benefits:<ul><li><b>Action:</b> Gain an additional standard action during your turn, which can be exchanged for a move or free action, as usual.</li><li><b>Bonus:</b> Perform one check with a bonus (+2 circumstance bonus) or improve an existing bonus to a major bonus(+ 5 circumstance bonus). This bonus can also negate a penalty (–2 circumstance penalty), allowing you to perform the check with no modifier, or reduce a major penalty from a –5 penalty to a –2 penalty.</li><li><b>Power:</b> Increase one of your hero’s power effects by +1 rank until the start of the hero’s next turn. Permanent effects cannot be increased in this way.</li><li><b>Power Stunt:</b> Temporarily gain and use an Alternate Effect (see Alternate Effect in the Powers chapter). The Alternate Effect lasts until the end of the scene or until its duration expires, whichever comes first. Permanent effects cannot be used for power stunts.</li><li><b>Resistance:</b>  Gain an immediate additional resistance check against an ongoing effect. If you’re compelled or controlled, the fatigue from the extra effort doesn’t affect you until you’re free of the effect; this is so you can’t resist yourself to exhaustion as a way of avoiding being controlled!</li><li><b>Retry:</b>Certain effects (see the Powers chapter) require extra effort to retry after a certain degree of failure. The extra effort merely permits another attempt to use the effect; it grants no other benefits.</li><li><b>Speed:</b>  Increase the hero’s speed rank by +1 until the start of the hero’s next turn.</li><li><b>Strength:</b>  Increase the hero’s Strength rank by +1 until the start of the hero’s next turn.</li></ul><h4>Cost of Extra Effort</h4>At the start of the turn immediately after using extra effort, the hero becomes fatigued. A fatigued hero who uses extra effort becomes exhausted and an exhausted hero who uses extra effort is incapacitated. If you spend a hero point at the start of the turn following the extra effort to remove the fatigue, the hero suffers no adverse effects. In essence, spending a hero point lets you use extra effort without suffering fatigue.'
                    }
                ],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Fascinate',
                Description: 'One of your interaction skills is so effective you can capture and hold other’s attention with it. Choose Deception, Intimidation, or Persuasion when you acquire this advantage. You can also use Fascinate with an appropriate Expertise skill, like musician or singer, at the GM’s discretion.<br/><br/>You are subject to the normal guidelines for interaction skills, and combat or other immediate danger makes this advantage ineffective. Take a standard action and make an interaction skill check against your target’s opposing check(Insight or Will defense). If you succeed, the target is entranced. You can maintain the effect with a standard action each round, giving the target a new resistance check. The effect ends when you stop performing, the target successfully resists, or any immediate danger presents itself. Like all interaction skills, you can use Fascinate on a group, but you must affect everyone in the group in the same way.<br/><br/> You may take this advantage more than once. Each time, it applies to a different skill.',
                Tooltips: [{}],
                AdvantageType: 'Skill, Ranked',
                Selected: false
            },
            {
                Name: 'Fast Grab',
                Description: 'When you hit with an unarmed attack you can immediately make a grab check against that opponent as a free action (see <b>{tooltip0}</b>, page 248). Your unarmed attack inflicts its normal damage and counts as the initial attack check required to grab your opponent.',
                Tooltips: [
                    {
                        TooltipTag: 'Grab',
                        TooltipDescription: 'You attempt to grab a target. Make an attack check against the target. If successful, the target makes a resistance check against your Strength(or the rank of a grabbing effect) using the better of Strength or Dodge. If you win with one degree of success, the target is restrained (immobile and vulnerable)wo or more degrees leave your opponent bound(defenseless, immobile, and impaired). You can attempt to improve an existing hold with another grab action on a following turn. Any resulting degrees of success are cumulative, but if you lose, the target escapes.<br<br/>You are hindered and vulnerable while grabbing and holding an opponent. You can maintain a successful grab as a free action each turn, but cannot perform other actions requiring the use of your grabbing limb(s) while doing so. Since maintaining a grab is a free action, you can take a standard action to inflict your Strength damage to a grabbed target on subsequent turns after the grab is established.<br/><br/>You can drag a restrained or bound target along with you when you movehe target gets a Strength resistance check against your Strength. If it fails, you move and the target moves along with youf the target resists, you are immobilized that turn unless you release your hold on the target.<br/><br/>You can end a grab(releasing your target) as a free action. If you are unable to take the free action maintain the hold, the target is automatically released. A target can attempt to escape from a grab as a move action(see Escape below).<br/><br/><b>Escape:</b>  You attempt to escape from a successful grab (see Grab). Make a check of your Athletics or Acrobatics against the routine check result of your opponent’s Strength or grab effect rankf you succeed, you end the grab and can move away from your opponent, up to your normal ground speed minus one rank, if you choose. If you fail, you are still grabbed.',
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Favored Environment',
                Description: 'You have an environment you’re especially suited for fighting in. Examples include in the air, underwater, in space, in extreme heat or cold, in jungles or woodlands, and so forth. While you are in your favored environment, you gain a + 2 circumstance bonus to attack checks or your active defenses. Choose at the start of the round whether the bonus applies to attack or defense. The choice remains until the start of your next round. This circumstance bonus is not affected by power level.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Favored Foe',
                Description: 'You have a particular type of opponent you’ve studied or are especially effective against. It may be a type of creature (aliens, animals, constructs, mutants, undead, etc.), a profession(soldiers, police officers, Yakuza, etc.) or any other category the GM approves. Especially broad categories like “humans” or “villains” are not permitted. You gain a + 2 circumstance bonus on Deception, Intimidation, Insight, and Perception checks dealing with your Favored Foe. This circumstance bonus is not limited by power level.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Fearless',
                Description: 'You are immune to fear effects of all sorts, essentially the same as an Immunity to Fear effect(see <b>{tooltip0}</b> in the Powers chapter).',
                Tooltips: [
                    {
                        TooltipTag: 'Immunity',
                        TooltipDescription: 'You are immune to certain effects, automatically succeeding on any resistance check against them. You assign ranks of Immunity to various effects to gain immunity to them (with more extensive effects requiring more ranks).'
                    }
                ],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Grabbing Finesse',
                Description: ' You can use your Dexterity bonus, rather than your Strength bonus, to make grab attacks. You are not vulnerable while grabbing. See <b>{tooltip0}</b>, page 248, for details. This is a good advantage for skilled unarmed combatants focused more on speed than strength.',
                Tooltips: [
                    {
                        TooltipTag: 'Grab',
                        TooltipDescription: 'You attempt to grab a target. Make an attack check against the target. If successful, the target makes a resistance check against your Strength(or the rank of a grabbing effect) using the better of Strength or Dodge. If you win with one degree of success, the target is restrained (immobile and vulnerable)wo or more degrees leave your opponent bound(defenseless, immobile, and impaired). You can attempt to improve an existing hold with another grab action on a following turn. Any resulting degrees of success are cumulative, but if you lose, the target escapes.<br<br/>You are hindered and vulnerable while grabbing and holding an opponent. You can maintain a successful grab as a free action each turn, but cannot perform other actions requiring the use of your grabbing limb(s) while doing so. Since maintaining a grab is a free action, you can take a standard action to inflict your Strength damage to a grabbed target on subsequent turns after the grab is established.<br/><br/>You can drag a restrained or bound target along with you when you movehe target gets a Strength resistance check against your Strength. If it fails, you move and the target moves along with youf the target resists, you are immobilized that turn unless you release your hold on the target.<br/><br/>You can end a grab(releasing your target) as a free action. If you are unable to take the free action maintain the hold, the target is automatically released. A target can attempt to escape from a grab as a move action(see Escape below).<br/><br/><b>Escape:</b>  You attempt to escape from a successful grab (see Grab). Make a check of your Athletics or Acrobatics against the routine check result of your opponent’s Strength or grab effect rankf you succeed, you end the grab and can move away from your opponent, up to your normal ground speed minus one rank, if you choose. If you fail, you are still grabbed.',
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Great Endurance',
                Description: 'You have a +5 bonus on checks to avoid becoming fatigued and checks to hold your breath, avoid damage from starvation or thirst, avoid damage from hot or cold environments, and to resist suffocation and drowning. See <b>Hazards and the Environment</b> in the <b>Action & Adventure</b> chapter for details on these checks.',
                Tooltips: [{}],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Hide In Plain Sight',
                Description: 'You can hide (see <b>{tooltip0}</b> under <b>Stealth</b> in the <b>Skills</b> chapter) without any need for a Deception or Intimidation check or any sort of diversion, and without penalty to your Stealth check. You’re literally there one moment, and gone the next. You must still have some form of cover or concealment within range of your normal movement speed in order to hide.',
                Tooltips: [
                    {
                        TooltipTag: 'Hiding',
                        TooltipDescription: ' If you have cover or concealment, make a Stealth check, opposed by an observer’s Perception check, to hide and go unnoticed.<br/><br/>If others are aware of your presence, you can’t use Stealth to remain undetected. You can run around a corner so you are out of sight and then use Stealth, but others know which way you went. You can’t hide at all if you have absolutely no cover or concealment, since that means you are standing out in plain sight. Of course, if someone isn’t looking directly at you(you’re sneaking up from behind, for example), then you have concealment relative to that person.<br/<br/>A successful Deception or Intimidation check can give you the momentary distraction needed to make a Stealth check while people are aware of you. When others turn their attention from you, make a Stealth check if you can reach cover or concealment of some kind. (As a general guideline, any such cover has to be within 1 foot for every rank you have in Stealth.) This check, however, is at a –5 penalty because you have to move quickly.'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Improved Aim',
                Description: 'You have an even keener eye when it comes to ranged combat. When you take a standard action to aim, you gain double the normal circumstance bonus: +10 for a close attack or ranged attack adjacent to the target, + 5 for a ranged attack at a greater distance. See <b>{tooltip0}</b>, page 246, for details.',
                Tooltips: [
                    {
                        TooltipTag: 'Aim',
                        TooltipDescription: 'By taking a standard action to aim and line up an attack, you get a bonus to hit when you make the attack. If you’re making a close attack, or a ranged attack at close range, you get a + 5 circumstance bonus on your attack check. If you’re making a ranged attack from a greater distance, you get a + 2 circumstance bonus.<br/><br/>However, you are vulnerable while aiming and it requires a free action to maintain your aim before you make your attack. If you are unable to maintain it, you lose its benefit.<br/><br/>Once you aim, your next action must be to make the attack. Taking a different action spoils your aim and you lose the bonus.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Critical',
                Description: ' Increase your critical threat range with a particular attack (chosen when you acquire this advantage) by 1, allowing you to score a critical hit on a natural 19 or 20. Only a natural 20 is an automatic hit, however, and an attack that misses is not a critical. Each additional rank applies to a different attack or increases your threat range with an existing attack by one more, to a maximum threat range of 16-20 with 4 ranks.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Improved Defense',
                Description: 'When you take the defend action in combat (see <b>{tooltip0}</b> in the Action & Adventure chapter) you gain a + 2 circumstance bonus to your active defense checks for the round.',
                Tooltips: [
                    {
                        TooltipTag: 'Defend',
                        TooltipDescription: 'Rather than attacking, you focus on defense. Make an opposed check of your appropriate active defense versus any attack made on you until the start of your next turn. Add 10 to any roll of 10 or less that you make on these checks, just as if you spent a hero point (thus ensuring a minimum roll of 11). The attacker must equal or exceed your opposed check result in order to hit you.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Disarm',
                Description: 'You have no penalty to your attack check when attempting to disarm an opponent and they do not get the opportunity to disarm you(see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter).',
                Tooltips: [
                    {
                        TooltipTag: 'Disarm',
                        TooltipDescription: 'You attempt to knock an item—such as a weapon or device—out of an opponent’s grasp. Make an attack check against the defender with a –2 penalty. If you attempt to disarm with a ranged attack, you are at –5 penalty. If your attack succeeds, make an opposed check of your attack’s damage against the defender’s Strength. If you win, the defender dropped the held object. If you made the disarm unarmed, you can grab the dropped object as a free action. If you make a disarm attempt with a melee weapon and lose the opposed check, the defender may immediately make an attempt to disarm you as a reaction; make another opposed damage vs. Strength check. If this disarm attempt fails, you do not, however, get an additional attempt to disarm the defender.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Grab',
                Description: 'You can make grab attacks with only one arm, leaving the other free. You can also maintain the grab while using your other hand to perform actions. You are not vulnerable while grabbing(see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter).',
                Tooltips: [
                    {
                        TooltipTag: 'Grabbing',
                        TooltipDescription: 'You attempt to grab a target. Make an attack check against the target. If successful, the target makes a resistance check against your Strength(or the rank of a grabbing effect) using the better of Strength or Dodge. If you win with one degree of success, the target is restrained (immobile and vulnerable)wo or more degrees leave your opponent bound(defenseless, immobile, and impaired). You can attempt to improve an existing hold with another grab action on a following turn. Any resulting degrees of success are cumulative, but if you lose, the target escapes.<br<br/>You are hindered and vulnerable while grabbing and holding an opponent. You can maintain a successful grab as a free action each turn, but cannot perform other actions requiring the use of your grabbing limb(s) while doing so. Since maintaining a grab is a free action, you can take a standard action to inflict your Strength damage to a grabbed target on subsequent turns after the grab is established.<br/><br/>You can drag a restrained or bound target along with you when you movehe target gets a Strength resistance check against your Strength. If it fails, you move and the target moves along with youf the target resists, you are immobilized that turn unless you release your hold on the target.<br/><br/>You can end a grab(releasing your target) as a free action. If you are unable to take the free action maintain the hold, the target is automatically released. A target can attempt to escape from a grab as a move action(see Escape below).<br/><br/><b>Escape:</b>  You attempt to escape from a successful grab (see Grab). Make a check of your Athletics or Acrobatics against the routine check result of your opponent’s Strength or grab effect rankf you succeed, you end the grab and can move away from your opponent, up to your normal ground speed minus one rank, if you choose. If you fail, you are still grabbed.',
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Hold',
                Description: 'Your grab attacks are particularly difficult to escape. Opponents you grab suffer a –5 circumstance penalty on checks to escape.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Initiative',
                Description: 'You have a +4 bonus to your initiative checks per rank in this advantage.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Improved Smash',
                Description: ' You have no penalty to attack checks to hit an object held by another character(see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter).',
                Tooltips: [
                    {
                        TooltipTag: 'Smash',
                        TooltipDescription: 'You attempt to damage or break an object held or worn by an opponent. Make an attack check against the defense of the character with the object, with a –5 circumstance penalty if you are attacking a held object. If your attack check succeeds, you inflict damage on the object rather than the character. See <b>Damaging Objects</b> for details on breaking things.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improved Trip',
                Description: 'You have no penalty to your attack check to trip an opponent and they do not get the opportunity to trip you. When making a trip attack, make an opposed check of your Acrobatics or Athletics against your opponent’s Acrobatics or Athletics, you choose which your opponent uses to defend, rather than the target choosing(see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter). This is a good martial arts advantage for unarmed fighters.',
                Tooltips: [
                    {
                        TooltipTag: 'Trip',
                        TooltipDescription: 'You try to trip or throw your opponent to the ground. Make a close attack check against your opponent’s Parry with a –2 circumstance penalty on the check. If the attack succeeds, make an opposed check of your Acrobatics or Athletics against your opponent’s Acrobatics or Athletics. Use whichever has the better bonus in each case.<br/><br/>If you win, the defender is prone in an area adjacent to you of your choice. If you lose, the defender immediately gets another opposed check to try and trip you. If it fails, the trip attempt ends.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Improvised Tools',
                Description: 'You ignore the circumstance penalty for using skills without proper tools, since you can improvise sufficient tools with whatever is at hand. If you’re forced to work without tools at all, you suffer only a –2 penalty.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Improvised Weapon',
                Description: 'When wielding an improvised close combat weapon— anything from a chair to a telephone pole or entire car— you use your Close Combat: Unarmed skill bonus for attack checks with the “weapon” rather than relying on your general Close Combat skill bonus. Additional ranks in this advantage give you a + 1 bonus to Damage with improvised weapons per rank. Your maximum Damage bonus is still limited by power level, as usual.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Inspire',
                Description: 'You can inspire your allies to greatness. Once per scene, by taking a standard action and spending a hero point, allies able to interact with you gain a + 1 circumstance bonus per Inspire rank on all checks until the start of your next round, with a maximum bonus of + 5. You do not gain the bonus, only your allies do. The inspiration bonus ignores power  level limits, like other uses of hero points. Multiple uses of Inspire do not stack, only the highest bonus applies.',
                Tooltips: [{}],
                AdvantageType: 'Fortune, Ranked (5)',
                Selected: false
            },
            {
                Name: 'Instant Up',
                Description: 'You can go from prone to standing as a free action without the need for an Acrobatics skill check.',
                Tooltips: [{}],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Interpose',
                Description: ' Once per round, when an ally within range of your normal movement is hit by an attack, you can choose to place yourself between the attacker and your ally as a reaction, making you the target of the attack instead. The attack hits you rather than your ally, and you suffer the effects normally. You cannot use this advantage against area effects or perception range attacks, only those requiring an attack check.',
                Tooltips: [{}],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Inventor',
                Description: 'You can use the Technology skill to create inventions. See <b>{tooltip0}</b>, page 211, for details.',
                Tooltips: [
                    {
                        TooltipTag: 'Inventing',
                        TooltipDescription: 'Characters with the Inventor advantage can create inventions, temporary devices. To create an invention, the inventor defines its effects and its cost in power points. This cost is used for the necessary skill checks, and determines the time required to create the invention. Inventions are subject to the same power level limits as other effects in the series.'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Jack-Of-All-Trades',
                Description: 'You can use any skill untrained, even skills or aspects of skills that normally cannot be used untrained, although you must still have proper tools if the skill requires them.',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Languages',
                Description: 'You can speak and understand additional languages. With one rank in this advantage, you know an additional language. For each additional rank, you double your additional known languages: two at rank 2, four at rank 3, eight at rank 4, etc. So a character with Languages 7 is fluent in 64 languages! Characters are assumed to be fluent in any languages they know, including being able to read and write in them.<br/><br/> For the ability to understand any language, see the Comprehend effect in the Powers chapter.',
                Tooltips: [{}],
                AdvantageType: 'Skill, Ranked',
                Selected: false
            },
            {
                Name: 'Leadership',
                Description: 'Your presence reassures and lends courage to your allies. As a standard action, you can spend a hero point to remove one of the following conditions from an ally with whom you can interact: dazed, fatigued, or stunned.',
                Tooltips: [{}],
                AdvantageType: 'Fortune',
                Selected: false
            },
            {
                Name: 'Luck',
                Description: 'Once per round, you can choose to re-roll a die roll, like spending a hero point(see {tooltip0}, page 20), including adding 10 to re- rolls of 10 or less. You can do this a number of times per game session equal to your Luck rank, with a maximum rank of half the series power level (rounded down). Your Luck ranks refresh when your hero points “reset” at the start of an adventure. The GM may choose to set a different limit on ranks in this advantage, depending on the series.',
                Tooltips: [
                    {
                        TooltipTag: 'Hero Points',
                        TooltipDescription: 'Whether it’s luck, talent, or sheer determination, heroes have something setting them apart from everyone else, allowing them to perform amazing feats under the most difficult circumstances. In Mutants & MasterMinds that “something” is hero points. Spending a hero point can make the difference between success and failure in the game. When you’re entrusted with the safety of the world, that means a lot!<br/><br/>Hero points allow players to “edit” the plot of the adventure and the rules of the game to a degree. They give heroes the ability to do the amazing things heroes do in the comics, but with certain limits, and they encourage players to make the sort of choices heroes do in the comics, in order to get more hero points.<br/><br/>Players start each game session with 1 hero point. During the adventure they get opportunities to earn more hero points. Players can use various tokens(poker chips, glass beads, etc.) to keep track of their hero points, handing them over to the Gamemaster when they spend them. The Gamemaster can likewise give out tokens when awarding hero points to the players.<br/><br/>Unspent hero points don’t carry over to the next adventure; the heroes start out with 1 point again. Use them or lose them! Since hero points are a finite resource, players need to manage them carefully, spending them at the most opportune times and taking chances to earn them through complications. Playing it “safe” tends to eliminate chances of getting more hero points while taking risks, facing complications, and, in general, acting like a hero offers rewards that help them out later on.'
                    }
                ],
                AdvantageType: 'Fortune, Ranked (1/2 PL)',
                Selected: false
            },
            {
                Name: 'Minion',
                Description: 'You have a follower or minion. This minion is an independent character with a power point total of(advantage rank x 15). Minions are subject to the normal power level limits, and cannot have minions themselves. Your minions (if capable of independent thought) automatically have a helpful attitude toward you. They are subject to the normal rules for {tooltip0}(see page 245).<br/><br/>Minions do not earn power points. Instead, you must spend earned power points to increase your rank in this advantage to improve the minion’s power point total and traits. Minions also do not have hero points. Any lost minions are replaced in between adventures with other followers with similar abilities at the Gamemaster’s discretion.',
                Tooltips: [
                    {
                        TooltipTag: 'minions',
                        TooltipDescription: 'Minions are minor characters subject to special rules in combat, and generally easier to defeat than normal characters. Villains often employ hordes of minions against heroes. The following rules apply to minions:<ul><li>Minions cannot score critical hits against non-minions.</li><li>Non-minions can make attack checks against minions as routine checks.</li><li>If a minion fails a resistance check, the minion suffers the worst degree of the effect. So a minion failing a Damage resistance check, for example, is incapacitated, regardless of the degree of failure.</li><li>Certain traits (like the Takedown advantage) are more effective against or specifically target minions.</li></ul>'
                    }
                ],
                AdvantageType: 'General, Ranked',
                Selected: false
            },
            {
                Name: 'Move-By Action',
                Description: 'When taking a standard action and a move action you can move both before and after your standard action, provided the total distance moved isn’t greater than your normal movement speed.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Power Attack',
                Description: 'When you make a {tooltip0} (see Maneuvers, page 250) you can take a penalty of up to –5 on your attack bonus and add the same number(up to + 5) to the effect bonus of your attack.',
                Tooltips: [
                    {
                        TooltipTag: 'power attack',
                        TooltipDescription: 'When you make an attack you can take a penalty of up to –2 on your attack bonus and add the same number (up to + 2) to the effect bonus of your attack. Your attack bonus cannot be reduced below + 0 and the effect bonus cannot more than double. The changes to attack and effect are decided before you make your attack check and last until the start of your next turn. This maneuver does not apply to effects requiring no attack check or allowing no resistance check.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Precise Attack',
                Description: 'When you make close or ranged attacks (choose one) you ignore attack check penalties for cover or concealment (choose one), although total cover still prevents you from making attacks. Each additional rank in this advantage lets you choose an additional option, so with Precise Attack 4, all your attacks(both close and ranged) ignore penalties for both cover and concealment.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked (4)',
                Selected: false
            },
            {
                Name: 'Prone Fighting',
                Description: 'You suffer no circumstance penalty to attack checks for being prone, and adjacent opponents do not gain the usual circumstance bonus for close attacks against you.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Quick Draw',
                Description: 'You can draw a weapon from a holster or sheath as a free action, rather than a move action.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Ranged Attack',
                Description: 'You have a +1 bonus to ranged attacks checks per rank in this advantage. Your total attack bonus is still limited by power level.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Redirect',
                Description: ' If you successfully trick an opponent (see <b>{tooltip0}</b> under Deception in the Skills chapter), you can redirect a missed attack against you from that opponent at another target as a reaction. The new target must be adjacent to you and within range of the attack. The attacker makes a new attack check with the same modifiers as the first against the new target.',
                Tooltips: [
                    {
                        TooltipTag: 'Trick',
                        TooltipDescription: 'You can use Deception to mislead an opponent into taking a potentially unwise action, such as trying to hit you while standing in front of an electrical junction box or at the edge of a precipice. If your Deception check opposed by Deception or Insight succeeds, your opponent is heedless of the potential danger and may hit the junction box or lose his balance and fall, if his attack against you fails. (On the other hand, if the attack succeeds, it might slam you into the junction box or send you flying off the edge. You’re taking a risk.)<br/><br/>More than one degree of failure on the Deception check means you put yourself in a bad position; you are vulnerable against the target’s attacks until the start of your next round!'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Ritualist',
                Description: ' You can use the Expertise: Magic skill to create and cast {tooltip0}(see page 212). This advantage is often a back- up or secondary magical power for superhuman sorcerers, and may be the only form of magic available to some “dabbler” types.',
                Tooltips: [
                    {
                        TooltipTag: 'magical rituals',
                        TooltipDescription: 'Characters with the Ritualist advantage can perform magical rituals. They are similar to inventions: one - time powers requiring some time and effort to set up.<br/><br/>For rituals, substitute the Expertise: Magic skill for both the design and construction checks. The design portion of the ritual takes 4 hours per power point of the ritual’s cost(pouring over ancient scrolls and grimoires, drawing diagrams, casting horoscopes, meditating, consulting spirit- guides, and so forth). The performance of the actual ritual takes 10 minutes per point of the ritual’s cost. So a ritual costing 10 power points takes 40 hours to research and 100 minutes to perform. As with inventing, the ritual is good for one scene. Failing the research check means the ritual isn’t usable and three or more degrees of failure results in a mishap(at the GM’s discretion).<br/><br/>“Jury - rigging” a ritual has the same effects as for an invention. Spending a hero point allows the ritualist to skip the design check and perform the ritual in a number of rounds equal to its cost. An Expertise: Magic check against a DC equal of(15 + the ritual’s cost) is needed to successfully perform the ritual. Failure means the ritual does not work and the time and effort is wasted.'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Second Chance',
                Description: 'Choose a particular hazard, such as falling, being tripped, triggering traps, mind control(or another fairly specific power effect, such as Damage with the fire descriptor) or a particular skill with consequences for failure. If you fail a check against that hazard, you can make another immediately and use the better of the two results. You only get one second chance for any given check, and the GM decides if a particular hazard or skill is an appropriate focus for this advantage. You can take this advantage multiple times, each for a different hazard.',
                Tooltips: [{}],
                AdvantageType: 'General, Ranked',
                Selected: false
            },
            {
                Name: 'Seize Initiative',
                Description: 'You can spend a hero point to automatically go first in the initiative order. You may only do so at the start of combat, when you would normally make your initiative check. If more than one character uses this advantage, they all make initiative checks normally and act in order of their initiative result, followed by all the other characters who do not have this advantage.',
                Tooltips: [{}],
                AdvantageType: 'Fortune',
                Selected: false
            },
            {
                Name: 'Set-Up',
                Description: ' You can transfer the benefits of a successful combat use of an interaction skill to your teammate(s). For example, you can feint and have your target vulnerable against one or more allies next attack(s), rather than yours. Each rank in the advantage lets you transfer the benefit to one ally. The interaction skill check requires its normal action, and the affected allies must be capable of interacting with you(or at least seeing the set - up) to benefit from it.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Sidekick',
                Description: 'You have another character serving as your partner and aide. Create your sidekick as an independent character with (advantage rank x 5) power points, and subject to the series power level. A sidekick’s power point total must be less than yours. Your sidekick is an NPC, but automatically helpful and loyal to you. Gamemasters should generally allow you to control your sidekick, although sidekicks remain NPCs and the GM has final say in their actions.<br/><br/>Sidekicks do not earn power points. Instead, you must spend earned power points to increase your rank in Sidekick to improve the sidekick’s power point total and traits; each point you spend to increase your rank in Sidekick grants the sidekick 5 additional power points. Sidekicks also do not have hero points, but you can spend your own hero points on the sidekick’s behalf with the usual benefits. Sidekicks are not minions, but full- fledged characters, so they are not subject to the minion rules.',
                Tooltips: [{}],
                AdvantageType: 'General, Ranked',
                Selected: false
            },
            {
                Name: 'Skill Mastery',
                Description: 'Choose a skill. You can make routine checks with that skill even when under pressure(see <b>{tooltip0}</b> in the Basics chapter). This advantage does not allow you to make routine checks with skills that do not normally allow you to do so. You can take this advantage multiple times for different skills.',
                Tooltips: [
                    {
                        TooltipTag: 'Routine Checks',
                        TooltipDescription: ' A check normally represents performing a task under a certain amount of pressure, in the midst of the furious action of super-heroic adventure. When the situation is less demanding, you can achieve more reliable results.<br/><br/>Under routine circumstances—when you are not under any pressure—instead of rolling the die for the check, calculate your result as if you had rolled a 10. This ensures success for average(DC 10) tasks with a modifier of + 0 or more. More capable characters(with higher bonuses) can succeed on more difficult checks on a routine basis: a + 10 bonus, for example, means a routine check total of 20, able to succeed at DC 20 tasks on a routine basis, and achieve three degrees of success on average(DC 10) tasks on a routine basis.'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Startle',
                Description: 'You can use Intimidation rather than Deception to feint in combat(see <b>{tooltip0}</br> under the Deception skill description). Targets resist with Insight, Intimidation, or Will defense.',
                Tooltips: [
                    {
                        TooltipTag: 'Feint',
                        TooltipDescription: 'You can use Deception as a standard action to mislead an opponent in combat. Make a Deception check as a standard action opposed by the better of your target’s Deception or Insight. If your Deception check succeeds, the target is vulnerable against your next attack, until the end of your next round(see Vulnerable in the Conditions section of The Basics chapter).'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Takedown',
                Description: ' If you render a minion incapacitated with an attack, you get an immediate extra attack as a free action against another minion within range and adjacent to the previous target’s location. The extra attack is with the same attack and bonus as the first. You can continue using this advantage until you miss or there are no more minions within range of your attack or your last target.<br/><br/>A second rank in this advantage allows you to attack nonadjacent minion targets, moving between attacks if necessary to do so. You cannot move more than your total speed in the round, regardless of the number of attacks you make. You stop attacking once you miss, run out of movement, or there are no more minions within range of your attack.',
                Tooltips: [{}],
                AdvantageType: 'Combat, Ranked (2)',
                Selected: false
            },
            {
                Name: 'Taunt',
                Description: 'You can demoralize an opponent with Deception rather than Intimidation(see <b>{tooltip0}</b> under the Intimidation skill description), disparaging and undermining confidence rather than threatening. Targets resist using Deception, Insight, or Will defense.',
                Tooltips: [
                    {
                        TooltipTag: 'Demoralize',
                        TooltipDescription: 'You can use Intimidation in combat as a standard action to undermine an opponent’s confidence. Make an Intimidation check as a standard action. If it succeeds, your target is impaired (a –2 circumstance penalty on checks) until the end of your next round. With four or more degrees of success, the target is disabled(a –5 penalty) until the end of your next round.'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Teamwork',
                Description: 'You’re effective at helping out your friends. When you support a team check(see <b>{tooltip0}</b> in the Basics chapter) you have a + 5 circumstance bonus to your check. This bonus also applies to the Aid action and Team Attacks.',
                Tooltips: [
                    {
                        TooltipTag: 'Team Checks',
                        TooltipDescription: ' Sometimes characters work together and help each other out. In this case, one character(usually the one with the highest bonus) is considered the leader of the effort and makes the check normally, while each helper makes the same type of check using the same trait(s) against DC 10. The helpers’ individual degrees of success(and failure!) are added together to achieve the final outcome of the assistance.<br/><br/>Success grants the leader a + 2 circumstance bonus. Three or more total degrees of success grant a + 5 circumstance bonus. One degree of failure provides no modifier, but two or more impose a –2 circumstance penalty!<br/><br/>The GM sets the limit on how many characters can help as part of a team check. Regardless of the number of helpers, the leader’s bonus cannot be more than + 5 (for three or more total degrees of success) nor the penalty greater than –2(for two or more total degrees of failure).'
                    }
                ],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Throwing Mastery',
                Description: 'You have a +1 damage bonus with thrown weapons per rank in this advantage. You can also throw normally harmless objects—playing cards, pens, paper clips, and so forth—as weapons with a damage bonus equal to your advantage rank and range based on the higher of your advantage rank or Strength(see <b>{tooltip0}</b> in the Powers chapter). Your maximum damage bonus with any given weapon or attack is still limited by power level.',
                Tooltips: [
                    {
                        TooltipTag: 'Ranged',
                        TooltipDescription: ' The effect works at a distance, limited by perception and path and requiring a ranged attack check against the subject’s Dodge defense. A ranged effect has a short range of(rank x 25 feet), a medium range of(rank x 50 feet) and a long range of (rank x 100 feet). Ranged attack checks at medium range suffer a –2 circumstance penalty, while ranged attacks at long range suffer a –5 circumstance penalty. See the <b>Action & Adventure</b> chapter for details.'
                    }
                ],
                AdvantageType: 'Combat, Ranked',
                Selected: false
            },
            {
                Name: 'Tracking',
                Description: ' You can use the Perception skill to visually follow tracks like the Tracking Senses effect (see the Powers chapter).',
                Tooltips: [{}],
                AdvantageType: 'Skill',
                Selected: false
            },
            {
                Name: 'Trance',
                Description: 'Through breathing and bodily control, you can slip into a deep trance. This takes a minute of uninterrupted meditation and a DC 15 Awareness check. While in the trance you add your Awareness rank to your Stamina rank to determine how long you can hold your breath and you use the higher of your Fortitude or Will defenses for resistance checks against suffocation(see <b>{tooltip0}</b>, page 238). Poison and disease effects are suspended for the duration of the trance. It requires a Perception check with a DC equal to your Awareness check result to determine you’re not dead because your bodily functions are so slow. You are aware of your surroundings while in trance and can come out of it at any time at will. You cannot take any actions while in the trance, but your GM may allow mental communication while in a trance.',
                Tooltips: [
                    {
                        TooltipTag: 'Suffocation',
                        TooltipDescription: 'Characters can hold their breath for ten rounds (one minute) plus a number of rounds equal to twice their Stamina. After that time they must make a Fortitude check(DC 10) each round to continue holding their breath. The DC increases by + 1 for each previous success. Failure on the Fortitude check means the character becomes incapacitated . On the following round the character is dying. A dying character cannot stabilize until able to breathe again. Heroes with Immunity to Suffocation can go an unlimited time without air.'
                    }
                ],
                AdvantageType: 'General',
                Selected: false
            },
            {
                Name: 'Ultimate Effort',
                Description: 'You can spend a hero point on a particular check and treat the roll as a 20 (meaning you don’t need to roll the die at all, just apply a result of 20 to your modifier). This is not a natural 20, but is treated as a roll of 20 in all other respects. You choose the particular check the advantage applies to when you acquire it and the GM must approve it. You can take Ultimate Effort multiple times, each time, it applies to a different check. This advantage may not be used after you’ve rolled the die to determine if you succeed.<br/><br/><b>{tooltip0}</b>',
                Tooltips: [
                    {
                        TooltipTag: 'Sample Ultimate Efforts',
                        TooltipDescription: 'The following are some potential Ultimate Efforts. The GM is free to add others suitable to the series.<ul><li><b>Ultimate Aim:</b> When you take a standard action to aim an attack (see Aim, page 246), you can spend a hero point to apply a 20 result to the attack check on the following round. Since the Ultimate Aim bonus is not a natural 20, it also does not qualify as an automatic or critical hit.</li><li><b>Ultimate Resistance:</b> You can spend a hero point to apply a 20 result to a resistance check with one defense determined when you acquire this advantage.</li><li><b>Ultimate Skill:</b> You can spend a hero point to apply a 20 result to checks with a particular skill.</li></ul>'
                    }
                ],
                AdvantageType: 'Fortune',
                Selected: false
            },
            {
                Name: 'Uncanny Dodge',
                Description: 'You are especially attuned to danger. You are not vulnerable when surprised or otherwise caught off- guard. You are still made vulnerable by effects that limit your mobility.',
                Tooltips: [{}],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Weapon Bind',
                Description: 'If you take the defend action (see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter) and successfully defend against a close weapon attack, you can make a disarm attempt against the attacker immediately as a reaction. The disarm attempt is carried out normally, including the attacker getting the opportunity to disarm you.',
                Tooltips: [
                    {
                        TooltipTag: 'Defend',
                        TooltipDescription: 'Rather than attacking, you focus on defense. Make an opposed check of your appropriate active defense versus any attack made on you until the start of your next turn. Add 10 to any roll of 10 or less that you make on these checks, just as if you spent a hero point (thus ensuring a minimum roll of 11). The attacker must equal or exceed your opposed check result in order to hit you.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Weapon Break',
                Description: 'If you take the defend action (see <b>{tooltip0}</b> in the <b>Action & Adventure</b> chapter) and successfully defend against a close weapon attack, you can make an attack against the attacker’s weapon immediately as a reaction. This requires an attack check and inflicts normal damage to the weapon if it hits(see {tooltip1} in the <b>Action & Adventure</b> chapter).',
                Tooltips: [
                    {
                        TooltipTag: 'Defend',
                        TooltipDescription: 'Rather than attacking, you focus on defense. Make an opposed check of your appropriate active defense versus any attack made on you until the start of your next turn. Add 10 to any roll of 10 or less that you make on these checks, just as if you spent a hero point (thus ensuring a minimum roll of 11). The attacker must equal or exceed your opposed check result in order to hit you.'
                    },
                    {
                        TooltipTag: 'Smash',
                        TooltipDescription: 'You attempt to damage or break an object held or worn by an opponent. Make an attack check against the defense of the character with the object, with a –5 circumstance penalty if you are attacking a held object. If your attack check succeeds, you inflict damage on the object rather than the character. See <b>Damaging Objects</b> for details on breaking things.'
                    }
                ],
                AdvantageType: 'Combat',
                Selected: false
            },
            {
                Name: 'Well-Informed',
                Description: 'You are exceptionally well-informed. When encountering an individual, group, or organization for the first time, you can make an immediate Investigation or Persuasion skill check to see if your character has heard something about the subject. Use the guidelines for gathering information in the <b>{tooltip0}</b> skill description to determine the level of information you gain. You receive only one check per subject upon first encountering them, although the GM may allow another upon encountering the subject again once significant time has passed.',
                Tooltips: [
                    {
                        TooltipTag: 'Investigation',
                        TooltipDescription: 'You know how to make contacts, collect gossip and rumors, question informants, and otherwise get information from people.<br/><br/>By succeeding at a DC 10 Investigation check taking at least an hour, you get a feel for the major news and rumors in an area. This assumes no obvious reasons exist why information would be withheld. The degree of the check result determines the completeness and detail of the information. Information ranges from general to protected, and the DC increases accordingly for the type of information, as given on the table.<h4> Gather Information Results</h4><table><tr><th>Degree of Success</th><th>Type of Information</th></tr><tr><td>One</td><td>General</td></tr><tr><td>Two</td><td>Specific</td></tr><tr><td>Three</td><td>Restricted</td></tr><tr><td>Four</td><td>Protected</td></tr></table><ul><li><i>General</i> information concerns local happenings, rumors, gossip, and the like.</li><li><i>Specific</i> information usually relates to a particular question.</li><li><i>Restricted</i> information isn’t generally known and requires you to locate someone with access to the information.</li><li><i>Protected</i> information is even harder to come by and might involve some danger, either for the one asking the questions or the one providing the answers.</li></ul>Failure on the Investigation check means you waste time turning up nothing of value. An additional degree of failure means you also alert someone who may be interested in your inquiries, perhaps even someone you are investigating!'
                    }
                ],
                AdvantageType: 'Skill',
                Selected: false
            },
        ];

        const powers = [];

        const basicConditions = [
            {
                Name: "Compelled",
                Description: "Directed by an outside force, limited to free actions and a single standard action per turn, chosen by another controlling character. Can trade standard action for move action.",
                DescriptionSummary: "Single standard action determined by another.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Controlled"]
            },
            {
                Name: "Controlled",
                Description: "A controlled character has no free will; the character’s actions each turn are dictated by another, controlling, character.",
                DescriptionSummary: "Another character determines actions.",
                AccompanyingCondition: [],
                Supersedes: ["Compelled"],
                SupersededBy: []
            },
            {
                Name: "Dazed",
                Description: "A dazed character is limited to free actions and a single standard action per turn, although the character may use that action to perform a move, as usual. Stunned supersedes dazed.",
                DescriptionSummary: "May only take free actions and a single standard action.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Stunned"]
            },
            {
                Name: "Debilitated",
                Description: "The character has one or more abilities lowered below –5. (See <b>Debilitated Abilities</b> in the <b>Abilities</b> chapter).",
                DescriptionSummary: "One or more abilities at -5.",
                AccompanyingCondition: [],
                Supersedes: ["Disabled"],
                SupersededBy: []
            },
            {
                Name: "Defenseless",
                Description: "A defenseless character has active defense bonuses of 0. Attackers can make attacks on defenseless opponents as routine checks (see <b>Routine Checks</b>). If the attacker chooses to forgo the routine check and make a normal attack check, any hit is treated as a critical hit(see <b>Critical Hits</b>, page 240). Defenseless characters are often prone, providing opponents with an additional bonus to attack checks (see <b>Prone</b>, later in this section).",
                DescriptionSummary: "Active defenses equal 0, often prone. <i>Supersedes vulnerable</i>.",
                AccompanyingCondition: [],
                Supersedes: ["Vulnerable"],
                SupersededBy: []
            },
            {
                Name: "Disabled",
                Description: "A disabled character is at a –5 circumstance penalty on checks. If the penalty applies to specific checks, they are added to the name of the condition, such as Attack Disabled, Fighting Disabled, Perception Disabled, and so forth. Debilitated, if it applies to the same trait(s), supersedes disabled.",
                DescriptionSummary: "-5 penalty on checks. <i>Supersedes impaired</i>.",
                AccompanyingCondition: [],
                Supersedes: ["Impaired", "Weakened"],
                SupersededBy: ["Debilitated"]
            },
            {
                Name: "Fatigued",
                Description: "Fatigued characters are hindered. Characters recover from a fatigued condition after an hour of rest.",
                DescriptionSummary: "Hindered, recover after 1 hour of rest.",
                AccompanyingCondition: ["Hindered"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Hindered",
                Description: "A hindered character moves at half normal speed(–1 speed rank). Immobile supersedes hindered.",
                DescriptionSummary: "Move at -1 speed rank.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Immobile"]
            },
            {
                Name: "Immobile",
                Description: "Immobile characters have no movement speed and cannot move from the spot they occupy, although they are still capable of taking actions unless prohibited by another condition.",
                DescriptionSummary: "Have no movement speed, cannot move, but can take actions. <i>Supersedes hindered</i>.",
                AccompanyingCondition: [],
                Supersedes: ["Hindered"],
                SupersededBy: []
            },
            {
                Name: "Impaired",
                Description: "An impaired character is at a –2 circumstance penalty on checks. If the impairment applies to specific checks, they are added to the name of the condition, such as Attack Impaired, Fighting Impaired, Perception Impaired, and so forth. If it applies to the same trait(s), disabled supersedes impaired.",
                DescriptionSummary: "-2 penalty on checks.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Disabled"]
            },
            {
                Name: "Normal",
                Description: "The character is unharmed and unaffected by other conditions, acting normally.",
                DescriptionSummary: "Unaffected by other conditions.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Compelled", "Controlled", "Dazed", "Debilitated", "Defenseless", "Disabled", "Fatigued", "Hindered", "Immobile", "Impaired", "Stunned", "Transformed", "Unaware", "Vulnerable", "Weakened", "Asleep", "Blind", "Bound", "Deaf", "Dying", "Entranced", "Exhausted", "Incapacitated", "Paralyzed", "Prone", "Restrained", "Staggered", "Surprised"]
            },
            {
                Name: "Stunned",
                Description: "Stunned characters cannot take any actions, including free actions",
                DescriptionSummary: "Cannot take actions.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Transformed",
                Description: "Transformed characters have some or all of their traits altered by an outside agency. This may range from a change in the character’s appearance to a complete change in trait ranks, even the removal of some traits and the addition of others! The primary limit on the transformed condition is the character’s power point total cannot increase, although it can effectively decrease for the duration of the transformation, such as when a powerful superhero is turned into an otherwise powerless mouse or frog(obviously based on considerably fewer power points).",
                DescriptionSummary: "Traits altered by outside agent. Depends on effect.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Unaware",
                Description: "The character is completely unaware of his surroundings, unable to make interaction or Perception checks or perform any action based on them. If the condition applies to a specific sense or senses, they are added to the name of the condition, such as visually unaware, tactilely unaware(or numb), and so forth. Subjects have full concealment from all of a character’s unaware senses.",
                DescriptionSummary: "Unable to make interaction or Perception checks or perform actions based on them.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Vulnerable",
                Description: "Vulnerable characters are limited in their ability to defend themselves, halving their active defenses(round up the final value). Defenseless supersedes vulnerable.",
                DescriptionSummary: "Active defenses are halved (round up).",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Defenseless"]
            },
            {
                Name: "Weakened",
                Description: "The character has temporarily lost power points in a trait. See the <b>Weaken</b> effect in the <b>Powers</b> chapter for more. Debilitated supersedes weakened.",
                DescriptionSummary: "Temporarily lost power points in a trait. Depends on effect.",
                AccompanyingCondition: [],
                Supersedes: [],
                SupersededBy: ["Debilitated"]
            },
        ];

        const combinedConditions = [
            {
                Name: "Asleep",
                Description: "While asleep, a character is defenseless, stunned, and unaware.A hearing Perception check with three or more degrees of success wakes the character and removes all these conditions, as does any sudden movement (such as shaking the sleeping character) or any effect allowing a resistance check.",
                DescriptionSummary: "Defenseless, stunned, and unaware.",
                basicConditions: ["Defenseless", "Stunned", "Unaware"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Blind",
                Description: "The character cannot see. Everything effectively has full visual concealment from him. He is hindered, visually unaware, and vulnerable, and may be impaired or disabled for activities where vision is a factor.",
                DescriptionSummary: "Hindered, visually unaware, vulnerable, may be impaired or disabled for visual tasks.",
                basicConditions: ["Hindered", "Unaware", "Vulnerable"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Bound",
                Description: "A bound character is defenseless, immobile, and impaired.",
                DescriptionSummary: "Defenseless, immobile, and impaired.",
                basicConditions: ["Defenseless", "Immobile", "Impaired"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Deaf",
                Description: "The character cannot hear, giving everything total auditory concealment from him. This may allow for surprise attacks on the unaware character (see <b>Surprise Attack</b> in the <b>Action & Adventure</b> chapter). Interaction with other characters is limited to sign-language and lip-reading (see <b>Interaction Skills</b> in <b>Chapter 3</b>).",
                DescriptionSummary: "Auditorily unaware",
                basicConditions: [],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Dying",
                Description: "A dying character is incapacitated (defenseless, stunned, and unaware) and near death. When the character gains this condition, immediately make a Fortitude check (DC 15). If the check succeeds, nothing happens. With two degrees of success, the character stabilizes, removing this condition. If the check fails, the character remains dying. Three or more total degrees of failure mean the character dies: so three failed Fortitude checks or one or two checks adding up to three degrees. Dying characters make a Fortitude check each round until they either die or stabilize. Another character can stabilize a dying character with a successful Treatment check (DC 15) or use of a Healing effect (see the <b>Powers</b> chapter).",
                DescriptionSummary: "Incapacitated. May die (see <b>Dying</b> in the <i>Hero's Handbook</i>).",
                basicConditions: ["Incapacitated", "Defenseless", "Stunned", "Unaware"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Entranced",
                Description: "An entranced character is stunned, taking no actions other than paying attention to the entrancing effect. Any obvious threat automatically breaks the trance. An ally can also shake a character free of the condition with an interaction skill check (DC 10 + effect rank).",
                DescriptionSummary: "Stunned, but may only pay attention to entrancing effect. Breaks free if threatened or from allies interaction skill check (DC 10 + effect rank).",
                basicConditions: ["Stunned"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Exhausted",
                Description: "Exhausted characters are near collapse. They are impaired and hindered. Characters recover from an exhausted condition after an hour of rest in comfortable surroundings.",
                DescriptionSummary: "Impaired and hindered, recover after 1 hour of rest.",
                basicConditions: ["Impaired", "Hindered"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Incapacitated",
                Description: "An incapacitated character is defenseless, stunned, and unaware. Incapacitated characters generally also fall prone, unless some outside force or aid keeps them standing.",
                DescriptionSummary: "Defenseless, stunned, unaware. Usually prone.",
                basicConditions: ["Defenseless", "Stunned", "Unaware"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Paralyzed",
                Description: "A paralyzed character is defenseless, immobile, and physically stunned, frozen in place and unable to move, but still aware and able to take purely mental actions, involving no physical movement whatsoever.",
                DescriptionSummary: "Defenseless, immobile, and physically stunned; may be able to take mental actions.",
                basicConditions: ["Defenseless", "Immobile", "Stunned"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Prone",
                Description: " A prone character is lying on the ground, receiving a –5 circumstance penalty on close attack checks. Opponents receive a + 5 circumstance bonus to close attack checks but a –5 penalty to ranged attack checks (effectively giving the prone character total cover against ranged attacks).Prone characters are hindered. Standing up from a prone position is a move action.",
                DescriptionSummary: "Hindered, -5 penalty on close attack checks, +5 bonus to attacker's close attack checks. Move action to stand.",
                basicConditions: ["Hindered"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Restrained",
                Description: "A restrained character is hindered and vulnerable. If the restraints are anchored to an immobile object, the character is immobile rather than hindered. If restrained by another character, the restrained character is immobile but may be moved by the restraining character.",
                DescriptionSummary: "Hindered and vulnerable, immobile if restraints are anchored.",
                basicConditions: ["Hindered", "Vulnerable"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Staggered",
                Description: "A staggered character is dazed and hindered.",
                DescriptionSummary: "Dazed and hindered.",
                basicConditions: ["Dazed", "Hindered"],
                Supersedes: [],
                SupersededBy: []
            },
            {
                Name: "Surprised",
                Description: "A surprised character is stunned and vulnerable, caught off-guard and therefore unable to act, and less able to avoid attacks.",
                DescriptionSummary: "Stunned and vulnerable.",
                basicConditions: ["Stunned", "Vulnerable"],
                Supersedes: [],
                SupersededBy: []
            }
        ];
        //#endregion