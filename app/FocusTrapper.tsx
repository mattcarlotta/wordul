import type { ReactNode, KeyboardEvent, MouseEvent } from "react";
import type { AccessibleElement } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACCESSIBLE_ELEMENTS, isFocusable } from "./utils/accessbilityHelpers";

export type FocusTrapperProps = {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    onEscapePress?: () => void;
    setAddedChar: (v: boolean) => void;
    addedChar: boolean;
    setDeletedChar: (v: boolean) => void;
    deletedChar: boolean;
};

export default function FocusTrapper({
    children,
    className,
    disabled,
    onEscapePress,
    addedChar,
    setAddedChar,
    deletedChar,
    setDeletedChar
}: FocusTrapperProps) {
    const [tabIndex, setTabIndex] = useState(0);
    const tabbableItems = useRef<Array<HTMLElement>>([]);
    const lastActiveElement = useRef<HTMLElement | null>(null);
    const focusTrapRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: MouseEvent) => {
        const tabbableItemIndex =
            tabbableItems.current?.findIndex((node) =>
                node.isEqualNode(event.target as HTMLElement)
            ) || 0;

        setTabIndex(tabbableItemIndex >= 0 ? tabbableItemIndex : 0);
    };

    const handlePrevFocus = useCallback(() => {
        const tabItemsLength = tabbableItems.current.length - 1;
        const prevIndex = tabIndex - 1;
        const currentIndex = prevIndex < 0 ? tabItemsLength : prevIndex;
        setTabIndex(currentIndex);
    }, [tabIndex]);

    const handleNextFocus = useCallback(() => {
        const tabItemsLength = tabbableItems.current.length - 1;
        const nextIndex = tabIndex + 1;
        const currentIndex = nextIndex > tabItemsLength ? 0 : nextIndex;
        setTabIndex(currentIndex);
    }, [tabIndex]);

    const handleFocusTrap = (event: KeyboardEvent) => {
        if (disabled) return;

        const { key, shiftKey } = event;
        const tabPress = key === "Tab";
        const escKey = key === "Escape" || key === "Esc";

        if (shiftKey && tabPress) {
            event.preventDefault();
            handlePrevFocus();
        } else if (tabPress) {
            event.preventDefault();
            handleNextFocus();
        } else if (escKey) {
            event.stopPropagation();
            onEscapePress?.();
        }
    };

    useEffect(() => {
        if (disabled || !focusTrapRef.current) return;
        lastActiveElement.current = document.activeElement as HTMLElement;

        tabbableItems.current = Array.from(
            focusTrapRef.current?.querySelectorAll(ACCESSIBLE_ELEMENTS.join(","))
        ).filter((element) => isFocusable(element as AccessibleElement)) as HTMLElement[];

        if (tabbableItems.current.length) {
            setTabIndex(0);
        }

        return () => {
            lastActiveElement.current?.focus();
        };
    }, [disabled]);

    useEffect(() => {
        const tabItemsLength = tabbableItems.current.length - 1;
        if (tabIndex === tabItemsLength || !addedChar) {
            setAddedChar(false);
            return;
        }

        setAddedChar(false);
        handleNextFocus();
    }, [tabIndex, addedChar, setAddedChar, handleNextFocus]);

    useEffect(() => {
        if (tabIndex === 0 || !deletedChar) {
            setDeletedChar(false);
            return;
        }

        setDeletedChar(false);
        handlePrevFocus();
    }, [tabIndex, deletedChar, setDeletedChar, handlePrevFocus]);

    useEffect(() => {
        if (disabled) return;

        tabbableItems.current?.[tabIndex]?.focus();
    }, [disabled, tabIndex]);

    return (
        <div
            role="presentation"
            className={className}
            ref={focusTrapRef}
            onKeyDown={handleFocusTrap}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}
