'use client';

import { RESUME_NAVIGATION_ITEMS } from '@/constants/resume-navigation-items.constant';
import { ResumeNavigationItemId } from '@/enums/resume-navigation-item-id.enum';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

export function ResumeNavigationSidebar() {
    const [activeId, setActiveId] = useState<string>('about');

    const user = useAppSelector((state) => state.user);
    const isAdmin = useAppSelector((state) => state.isAdmin);

    useEffect(() => {
        let rafId = 0;

        function onScroll() {
            cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                let current = RESUME_NAVIGATION_ITEMS[0].id;

                for (const item of RESUME_NAVIGATION_ITEMS) {
                    const element = document.getElementById(item.id);

                    if (element && element.getBoundingClientRect().top <= 100) {
                        current = item.id;
                    }
                }

                setActiveId(current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <nav className="hidden xl:flex fixed left-32 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
            {RESUME_NAVIGATION_ITEMS.map((item) => {
                const itemId = item.id;

                if (itemId === ResumeNavigationItemId.EXPERIENCE && user.experiences.length === 0 && !isAdmin) {
                    return;
                } else if (itemId === ResumeNavigationItemId.EDUCATION && user.educations.length === 0 && !isAdmin) {
                    return;
                }

                return (
                    <a
                        key={item.id}
                        href={`/resume#${item.id}`}
                        className={`text-sm transition-colors duration-200 ${
                            activeId === item.id ? 'text-text-primary font-semibold' : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
