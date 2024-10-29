import type { ReactNode, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { AccessibleElement } from "./types";
import { ACCESSIBLE_ELEMENTS, isFocusable } from "./utils/accessbilityHelpers";

export type FocusTrapperProps = {
    children?: ReactNode,
    className?: string,
    focusOnMount?: boolean,
    onEscapePress?: () => void,
    setUpdated: (v: boolean) => void,
    updated: boolean,
}

export default function FocusTrapper({ children, className, onEscapePress, focusOnMount, setUpdated, updated }: FocusTrapperProps) {
    const [tabIndex, setTabIndex] = useState(-1);
    const tabbableItems = useRef<Array<HTMLElement>>([]);
    const lastActiveElement = useRef<HTMLElement | null>(null);
    const focusTrapRef = useRef<HTMLDivElement | null>(null);
    const isMounted = useRef(focusOnMount);

    const handleClick = (event: MouseEvent) => {
        const tabbableItemIndex =
            tabbableItems.current?.findIndex((node) => node.isEqualNode(event.target as HTMLElement)) || 0;

        setTabIndex(tabbableItemIndex >= 0 ? tabbableItemIndex : 0);
    }

    const handleFocusTrap = (event: KeyboardEvent) => {
        const { key, shiftKey } = event;
        const tabPress = key === "Tab";
        const backSpacePress = key === "Backspace";
        const escKey = key === "Escape" || key === "Esc";
        const tabItemsLength = tabbableItems.current.length - 1

        if ((shiftKey && tabPress) || backSpacePress) {
            event.preventDefault();
            if (backSpacePress && tabIndex === 0) return;
            const prevIndex = tabIndex - 1;
            const currentIndex = prevIndex < 0 ? tabItemsLength : prevIndex;
            setTabIndex(currentIndex);
        } else if (tabPress) {
            event.preventDefault();
            const nextIndex = tabIndex + 1;
            const currentIndex = nextIndex > tabItemsLength ? 0 : nextIndex;
            setTabIndex(currentIndex);
        } else if (escKey) {
            event.stopPropagation();
            onEscapePress?.();
        }
    }

    useEffect(() => {
        if (focusTrapRef.current) {
            lastActiveElement.current = document.activeElement as HTMLElement;

            tabbableItems.current = Array.from(
                focusTrapRef.current?.querySelectorAll(ACCESSIBLE_ELEMENTS.join(","))
            ).filter((element) => isFocusable(element as AccessibleElement)) as HTMLElement[];

            if (tabbableItems.current.length) {
                setTabIndex(0);
            }
        }

        return () => {
            lastActiveElement.current?.focus();
        }
    }, []);

    useEffect(() => {
        const tabItemsLength = tabbableItems.current.length - 1
        if (tabIndex === tabItemsLength || !updated) {
            setUpdated(false);
            return;
        };

        const nextIndex = tabIndex + 1;
        const currentIndex = nextIndex > tabItemsLength ? 0 : nextIndex;
        setUpdated(false);
        setTabIndex(currentIndex);
    }, [tabIndex, updated, setUpdated]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        tabbableItems.current?.[tabIndex]?.focus();
    }, [tabIndex]);


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
    )
}
