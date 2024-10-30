export interface AccessibleElement extends HTMLElement {
    readonly type?: string;
    readonly href?: string;
    readonly disabled?: boolean;
    readonly rel?: string;
}
