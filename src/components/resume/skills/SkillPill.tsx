import { SKILL_NAME_CHAR_LIMIT } from "@/constants/skill-name-char-limit.constant";
import { Skill } from "@/generated/client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SkillPill({ skill }: { skill: Skill }) {

    return (
            <Link
                key={skill.id}
                href={`/skill/${skill.id}`}
                className="group flex justify-center items"
            >
                <span
                    className={`
                        max-w-[220px] h-auto px-2 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap
                        bg-surface-tertiary text-text-secondary font-medium
                        text-xs ${skill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? '' : 'sm:text-sm'}
                        border border-border-muted hover:bg-border-muted hover:border-brand-accent hover:shadow-md
                        transition-all duration-100
                        cursor-pointer
                        flex justify-center items-center gap-1.5
                    `}
                >
                    <p className='max-w-[125px] sm:max-w-[175px] truncate decoration-border-muted underline-offset-2 group-hover:decoration-brand-accent transition-all duration-100'>{skill.name}</p>
                    <ArrowUpRight size={12} className="text-brand-accent opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300" />
                </span>
            </Link>
    );
}
