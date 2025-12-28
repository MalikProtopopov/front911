/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creating leads
 */
export type LeadCreateRequest = {
    name: string;
    phone: string;
    email?: string;
    city?: number | null;
    service?: number | null;
    message?: string;
    source_page?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
};

