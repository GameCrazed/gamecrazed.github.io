export interface Creature {
    id: string;
    name: string;
    injuries: string;
    activeConditions: string[];
}

export interface Power {
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

export interface Condition {
    ConditionName: string;
    Description: string;
    DescriptionSummary?: string;
    BasicConditions?: string;
}

export interface Advantage {
    AdvantageName: string;
    Description: string;
    Selected: boolean;
}

export interface Tooltip {
    TooltipId: string;
    TooltipTag: string;
    TooltipDescription: string;
}

export interface Measurement {
    Rank: string;
    Mass: string;
    Time: string;
    Distance: string;
    Volume: string;
}

export interface ThrowingMeasurement {
    Rank: number;
    Distance: string;
}