/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CityContent } from './CityContent';
/**
 * Detailed serializer for single city
 */
export type CityDetail = {
    readonly id: number;
    title: string;
    slug: string;
    is_active?: boolean;
    display_order?: number;
    readonly content: CityContent;
    readonly services_count: string;
    readonly created_at: string;
    readonly updated_at: string;
};

