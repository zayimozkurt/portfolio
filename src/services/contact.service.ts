import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { userId } from '@/constants/user-id.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { ReorderContactsDto } from '@/types/dto/contact/reorder-contacts.dto';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { ReadAllContactsResponse } from '@/types/response/contact/read-all-contacts.response';
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
                    return { isSuccess: false, message: `Maximum of ${MAX_CONTACTS} contacts reached`, statusCode: 400 };
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

            return { isSuccess: true, message: 'contact created', statusCode: 201 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async readAllByUserId(): Promise<ReadAllContactsResponse> {
        try {
            const contacts = await prisma.contact.findMany({ where: { userId }, orderBy: { order: 'asc' } });

            if (contacts.length === 0) {
                return { isSuccess: false, message: 'no contact found', statusCode: 404 };
            }
            return { isSuccess: true, message: 'all contacts read', contacts, statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async update(id: string, dto: UpdateContactDto): Promise<ResponseBase> {
        const { label, name, ...restOfDto } = dto;

        try {
            const contact = await prisma.contact.findUnique({ where: { id } });

            if (!contact) {
                return { isSuccess: false, message: 'contact not found', statusCode: 404 };
            }

            const newLabel = label ?? contact.label;

            let newName = name ?? contact.name;

            if (newLabel !== ContactLabel.CUSTOM) {
                newName = newLabel;
            }

            await prisma.contact.update({
                where: { id },
                data: {
                    label: newLabel,
                    name: newName,
                    ...restOfDto
                },
            });

            return { isSuccess: true, message: 'contact updated', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }

    static async delete(id: string): Promise<ResponseBase> {
        try {
            const contact = await prisma.contact.findUnique({ where: { id } });
            if (!contact) {
                return { isSuccess: false, message: 'contact not found', statusCode: 404 };
            }

            await prisma.contact.delete({ where: { id } });
            return { isSuccess: true, message: 'contact deleted', statusCode: 200 };
        } catch {
            return { isSuccess: false, message: "contact couldn't be deleted", statusCode: 500 };
        }
    }

    static async reorder(dto: ReorderContactsDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(
                dto.orderedIds.map((id, index) =>
                    prisma.contact.update({ where: { id }, data: { order: index } })
                )
            );
            return { isSuccess: true, message: 'contacts reordered', statusCode: 200 };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error", statusCode: 500 };
        }
    }
}
