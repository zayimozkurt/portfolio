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
                        bg-gray-100 text-gray-700 font-medium
                        text-xs ${skill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? '' : 'sm:text-sm'}
                        border border-gray-200 hover:bg-gray-200 hover:border-[#00316E] hover:shadow-md
                        transition-all duration-100
                        cursor-pointer
                        flex justify-center items-center gap-1.5
                    `}
                >
                    <p className='max-w-[125px] sm:max-w-[175px] truncate decoration-gray-300 underline-offset-2 group-hover:decoration-[#00316E] transition-all duration-100'>{skill.name}</p>
                    <ArrowUpRight size={12} className="text-[#00316E] opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300" />
                </span>
            </Link>
    );
}
