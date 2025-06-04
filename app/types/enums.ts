export interface Country {
    label: string;
    value: string;
}

export const Countries: Country[] = [
    { label: "Argentina", value: "ar" },
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "au" },
    { label: "New Zealand", value: "nz" },
    { label: "South Africa", value: "za" },
    { label: "India", value: "in" },
    { label: "Brazil", value: "br" },
    { label: "Mexico", value: "mx" },
    { label: "Chile", value: "cl" },
    { label: "Colombia", value: "co" },
    { label: "Peru", value: "pe" },
    { label: "Venezuela", value: "ve" }
];

export enum UserSex {
    UNKNOWN = 'UNKNOWN',
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
} 