'use client';

import { AboutSection } from '@/components/resume/AboutSection';
import { EducationsSection } from '@/components/resume/educations/EducationsSection';
import { ExperiencesSection } from '@/components/resume/experiences/ExperiencesSection';
import { ResumeNavigationSidebar } from '@/components/resume/ResumeNavigationSidebar';
import { SkillsSection } from '@/components/resume/skills/SkillsSection';
import { ADMIN_NAVBAR_HEIGHT } from '@/constants/navbar-height/admin-navbar-height.constant';
import { VISITOR_NAVBAR_HEIGHT } from '@/constants/navbar-height/visitor-navbar-height.constant';
import { ResumeNavigationItemId } from '@/enums/resume-navigation-item-id.enum';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function Page() {
    const isAdmin = useAppSelector((state) => state.isAdmin);
    const navbarHeight = isAdmin ? ADMIN_NAVBAR_HEIGHT : VISITOR_NAVBAR_HEIGHT;

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }, [navbarHeight]);

    return (
        <div className="relative w-full h-full">
            <ResumeNavigationSidebar />

            <div className="w-full h-auto flex flex-col items-center gap-16 px-24 pb-32">
                <AboutSection id={ResumeNavigationItemId.ABOUT} />

                <SkillsSection id={ResumeNavigationItemId.SKILLS} />

                <ExperiencesSection id={ResumeNavigationItemId.EXPERIENCE} />
                
                <EducationsSection id={ResumeNavigationItemId.EDUCATION} />
            </div>
        </div>
    );
}
