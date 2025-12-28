/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lead } from '../models/Lead';
import type { LeadRequest } from '../models/LeadRequest';
import type { PatchedLeadRequest } from '../models/PatchedLeadRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebsiteService {
    /**
     * API endpoint для заявок с корпоративного сайта.
     *
     * create:
     * Создание новой заявки. Доступно без аутентификации.
     * Ограничено rate limiting (5 заявок в час с одного IP).
     *
     * list:
     * Список всех заявок. Требует аутентификации администратора.
     *
     * retrieve:
     * Детали заявки. Требует аутентификации администратора.
     * @param id A unique integer value identifying this Заявка.
     * @param requestBody
     * @returns Lead
     * @throws ApiError
     */
    public static websiteLeadsUpdate(
        id: number,
        requestBody: LeadRequest,
    ): CancelablePromise<Lead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/website/leads/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * API endpoint для заявок с корпоративного сайта.
     *
     * create:
     * Создание новой заявки. Доступно без аутентификации.
     * Ограничено rate limiting (5 заявок в час с одного IP).
     *
     * list:
     * Список всех заявок. Требует аутентификации администратора.
     *
     * retrieve:
     * Детали заявки. Требует аутентификации администратора.
     * @param id A unique integer value identifying this Заявка.
     * @param requestBody
     * @returns Lead
     * @throws ApiError
     */
    public static websiteLeadsPartialUpdate(
        id: number,
        requestBody?: PatchedLeadRequest,
    ): CancelablePromise<Lead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/website/leads/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * API endpoint для заявок с корпоративного сайта.
     *
     * create:
     * Создание новой заявки. Доступно без аутентификации.
     * Ограничено rate limiting (5 заявок в час с одного IP).
     *
     * list:
     * Список всех заявок. Требует аутентификации администратора.
     *
     * retrieve:
     * Детали заявки. Требует аутентификации администратора.
     * @param id A unique integer value identifying this Заявка.
     * @returns void
     * @throws ApiError
     */
    public static websiteLeadsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/website/leads/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
