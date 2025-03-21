import { GenerateGuid } from "./guid-handler";

const cookieDurationDays = 30;

// Helper function to set a cookie
function SetCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Helper function to get a cookie
function GetCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

interface Creature {
    id: string;
    name: string;
    injuries: string;
    activeConditions: string[];
}

export function SaveCreaturesToCookies(): void {
    const creaturesList = document.getElementById("creaturesList");
    const creatures: Creature[] = [];

    creaturesList?.childNodes.forEach(creatureDiv => {
        const creatureElement = creatureDiv as HTMLElement;
        const creature: Creature = {
            id: creatureElement.id,
            name: (creatureElement.querySelector(".creature-name-input") as HTMLInputElement).value,
            injuries: (creatureElement.querySelector(".creature-injury-input") as HTMLInputElement).value,
            activeConditions: []
        };

        const conditionButtons = creatureElement.querySelectorAll('button[data-condition]');
        conditionButtons.forEach(button => {
            if (button.classList.contains('red')) {
                creature.activeConditions.push(button.getAttribute('data-condition')!);
            }
        });

        creatures.push(creature);
    });

    SetCookie("creatureConditions", JSON.stringify(creatures), cookieDurationDays);
}

export function LoadCreaturesFromCookies(): Creature[] | null {
    const creatures = GetCookie("creatureConditions");
    return creatures ? JSON.parse(creatures) : null;
}

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

export function LoadPowersFromCookies(): Power[] {
    const powers = GetCookie('powers');
    return powers ? JSON.parse(powers).map((power: Partial<Power>) => ({
        powerId: power.powerId || GenerateGuid(),
        name: power.name || '',
        description: power.description || '',
        extras: power.extras || '',
        flaws: power.flaws || '',
        totalCost: power.totalCost || 0,
        included: power.included || false,
        ranks: power.ranks || 0,
        ppPerRank: power.ppPerRank || 0,
        miscPP: power.miscPP || 0
    })) : [];
}

export function SavePowersToCookies(powers: Power[]): void {
    SetCookie('powers', JSON.stringify(powers), cookieDurationDays);
}

export function RemovePowerFromCookies(powerId: string): void {
    const powers = GetCookie('powers');
    const powersArray: Power[] = powers ? JSON.parse(powers) : [];
    if (powerId !== null) {
        const index = powersArray.findIndex(power => power.powerId === powerId);

        if (index > -1) {
            powersArray.splice(index, 1);
        }

        SetCookie('powers', JSON.stringify(powersArray), cookieDurationDays);
    }
}

export function SaveSelectedAdvantagesToCookies(selectedAdvantages: string[]): void {
    SetCookie('selectedAdvantages', JSON.stringify(selectedAdvantages), cookieDurationDays);
}

export function LoadSelectedAdvantagesFromCookies(): string[] {
    const selectedAdvantages = GetCookie('selectedAdvantages');
    return selectedAdvantages ? JSON.parse(selectedAdvantages) : [];
}


