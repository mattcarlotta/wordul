export type Character = {
    id: string;
    value: string;
    status: string;
};

export interface AccessibleElement extends HTMLElement {
    readonly type?: string;
    readonly href?: string;
    readonly disabled?: boolean;
    readonly rel?: string;
}
