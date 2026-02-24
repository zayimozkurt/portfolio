'use client';

import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactLink } from '@/components/contacts/ContactLink';
import { SortableContactItem } from '@/components/contacts/SortableContactItem';
import { contactIconMap } from '@/constants/contact-icon-map.constant';
import { DEFAULT_ADD_FORM } from '@/constants/default-add-form-values.constant';
import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { Contact } from '@/generated/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { userActions } from '@/store/slices/user-slice';
import { ContactFormData } from '@/types/contact-form-data.interface';
import { ResponseBase } from '@/types/response/response-base';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Pencil, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function Contacts({ contacts }: { contacts: Contact[] }) {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.isAdmin);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [addForm, setAddForm] = useState<ContactFormData>(DEFAULT_ADD_FORM);
    const [editForm, setEditForm] = useState<(ContactFormData & { id: string }) | null>(null);
    const [localContacts, setLocalContacts] = useState<Contact[]>(contacts);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        setLocalContacts(contacts);
    }, [contacts]);

    useEffect(() => {
        if (activeId) {
            document.body.style.cursor = 'grabbing';
            return () => {
                document.body.style.cursor = '';
            };
        }
    }, [activeId]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    function updateForm(
        setter: React.Dispatch<React.SetStateAction<any>>,
        field: string,
        value: string,
    ) {
        setter((prev: any) => {
            const next = { ...prev, [field]: value };
            if (field === 'label') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                next.name = value === ContactLabel.CUSTOM ? '' : value;
            }
            return next;
        });
    }

    function startEdit(contact: Contact) {
        setEditForm({ id: contact.id, label: contact.label, name: contact.name, value: contact.value });
    }

    function cancelEdit() {
        setEditForm(null);
    }

    async function createContact() {
        if (!addForm.value.trim()) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label: addForm.label, name: addForm.name, value: addForm.value }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                setAddForm(DEFAULT_ADD_FORM);
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function updateContact() {
        if (!editForm) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/contact/update/${editForm.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label: editForm.label, name: editForm.name, value: editForm.value }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
                cancelEdit();
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteContact(id: string) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        setIsSaving(true);
        try {
            const response: ResponseBase = await (
                await fetch(`/api/admin/contact/delete/${id}`, {
                    method: 'DELETE',
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
            } else {
                alert(response.message);
            }
        } finally {
            setIsSaving(false);
        }
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localContacts.findIndex((c) => c.id === active.id);
        const newIndex = localContacts.findIndex((c) => c.id === over.id);

        const reordered = arrayMove(localContacts, oldIndex, newIndex);
        const previous = localContacts;
        setLocalContacts(reordered);

        try {
            const response: ResponseBase = await (
                await fetch('/api/admin/contact/reorder', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderedIds: reordered.map((c) => c.id) }),
                })
            ).json();

            if (response.isSuccess) {
                await dispatch(userActions.refresh());
            } else {
                setLocalContacts(previous);
                alert(response.message);
            }
        } catch {
            setLocalContacts(previous);
        }
    }

    const activeContact = activeId ? localContacts.find((c) => c.id === activeId) : null;

    return (localContacts.length !== 0 || isAdmin ? (
        <div
            className="fixed left-2 bottom-0 sm:left-8 md:left-12 sm:bottom-0 z-50
                flex flex-col gap-4 justify-center items-center"
        >
            {localContacts.map((contact) => (
                <ContactLink key={contact.id} contact={contact} />
            ))}

            <span className="block w-[2px] h-[150px] rounded-full bg-black"></span>

            {isAdmin && (
                <button
                    onClick={() => setIsPanelOpen((prev) => !prev)}
                    className="text-gray-400 hover:text-black duration-300 cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            )}

            {isAdmin && (
                <div className="relative">

                    {isPanelOpen && (
                        <div className="absolute left-2 bottom-[150px] sm:left-8 md:left-12 w-[350px] bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-sm">Contacts</h3>
                                <button
                                    onClick={() => {
                                        setIsPanelOpen(false);
                                        cancelEdit();
                                    }}
                                    className="text-gray-400 hover:text-black duration-300 cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={localContacts.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                                    <div className="flex flex-col gap-2 mb-3">
                                        {localContacts.map((contact) => (
                                            <div key={contact.id}>
                                                {editForm?.id === contact.id ? (
                                                    <ContactForm
                                                        form={editForm}
                                                        onFieldChange={(field, value) => updateForm(setEditForm, field, value)}
                                                        onSave={updateContact}
                                                        onCancel={cancelEdit}
                                                        saveLabel="Save"
                                                        isSaving={isSaving}
                                                    />
                                                ) : (
                                                    <SortableContactItem
                                                        contact={contact}
                                                        onEdit={() => startEdit(contact)}
                                                        onDelete={() => deleteContact(contact.id)}
                                                        isSaving={isSaving}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </SortableContext>
                                <DragOverlay>
                                    {activeContact ? (
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-lg select-none">
                                            <span className="text-sm shrink-0">
                                                {contactIconMap[activeContact.label] ?? contactIconMap[ContactLabel.CUSTOM]}
                                            </span>
                                            <span className="text-xs font-medium">
                                                {activeContact.name}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>

                            {localContacts.length >= MAX_CONTACTS ? (
                                <p className="text-xs text-gray-400">Maximum of {MAX_CONTACTS} contacts reached</p>
                            ) : (
                                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-500 font-medium">Add Contact</p>
                                    <ContactForm
                                        form={addForm}
                                        onFieldChange={(field, value) => updateForm(setAddForm, field, value)}
                                        onSave={createContact}
                                        onCancel={() => setAddForm(DEFAULT_ADD_FORM)}
                                        saveLabel="Add"
                                        isSaving={isSaving}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
        ) : (
            <></>
        )
    );
}
