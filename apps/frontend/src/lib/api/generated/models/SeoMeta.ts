/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for SEO metadata
 */
export type SeoMeta = {
    readonly id: number;
    /**
     * home, city, service, city_service, about, contacts
     */
    page_type: string;
    readonly city_slug: string | null;
    readonly city_title: string | null;
    readonly service_slug: string | null;
    readonly service_title: string | null;
    title: string;
    meta_description: string;
    meta_keywords?: string;
    h1_title: string;
    full_slug: string;
    og_title?: string;
    og_description?: string;
    og_image_url?: string;
    schema_json?: any;
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};

