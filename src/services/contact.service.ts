import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { userId } from '@/constants/user-id.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { DeleteContactDto } from '@/types/dto/contact/delete-contact.dto';
import { ReorderContactsDto } from '@/types/dto/contact/reorder-contacts.dto';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { ReadAllContactsResponse } from '@/types/response/contact/read-all-contacts-response';
import { ResponseBase } from '@/types/response/response-base';
import { TransactionClient } from '@/types/transaction-client.type';
import { prisma } from 'prisma/prisma-client';

export class ContactService {
    private constructor() {}

    static async create(dto: CreateContactDto): Promise<ResponseBase> {
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
                        name: dto.label === ContactLabel.CUSTOM ? dto.name : dto.label,
                        value: dto.value,
                        order: count,
                    },
                });
            });

            return { isSuccess: true, message: 'contact created' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async readAllByUserId(): Promise<ReadAllContactsResponse> {
        try {
            const contacts = await prisma.contact.findMany({ where: { userId }, orderBy: { order: 'asc' } });
            
            if (contacts.length === 0) {
                return { isSuccess: false, message: 'no contact found' };
            }
            return { isSuccess: true, message: 'all contacts read', contacts };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async update(dto: UpdateContactDto): Promise<ResponseBase> {
        try {
            const contact = await prisma.contact.findUnique({ where: { id: dto.id } });

            if (!contact) {
                return { isSuccess: false, message: 'contact not found' };
            }

            const label = dto.label ?? contact.label;

            let name = dto.name ?? contact.name;

            if (label !== ContactLabel.CUSTOM) {
                name = label;
            } else if (dto.label === ContactLabel.CUSTOM && !dto.name) {
                name = contact.name; 
            }

            await prisma.contact.update({
                where: { id: dto.id },
                data: {
                    label: label,
                    name: name,
                    value: dto.value ?? contact.value,
                },
            });

            return { isSuccess: true, message: 'contact updated' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async delete(dto: DeleteContactDto): Promise<ResponseBase> {
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
    }

    static async reorder(dto: ReorderContactsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) =>
                    prisma.contact.update({ where: { id }, data: { order: index } })
                )
            );
            return { isSuccess: true, message: 'contacts reordered' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }
}
