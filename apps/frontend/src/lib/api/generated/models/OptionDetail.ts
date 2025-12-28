/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OptionPrice } from './OptionPrice';
/**
 * Detailed serializer for single option with prices
 */
export type OptionDetail = {
    readonly id: number;
    title: string;
    readonly service_id: number;
    readonly service_title: string;
    readonly service_slug: string;
    is_active?: boolean;
    readonly prices: Array<OptionPrice>;
};

