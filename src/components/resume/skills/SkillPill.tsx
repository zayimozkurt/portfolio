import { SKILL_NAME_CHAR_LIMIT } from "@/constants/skill-name-char-limit.constant";
import { Skill } from "@/generated/client";
import Link from "next/link";

export function SkillPill({ skill }: { skill: Skill }) {

    return (
            <Link 
                key={skill.id}
                href={`/skill/${skill.id}`}
                className="w-full flex justify-center items"
            >
                <span 
                    className={`
                        max-w-[220px] h-auto px-2 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap
                        bg-gray-100 text-gray-700 font-medium
                        text-xs ${skill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? '' : 'sm:text-sm'}
                        border border-gray-200 hover:bg-gray-200 transition-colors 
                        flex justify-center items-center gap-1.5
                    `}
                >
                    <p className='max-w-[125px] sm:max-w-[175px] truncate'>{skill.name}</p>
                </span>
            </Link>
    );
}
