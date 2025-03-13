import { GetBasicConditions, GetCombinedConditions, GetCombinedConditionByConditionName, GetBasicConditionByConditionName } from "./database-handler.ts";
import { GenerateGuid } from "./guid-handler.js";
import { SaveCreaturesToCookies, LoadCreaturesFromCookies } from "./cookie-handler.js";

document.addEventListener('DOMContentLoaded', function() {
    PopulateConditionsList();

    document.getElementById('addCreatureBtn').addEventListener('click', AddConditionCreature);
});

async function PopulateConditionsList() {
    const conditionsLists = {
        'baseConditionsUList': await GetBasicConditions(),
        'combinedConditionsUList': await GetCombinedConditions()
    };

    for (const [elementId, conditions] of Object.entries(conditionsLists)) {
        const conditionsListElement = document.getElementById(elementId);
        conditionsListElement.innerHTML = '';
        conditions.forEach(condition => {
            const listItem = CreateListItem(condition);
            conditionsListElement.appendChild(listItem);
        });
    }

    CheckCookiesForCreatures();
}

function CheckCookiesForCreatures() {
    const creatures = LoadCreaturesFromCookies();

    if (creatures) {
        creatures.forEach(async creature => {
            const creatureDiv = await CreateCreatureDiv(creature.id);

            // Set the saved name and injuries
            const nameInput = creatureDiv.querySelector(".creature-name-input");
            nameInput.value = creature.name;

            const injuryInput = creatureDiv.querySelector(".creature-injury-input");
            injuryInput.value = creature.injuries;

            // Append the creature to the list first
            const creaturesList = document.getElementById("creaturesList");
            creaturesList.appendChild(creatureDiv);

            // Simulate button clicks to activate conditions
            for (const conditionName of creature.activeConditions) {
                const button = creatureDiv.querySelector(`button[data-condition="${conditionName}"]`);
                if (button) {
                    button.classList.add("red");
                    const isCombinedCondition = await IsCombinedCondition(conditionName);
                    await AddEffectToCreature(creature.id, conditionName, isCombinedCondition);
                }
            }
        });
    }
}

async function IsCombinedCondition(conditionName) {
    const combinedConditions = await GetCombinedConditions();
    return combinedConditions.some(condition => condition.ConditionName === conditionName);
}

function CreateListItem(condition) {
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

async function AddConditionCreature() {
    const creaturesList = document.getElementById("creaturesList");
    const creatureId = GenerateGuid();
    const creatureDiv = await CreateCreatureDiv(creatureId);

    creaturesList.appendChild(creatureDiv);

    // Save to local storage
    SaveCreaturesToCookies();
}

export async function CreateCreatureDiv(creatureId) {
    const creatureDiv = document.createElement("div");
    creatureDiv.id = creatureId;
    creatureDiv.classList.add("creature");

    const creatureHeader = CreateCreatureHeader(creatureId, creatureDiv);
    const buttonsContainer = await CreateConditionsButtonsContainer(creatureId);

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

function CreateCreatureHeader(creatureId, creatureDiv) {
    const creatureHeader = document.createElement("div");
    creatureHeader.classList.add("creature-header");

    // Create delete button with dustbin icon
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "🗑"; // using an emoji for the dustbin icon; replace with icon as needed
    deleteButton.addEventListener("click", () => {
        creatureDiv.remove();
        SaveCreaturesToCookies();
    });

    const creatureTitle = document.createElement("h3");
    creatureTitle.innerText = "Creature Name:";

    const creatureNameInput = document.createElement("input");
    creatureNameInput.type = "text";
    creatureNameInput.placeholder = "Enter creature name...";
    creatureNameInput.classList.add("creature-name-input");
    creatureNameInput.addEventListener("input", SaveCreaturesToCookies); // Add event listener

    creatureHeader.appendChild(deleteButton);
    creatureHeader.appendChild(creatureTitle);
    creatureHeader.appendChild(creatureNameInput);

    const creatureInjuryTitle = document.createElement("h5");
    creatureInjuryTitle.innerText = "Injuries:";

    const creatureInjuryInput = document.createElement("input");
    creatureInjuryInput.type = "text";
    creatureInjuryInput.placeholder = "0";
    creatureInjuryInput.classList.add("creature-injury-input");
    creatureInjuryInput.addEventListener("input", SaveCreaturesToCookies); // Add event listener

    creatureHeader.appendChild(creatureInjuryTitle);
    creatureHeader.appendChild(creatureInjuryInput);

    return creatureHeader;
}

async function CreateConditionsButtonsContainer(creatureId) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("conditions-buttons-container");

    try {
        const basicConditions = await GetBasicConditions();
        const combinedConditions = await GetCombinedConditions();

        AppendConditionsButtons(buttonsContainer, "Basic Conditions", basicConditions, creatureId, false);
        AppendConditionsButtons(buttonsContainer, "Combined Conditions", combinedConditions, creatureId, true);
    } catch (error) {
        console.error("Error fetching conditions: ", error);
    }

    return buttonsContainer;
}

function AppendConditionsButtons(container, titleText, conditions, creatureId, isCombined) {
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
                RemoveEffectFromCreature(creatureId, condition.ConditionName);
            } else {
                conditionBtn.classList.add("red");
                AddEffectToCreature(creatureId, condition.ConditionName, isCombined);
            }
        });
        container.appendChild(conditionBtn);
    });
}

async function AddEffectToCreature(creatureId, effectName, isCombinedCondition = false) {
    const effectsList = document.getElementById(`effects-${creatureId}`);
    const effectItem = document.createElement("li");

    if (isCombinedCondition) {
        const combinedCondition = await GetCombinedConditionByConditionName(effectName);
        effectItem.dataset.basicConditions = JSON.stringify(combinedCondition.BasicConditions.split(','));
        AppendCombinedCondition(effectItem, combinedCondition);
    } else {
        const basicCondition = await GetBasicConditionByConditionName(effectName);
        AppendBasicCondition(effectItem, basicCondition);
    }

    effectsList.appendChild(effectItem);
    PreventDuplicateBasicCondition(effectName);

    // Save to local storage
    SaveCreaturesToCookies();
}

function AppendCombinedCondition(effectItem, combinedCondition) {
    if (combinedCondition) {
        const description = `<b>${combinedCondition.ConditionName}: </b>${combinedCondition.DescriptionSummary}`;
        effectItem.innerHTML = description;

        const subList = document.createElement("ul");
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

function AppendBasicCondition(effectItem, basicCondition) {
    if (basicCondition) {
        effectItem.innerHTML = `<b>${basicCondition.ConditionName}: </b>${basicCondition.DescriptionSummary}`;
    }
}

function PreventDuplicateBasicCondition(effectName) {
    const basicConditionBtn = document.querySelector(`button[data-condition="${effectName}"]`);
    if (basicConditionBtn && basicConditionBtn.classList.contains("grey")) {
        alert("This basic condition is currently part of an active combined condition and cannot be added individually.");
        return;
    }
}

async function RemoveEffectFromCreature(creatureId, effectName) {
    const effectsList = document.getElementById(`effects-${creatureId}`);
    const effectItemToRemove = Array.from(effectsList.getElementsByTagName("li")).find(item =>
        item.innerHTML.includes(`<b>${effectName}: </b>`));

    if (effectItemToRemove) {
        effectsList.removeChild(effectItemToRemove);

        // Save to local storage
        SaveCreaturesToCookies();
    }
}