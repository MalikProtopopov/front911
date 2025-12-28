/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for metrics
 */
export type Metric = {
    readonly id: number;
    metric_key: string;
    value: string;
    display_label: string;
    description?: string;
    /**
     * platform, partner, client, city, service
     */
    metric_type: string;
    is_visible_on_site?: boolean;
    icon_name?: string;
    display_order?: number;
    readonly last_updated: string;
};

