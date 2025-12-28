/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppTypeEnum } from './AppTypeEnum';
import type { PlatformEnum } from './PlatformEnum';
/**
 * Serializer for app store links
 */
export type AppLink = {
    readonly id: number;
    platform: PlatformEnum;
    readonly platform_display: string;
    app_type: AppTypeEnum;
    readonly app_type_display: string;
    store_url: string;
    qr_code_url?: string;
    version?: string;
    is_active?: boolean;
};

