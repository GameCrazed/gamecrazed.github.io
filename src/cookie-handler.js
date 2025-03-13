// Helper function to set a cookie
function SetCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function GetCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function SaveCreaturesToCookies() {
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

    SetCookie("creatureConditions", JSON.stringify(creatures), 7); // Save for 7 days
}

export function LoadCreaturesFromCookies() {
    const creatures = JSON.parse(GetCookie("creatureConditions"));
    return creatures;
}

export function LoadPowersFromCookies() {
    const powers = JSON.parse(GetCookie('powers')) || [];

    return powers;
}

export function SavePowersToCookies(powers) {
    SetCookie('powers', JSON.stringify(powers), 7); // Save for 7 days
}

export function RemovePowerFromCookies(powerId) {
    const powers = JSON.parse(GetCookie('powers')) || [];
    if (powerId !== null) {
        const index = powers.findIndex(power => power.powerId === powerId);

        if (index > -1) {
            powers.splice(index, 1);
        }

        SetCookie('powers', JSON.stringify(powers), 7); // Save for 7 days
    }
}