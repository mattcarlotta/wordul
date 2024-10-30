export type Character = {
    id: string;
    value: string;
};

export type CharacterStatus = "invalid" | "valid" | "correct";

export type ValidatedCharacter = Character & { status: CharacterStatus };

export type Guess = { [k: number]: ValidatedCharacter };

export interface AccessibleElement extends HTMLElement {
    readonly type?: string;
    readonly href?: string;
    readonly disabled?: boolean;
    readonly rel?: string;
}
