'use client';

import { useEffect, useState } from 'react';

/**
 * The sketchy look used to come from roughjs redrawing a canvas 33 times a
 * second. Two slightly-offset SVG arcs give the same hand-drawn double stroke
 * for free, and `currentColor` follows the theme without reading the DOM.
 */
export default function LoadingSpinner({ isHidden, message }: { isHidden?: boolean; message?: string }) {
    const [dotCount, setDotCount] = useState<number>(1);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setDotCount((prev) => (prev % 3) + 1);
        }, 1000);
        return () => clearInterval(textInterval);
    }, []);

    return (
        <div
            className={`${isHidden ? 'hidden' : ''} w-full h-full
            flex justify-center items-start`}
        >
            <div
                className="w-full h-[50%]
                flex flex-col justify-center items-center"
            >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="animate-spin" aria-hidden="true">
                    <path
                        d="M 40.2 24.6 A 15 15 0 1 1 24.8 10.3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 39.5 25.5 A 14.4 15.7 0 1 1 25.4 9.6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.75"
                    />
                </svg>
                <p>{message ? message : `Loading${'.'.repeat(dotCount)}`}</p>
            </div>
        </div>
    );
}
