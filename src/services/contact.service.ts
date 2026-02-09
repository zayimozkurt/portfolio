import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { userId } from '@/constants/user-id.constant';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { DeleteContactDto } from '@/types/dto/contact/delete-contact.dto';
import { ReorderContactsDto } from '@/types/dto/contact/reorder-contacts.dto';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { ReadAllContactsResponse } from '@/types/response/contact/read-all-contacts-response';
import { ResponseBase } from '@/types/response/response-base';
import { TransactionClient } from '@/types/transaction-client.type';
import { prisma } from 'prisma/prisma-client';

export const contactService = {
    async create(dto: CreateContactDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(async (tx: TransactionClient)=> {
                const count = await tx.contact.count({ where: { userId } });
                if (count >= MAX_CONTACTS) {
                    return { isSuccess: false, message: `Maximum of ${MAX_CONTACTS} contacts reached` };
                }
        
                await tx.contact.create({
                    data: {
                        userId,
                        label: dto.label,
                        name: dto.name,
                        value: dto.value,
                        order: count,
                    },
                });
            });

            return { isSuccess: true, message: 'contact created' };
        } catch (error) {
            return { isSuccess: false, message: "contact couldn't created" };
        }
    },

    async readAllByUserId(): Promise<ReadAllContactsResponse> {
        try {
            const contacts = await prisma.contact.findMany({ where: { userId }, orderBy: { order: 'asc' } });
            
            if (contacts.length === 0) {
                return { isSuccess: false, message: 'no contact found' };
            }
            return { isSuccess: true, message: 'all contacts read', contacts };
        } catch (error) {
            return { isSuccess: false, message: "contacts couldn't read" };
        }
    },

    async update(dto: UpdateContactDto): Promise<ResponseBase> {
        try {
            const contact = await prisma.contact.findUnique({ where: { id: dto.id } });
            if (!contact) {
                return { isSuccess: false, message: 'contact not found' };
            }

            await prisma.contact.update({
                where: { id: dto.id },
                data: {
                    label: dto.label ?? contact.label,
                    name: dto.name ?? contact.name,
                    value: dto.value ?? contact.value,
                },
            });
            return { isSuccess: true, message: 'contact updated' };
        } catch {
            return { isSuccess: false, message: "contact couldn't be updated" };
        }
    },

    async delete(dto: DeleteContactDto): Promise<ResponseBase> {
        try {
            const contact = await prisma.contact.findUnique({ where: { id: dto.id } });
            if (!contact) {
                return { isSuccess: false, message: 'contact not found' };
            }

            await prisma.contact.delete({ where: { id: dto.id } });
            return { isSuccess: true, message: 'contact deleted' };
        } catch {
            return { isSuccess: false, message: "contact couldn't be deleted" };
        }
    },

    async reorder(dto: ReorderContactsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) =>
                    prisma.contact.update({ where: { id }, data: { order: index } })
                )
            );
            return { isSuccess: true, message: 'contacts reordered' };
        } catch {
            return { isSuccess: false, message: "contacts couldn't be reordered" };
        }
    },
};
