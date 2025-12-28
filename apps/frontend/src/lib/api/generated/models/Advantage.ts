/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TargetAudienceEnum } from './TargetAudienceEnum';
/**
 * Serializer for advantages
 */
export type Advantage = {
    readonly id: number;
    target_audience: TargetAudienceEnum;
    readonly target_audience_display: string;
    title: string;
    description: string;
    icon_name: string;
    display_order?: number;
    is_active?: boolean;
};

