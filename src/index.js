//#region /*----------Core Functions----------*/
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('degreeCalcBtn').addEventListener('click', CalculateDegrees);
});

function CalculateDegrees() {
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