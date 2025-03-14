import { GetAdvantages, GetToolTipByTag, GetToolTipById } from "./database-handler.ts";

document.addEventListener('DOMContentLoaded', function() {
    PopulateAdvantagesList();
    document.getElementById('filterAdvantagesCheckbox').addEventListener('change', ReFilterAdvantages);
    document.getElementById('searchAdvantages').addEventListener('input', ReFilterAdvantages);
});

let advantages = [];

async function PopulateAdvantagesList() {
    const advantagesListElement = document.getElementById('advantagesList');
    advantagesListElement.innerHTML = '';
    advantages = await GetAdvantages();

    advantages.forEach(advantage => {
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

        // Add event listener to load description on expand
        listItem.addEventListener('click', async (event) => {
            if (!event.target.matches('input[type="checkbox"]')) {
                listItem.classList.toggle('expanded');
                if (listItem.classList.contains('expanded') && !listItem.querySelector('.description')) {
                    let descriptionHtml = advantage.Description;

                    // Use a regular expression to find all instances of words within {}
                    const regex = /\{(.*?)\}/g;
                    let match;
                    while ((match = regex.exec(descriptionHtml)) !== null) {
                        const word = match[1];
                        const tooltip = await GetToolTipByTag(word);
                        descriptionHtml = descriptionHtml.replace(`{${word}}`, `<span class="tooltip" data-tooltip-index="${tooltip.TooltipId}">${tooltip.TooltipTag}</span>`);
                    }

                    const descriptionElement = document.createElement('div');
                    descriptionElement.className = 'description';
                    descriptionElement.innerHTML = descriptionHtml;
                    listItem.appendChild(descriptionElement);

                    // Add event listener for tooltips
                    const tooltips = listItem.querySelectorAll('.tooltip');
                    tooltips.forEach((tooltip) => {
                        tooltip.addEventListener('click', async (event) => {
                            event.stopPropagation(); // Prevent toggling the 'expanded' class on li
                            const tooltipIndex = event.target.getAttribute('data-tooltip-index');
                            const tooltip = await GetToolTipById(tooltipIndex);
                            ShowTooltipPopup(tooltip, event);
                        });
                    });
                }
            }
        });

        advantagesListElement.appendChild(listItem);
    });

    ReFilterAdvantages();
}

function ReFilterAdvantages() {
    const showSelectedOnly = document.getElementById('filterAdvantagesCheckbox').checked;
    const searchInput = document.getElementById('searchAdvantages').value.trim().toLowerCase();
    const listItems = document.querySelectorAll('#advantagesList li');

    listItems.forEach(item => {
        const text = item.querySelector('strong').textContent.trim().toLowerCase();
        const advantage = advantages.find(adv => adv.AdvantageName.toLowerCase() === text);
        const isSelected = advantage ? advantage.Selected : false;

        const matchesSearch = text.includes(searchInput);
        const matchesFilter = !showSelectedOnly || isSelected;

        if (matchesSearch && matchesFilter) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function ShowTooltipPopup(tooltipData, event) {
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
    const tooltipPopup = document.getElementById('tooltipPopup');
    isDragging = true;
    offsetX = e.clientX - tooltipPopup.offsetLeft;
    offsetY = e.clientY - tooltipPopup.offsetTop;
}

// Function to handle mouse movement during dragging
function doDrag(e) {
    if (isDragging) {
        const tooltipPopup = document.getElementById('tooltipPopup');

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
const tooltipPopup = document.getElementById('tooltipPopup');
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