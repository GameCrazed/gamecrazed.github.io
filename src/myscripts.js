//#region /*----------Core Functions----------*/
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('degreeCalcBtn').addEventListener('click', calculateDegrees);
});

export function generateGuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

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

//#region /*----------Powers Tab Functions----------*/

function LoadPowersFromLocalStorage() {
    const localPowers = JSON.parse(localStorage.getItem('powers')) || [];

    if (localPowers !== undefined && localPowers.length != 0) {
        powers.push(...localPowers);
    }

    RenderPowers();
}

function savePowersToLocalStorage(power) {
    if (power !== null && typeof power === 'object') {
        powers.push(power);
    }
    localStorage.setItem('powers', JSON.stringify(powers));
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
//#endregion