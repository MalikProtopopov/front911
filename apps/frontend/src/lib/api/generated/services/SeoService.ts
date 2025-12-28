/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedSeoMetaList } from '../models/PaginatedSeoMetaList';
import type { SeoMeta } from '../models/SeoMeta';
import type { SeoMetaPublic } from '../models/SeoMetaPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SeoService {
    /**
     * Список SEO метаданных
     *
     * Получить список SEO метаданных для различных страниц сайта.
     *
     * **Возвращает только активные SEO записи** (is_active=True).
     *
     * **Фильтрация:**
     * - `page_type` - тип страницы (home, city, service, city_service, about, contacts)
     * - `slug` - полный slug страницы (например: `/moskva/shinomontazh/`)
     *
     * **Типы страниц:**
     * - `home` - главная страница (/)
     * - `city` - страница города (/moskva/)
     * - `service` - страница услуги (/shinomontazh/)
     * - `city_service` - услуга в городе (/moskva/shinomontazh/)
     * - `about` - о компании
     * - `contacts` - контакты
     *
     * **Включает:**
     * - Title, Description, Keywords для SEO
     * - Open Graph теги для соцсетей
     * - Schema.org разметка для поисковых систем
     *
     * @param fullSlug Полный slug страницы (например: /moskva/shinomontazh/)
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param ordering Which field to use when ordering the results.
     * @param pageType Тип страницы
     * @returns PaginatedSeoMetaList
     * @throws ApiError
     */
    public static websiteSeoMetaList(
        fullSlug?: string,
        limit?: number,
        offset?: number,
        ordering?: string,
        pageType?: 'about' | 'city' | 'city_service' | 'contacts' | 'home' | 'service',
    ): CancelablePromise<PaginatedSeoMetaList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/seo-meta/',
            query: {
                'full_slug': fullSlug,
                'limit': limit,
                'offset': offset,
                'ordering': ordering,
                'page_type': pageType,
            },
        });
    }
    /**
     * Детали SEO метаданных
     * Получить детальные SEO метаданные. **Возвращает 404 для неактивных записей.**
     * @param id A unique integer value identifying this SEO метаданные.
     * @returns SeoMeta
     * @throws ApiError
     */
    public static websiteSeoMetaRetrieve(
        id: number,
    ): CancelablePromise<SeoMeta> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/seo-meta/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * SEO метаданные по slug
     *
     * Получить SEO метаданные для конкретной страницы по её slug.
     *
     * **Обязательные параметры:**
     * - `slug` - полный slug страницы
     *
     * **Автоматическая нормализация slug:**
     * - Добавляет `/` в начале и конце если отсутствует
     * - Пример: `moskva/shinomontazh` → `/moskva/shinomontazh/`
     *
     * **Примеры запросов:**
     * - `/api/website/seo-meta/by-slug/?slug=/` - SEO главной страницы
     * - `/api/website/seo-meta/by-slug/?slug=/moskva/` - SEO страницы Москвы
     * - `/api/website/seo-meta/by-slug/?slug=/moskva/shinomontazh/` - SEO услуги в городе
     *
     * **Возвращает:**
     * - 200 - SEO метаданные найдены
     * - 400 - Параметр slug не указан
     * - 404 - SEO метаданные не найдены или страница неактивна
     *
     * @param slug Полный slug страницы (обязательный)
     * @returns SeoMetaPublic
     * @throws ApiError
     */
    public static websiteSeoMetaBySlugRetrieve(
        slug: string,
    ): CancelablePromise<SeoMetaPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/seo-meta/by-slug/',
            query: {
                'slug': slug,
            },
        });
    }
}
