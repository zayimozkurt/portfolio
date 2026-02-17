'use client';

import { AboutSection } from '@/components/resume/AboutSection';
import { EducationsSection } from '@/components/resume/EducationsSection';
import { ExperiencesSection } from '@/components/resume/ExperiencesSection';
import { ResumeNavigationSidebar } from '@/components/resume/ResumeNavigationSidebar';
import { SkillsSection } from '@/components/resume/skills/SkillsSection';

export default function Page() {
    return (
        <div className="relative w-full h-full">
            <ResumeNavigationSidebar />
            <div className="w-full h-full flex flex-col items-center gap-16 px-24">
                <AboutSection id="about" />
                <SkillsSection id="skills" />
                <ExperiencesSection id="experiences" />
                <EducationsSection id="educations" />
            </div>
        </div>
    );
}
