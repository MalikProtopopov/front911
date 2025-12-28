/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeadStatusEnum } from './LeadStatusEnum';
/**
 * Full serializer for leads (admin view)
 */
export type Lead = {
    readonly id: number;
    name: string;
    phone: string;
    email?: string;
    city?: number | null;
    readonly city_title: string | null;
    service?: number | null;
    readonly service_title: string | null;
    message?: string;
    source_page?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    readonly status: LeadStatusEnum;
    readonly status_display: string;
    readonly created_at: string;
    readonly processed_at: string | null;
};

