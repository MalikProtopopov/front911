/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for contacts
 */
export type Contact = {
    readonly id: number;
    /**
     * phone, email, telegram, whatsapp, vk, instagram и т.д.
     */
    contact_type: string;
    value: string;
    label: string;
    icon_name?: string;
    is_active?: boolean;
    display_order?: number;
};

