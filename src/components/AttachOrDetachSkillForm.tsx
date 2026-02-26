import { Button } from "@/components/Button";
import { SKILL_NAME_CHAR_LIMIT } from "@/constants/skill-name-char-limit.constant";
import { ButtonSize } from "@/enums/button-size.enum";
import { ButtonVariant } from "@/enums/button-variant.enum";
import { SkillAttachableOrDetachableEntity } from "@/enums/skill-attachable-or-detachable-entity.enum";
import { Skill } from "@/generated/client";
import { useAppSelector } from "@/store/hooks";
import { ResponseBase } from "@/types/response/response-base";
import { X } from "lucide-react";
import React from "react";

export default function AttachOrDetachSkillForm(
    {
        entityType,
        entityId,
        attachedSkills,
        attachSkillFormRef,
        isAttachSkillFormHidden,
        setIsAttachSkillFormHidden,
        onRefresh,
    }: {
        entityType: SkillAttachableOrDetachableEntity;
        entityId: string;
        attachedSkills: Skill[];
        attachSkillFormRef: React.RefObject<HTMLDivElement | null>;
        isAttachSkillFormHidden: boolean;
        setIsAttachSkillFormHidden: React.Dispatch<React.SetStateAction<boolean>>;
        onRefresh(): Promise<void>;
    }
) {
    const user = useAppSelector(state => state.user);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const idFieldMap: Record<SkillAttachableOrDetachableEntity, string> = {
        [SkillAttachableOrDetachableEntity.PORTFOLIO_ITEM]: 'portfolioItemId',
        [SkillAttachableOrDetachableEntity.EXPERIENCE]: 'experienceId',
        [SkillAttachableOrDetachableEntity.EDUCATION]: 'educationId',
    } as const;

    function cancel() {
        setIsAttachSkillFormHidden(true);
    }

    async function attach(skillId: string) {
        setIsSaving(true);

        try {
            const dto = {
                [idFieldMap[entityType]]: entityId,
                skillId
            };

            const response = (await (
                await fetch(`/api/admin/relations/${entityType}-skill/attach`, {
                    method: 'POST',
                    body: JSON.stringify(dto),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ).json()) as ResponseBase;

            if (!response.isSuccess) {
                alert(response.message);
            } else {
                await onRefresh();
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function detach(skillId: string) {
        setIsSaving(true);

        try {
            const dto = {
                [idFieldMap[entityType]]: entityId,
                skillId
            };

            const response = (await (
                await fetch(`/api/admin/relations/${entityType}-skill/detach`, {
                    method: 'POST',
                    body: JSON.stringify(dto),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ).json()) as ResponseBase;

            if (!response.isSuccess) {
                alert(response.message);
            } else {
                await onRefresh();
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            ref={attachSkillFormRef}
            className={`
                ${isAttachSkillFormHidden ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100'}
                z-50 absolute bg-surface
                border border-border-muted rounded-xl shadow-lg
            `}
            style={{ width: '300px', height: '400px', padding: '36px' }}
        >
            <button
                onClick={() => setIsAttachSkillFormHidden(true)}
                className="absolute text-text-muted hover:text-text-primary duration-300 cursor-pointer"
                style={{ top: '14px', right: '14px' }}
            >
                <X size={16} />
            </button>
            <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll">
                {user.skills.map(skill =>
                    <div key={skill.id} className=" w-full flex justify-between items-center gap-2">
                        <p className={`${skill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? 'text-xs' : ''} whitespace-nowrap truncate`}>{skill.name}</p>
                        {attachedSkills.map(attachedSkill => attachedSkill.id).includes(skill.id) ?
                            <Button
                                variant={ButtonVariant.SECONDARY}
                                size={ButtonSize.SMALL}
                                onClick={event => detach(skill.id)}
                                disabled={isSaving}
                            >Detach</Button>
                            :
                            <Button
                                size={ButtonSize.SMALL}
                                onClick={event => attach(skill.id)}
                                disabled={isSaving}
                            >Attach</Button>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
