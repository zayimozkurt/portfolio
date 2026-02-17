'use client';

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { SKILL_NAME_CHAR_LIMIT } from "@/constants/skill-name-char-limit.constant";
import { ButtonVariant } from "@/enums/button-variants.enum";
import { useAppDispatch } from "@/store/hooks";
import { userActions } from "@/store/slices/user-slice";
import { ResponseBase } from "@/types/response/response-base";
import React from "react";

export function CreateSkillForm({ isSaving, setIsSaving }: 
    {
        isSaving: boolean;
        setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
    }
) {
    const dispatch = useAppDispatch();
    const [newSkillName, setNewSkillName] = React.useState<string>('');

    function onChange(element: HTMLInputElement) {
        const value = element.value;

        if (value.length <= SKILL_NAME_CHAR_LIMIT) {
            setNewSkillName(element.value);
        }
    }

    async function addSkill() {
        const trimmed = newSkillName.trim();
        if (!trimmed || isSaving) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/skill/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: trimmed }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setNewSkillName('');
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex justify-center gap-2 mt-4">
            <div className="w-[300px] relative">
                <Input
                    name="newSkill"
                    value={newSkillName}
                    onChange={(e) => onChange(e.currentTarget)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                        }
                    }}
                    placeholder="New skill..."
                    className="pr-12"
                />

                <p className={`${newSkillName.length >= SKILL_NAME_CHAR_LIMIT ? 'text-red-500' : ''} text-xs absolute bottom-1 right-2`}>{newSkillName.length}/{SKILL_NAME_CHAR_LIMIT}</p>
            </div>

            <Button
                onClick={addSkill}
                variant={ButtonVariant.PRIMARY}
                disabled={isSaving || !newSkillName.trim()}
            >
                Add
            </Button>
        </div>
    );
}
