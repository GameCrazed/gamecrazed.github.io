import { GetAdvantages, GetToolTipByTag, GetToolTipById } from "./index.ts";

document.addEventListener('DOMContentLoaded', function() {
    PopulateAdvantagesList();
});

async function PopulateAdvantagesList() {
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
            ReFilterAdvantages();
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
                ShowTooltipPopup(tooltip, event);
            });
        });


        return listItem;
    })).then(listItems => {
        listItems.forEach(listItem => {
            advantagesListElement.appendChild(listItem);
        });
    });
}

function ReFilterAdvantages() {
    const showSelectedOnly = document.getElementById('filterAdvantagesCheckbox').checked;

    if (showSelectedOnly) {
        FilterAdvantages();
    }
}

function FilterAdvantages() {
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

function ShowTooltipPopup(tooltipData, event) {
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