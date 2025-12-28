/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Advantage } from '../models/Advantage';
import type { AppLink } from '../models/AppLink';
import type { CityDetail } from '../models/CityDetail';
import type { Contact } from '../models/Contact';
import type { Lead } from '../models/Lead';
import type { LeadCreateRequest } from '../models/LeadCreateRequest';
import type { Metric } from '../models/Metric';
import type { OptionDetail } from '../models/OptionDetail';
import type { PaginatedAdvantageList } from '../models/PaginatedAdvantageList';
import type { PaginatedAppLinkList } from '../models/PaginatedAppLinkList';
import type { PaginatedCityListList } from '../models/PaginatedCityListList';
import type { PaginatedContactList } from '../models/PaginatedContactList';
import type { PaginatedLeadList } from '../models/PaginatedLeadList';
import type { PaginatedMetricList } from '../models/PaginatedMetricList';
import type { PaginatedOptionListList } from '../models/PaginatedOptionListList';
import type { PaginatedServiceListList } from '../models/PaginatedServiceListList';
import type { PaginatedTechnicCategoryList } from '../models/PaginatedTechnicCategoryList';
import type { ServiceDetail } from '../models/ServiceDetail';
import type { TechnicCategory } from '../models/TechnicCategory';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * Список преимуществ
     *
     * Получить список преимуществ платформы.
     *
     * **Возвращает только активные преимущества** (is_active=True).
     *
     * Поддерживает фильтрацию по целевой аудитории:
     * - `client` - преимущества для клиентов
     * - `partner` - преимущества для партнеров
     * - `both` - общие преимущества для всех
     *
     * Результаты отсортированы по display_order.
     *
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param ordering Which field to use when ordering the results.
     * @param targetAudience Целевая аудитория: client, partner, both
     * @returns PaginatedAdvantageList
     * @throws ApiError
     */
    public static websiteAdvantagesList(
        limit?: number,
        offset?: number,
        ordering?: string,
        targetAudience?: 'both' | 'client' | 'partner',
    ): CancelablePromise<PaginatedAdvantageList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/advantages/',
            query: {
                'limit': limit,
                'offset': offset,
                'ordering': ordering,
                'target_audience': targetAudience,
            },
        });
    }
    /**
     * Детали преимущества
     * Получить детальную информацию о конкретном преимуществе. **Возвращает 404 для неактивных преимуществ.**
     * @param id A unique integer value identifying this Преимущество.
     * @returns Advantage
     * @throws ApiError
     */
    public static websiteAdvantagesRetrieve(
        id: number,
    ): CancelablePromise<Advantage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/advantages/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Ссылки на приложения
     *
     * Получить ссылки на мобильные приложения.
     *
     * **Возвращает только активные ссылки** (is_active=True).
     *
     * **Платформы:**
     * - `ios` - App Store (iOS)
     * - `android` - Google Play (Android)
     *
     * **Типы приложений:**
     * - `client` - приложение для клиентов
     * - `partner` - приложение для партнеров
     *
     * **Пример использования:**
     * - `/api/website/app-links/?platform=ios&app_type=client` - ссылка на iOS приложение для клиентов
     *
     * @param appType Тип приложения
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param platform Платформа
     * @returns PaginatedAppLinkList
     * @throws ApiError
     */
    public static websiteAppLinksList(
        appType?: 'client' | 'partner',
        limit?: number,
        offset?: number,
        platform?: 'android' | 'ios',
    ): CancelablePromise<PaginatedAppLinkList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/app-links/',
            query: {
                'app_type': appType,
                'limit': limit,
                'offset': offset,
                'platform': platform,
            },
        });
    }
    /**
     * Детали ссылки
     * Получить детальную информацию о ссылке на приложение. **Возвращает 404 для неактивных ссылок.**
     * @param id A unique integer value identifying this Ссылка на приложение.
     * @returns AppLink
     * @throws ApiError
     */
    public static websiteAppLinksRetrieve(
        id: number,
    ): CancelablePromise<AppLink> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/app-links/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Список городов
     *
     * Получить список всех городов присутствия.
     *
     * **Возвращает только активные города** (is_active=True).
     *
     * **Функции:**
     * - Поиск по названию города (параметр `search`)
     * - Сортировка по `display_order` или `title`
     * - Пагинация результатов
     *
     * **Информация о городе:**
     * - Название и slug
     * - Координаты (широта, долгота)
     * - Порядок отображения
     * - Краткое описание (если есть)
     *
     * Результаты отсортированы по display_order, затем по названию.
     *
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param ordering Which field to use when ordering the results.
     * @param search Поиск по названию города
     * @returns PaginatedCityListList
     * @throws ApiError
     */
    public static websiteCitiesList(
        limit?: number,
        offset?: number,
        ordering?: string,
        search?: string,
    ): CancelablePromise<PaginatedCityListList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/cities/',
            query: {
                'limit': limit,
                'offset': offset,
                'ordering': ordering,
                'search': search,
            },
        });
    }
    /**
     * Полная информация об услуге в городе
     *
     * Получить всю необходимую информацию для отображения страницы услуги в конкретном городе.
     *
     * **Возвращает 404 если:**
     * - Город не найден или неактивен (is_active=False)
     * - Услуга не найдена или неактивна (is_active=False)
     *
     * **Что возвращается:**
     *
     * 1. **city** - информация о городе:
     * - Название, slug, координаты
     *
     * 2. **service** - информация об услуге:
     * - Название, slug, описание, иконка
     *
     * 3. **options** - опции с ценами для этого города:
     * - Только активные опции (is_active=True)
     * - Только опции с установленными ценами в данном городе
     * - Каждая опция включает массив цен по категориям техники
     *
     * 4. **content** - HTML контент для страницы:
     * - Приоритет отдается контенту специфичному для города
     * - Если специфичного нет, возвращается общий контент услуги
     *
     * 5. **seo** - SEO метаданные:
     * - Title, Description, Keywords
     * - Open Graph теги
     * - Schema.org разметка
     * - Если не найдены, возвращается null
     *
     * **Примеры URL:**
     * - `/api/website/cities/moskva/services/shinomontazh/` - шиномонтаж в Москве
     * - `/api/website/cities/sankt-peterburg/services/evakuator/` - эвакуатор в СПб
     *
     * @param citySlug Slug города (например: moskva, sankt-peterburg)
     * @param serviceSlug Slug услуги (например: shinomontazh, evakuator)
     * @returns any
     * @throws ApiError
     */
    public static websiteCitiesServicesRetrieve(
        citySlug: string,
        serviceSlug: string,
    ): CancelablePromise<{
        /**
         * Информация о городе
         */
        city?: Record<string, any>;
        /**
         * Информация об услуге
         */
        service?: Record<string, any>;
        /**
         * Массив опций с ценами для данного города
         */
        options?: any[];
        /**
         * HTML контент страницы (может быть null)
         */
        content?: Record<string, any> | null;
        /**
         * SEO метаданные (может быть null)
         */
        seo?: Record<string, any> | null;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/cities/{city_slug}/services/{service_slug}/',
            path: {
                'city_slug': citySlug,
                'service_slug': serviceSlug,
            },
        });
    }
    /**
     * Детальная информация о городе
     *
     * Получить полную информацию о городе по slug.
     *
     * **Возвращает 404 для неактивных городов.**
     *
     * **Включает:**
     * - Базовая информация (название, slug, координаты)
     * - Контент для страницы города (если есть)
     * - SEO метаданные (если настроены)
     *
     * **Пример slug:** `moskva`, `sankt-peterburg`, `ekaterinburg`
     *
     * @param slug
     * @returns CityDetail
     * @throws ApiError
     */
    public static websiteCitiesRetrieve(
        slug: string,
    ): CancelablePromise<CityDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/cities/{slug}/',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Услуги в городе
     *
     * Получить список всех услуг доступных в конкретном городе.
     *
     * **Возвращает только активные услуги** (is_active=True).
     *
     * **Примеры услуг:**
     * - Шиномонтаж
     * - Эвакуатор
     * - Техническая помощь на дороге
     * - Заправка топливом
     * - Вскрытие автомобиля
     *
     * Для каждой услуги возвращается базовая информация и краткое описание.
     *
     * @param slug
     * @returns CityDetail
     * @throws ApiError
     */
    public static websiteCitiesServicesRetrieve2(
        slug: string,
    ): CancelablePromise<CityDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/cities/{slug}/services/',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * Список контактов
     *
     * Получить список контактной информации.
     *
     * **Возвращает только активные контакты** (is_active=True).
     *
     * **Типы контактов:**
     * - `phone` - номера телефонов
     * - `email` - электронная почта
     * - `telegram` - Telegram
     * - `whatsapp` - WhatsApp
     * - `vk` - ВКонтакте
     * - `instagram` - Instagram
     * - `facebook` - Facebook
     *
     * Результаты отсортированы по display_order.
     *
     * @param contactType Тип контакта
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param ordering Which field to use when ordering the results.
     * @returns PaginatedContactList
     * @throws ApiError
     */
    public static websiteContactsList(
        contactType?: 'email' | 'facebook' | 'instagram' | 'phone' | 'telegram' | 'vk' | 'whatsapp',
        limit?: number,
        offset?: number,
        ordering?: string,
    ): CancelablePromise<PaginatedContactList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/contacts/',
            query: {
                'contact_type': contactType,
                'limit': limit,
                'offset': offset,
                'ordering': ordering,
            },
        });
    }
    /**
     * Детали контакта
     * Получить детальную информацию о контакте. **Возвращает 404 для неактивных контактов.**
     * @param id A unique integer value identifying this Контакт.
     * @returns Contact
     * @throws ApiError
     */
    public static websiteContactsRetrieve(
        id: number,
    ): CancelablePromise<Contact> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/contacts/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Список заявок (только для администраторов)
     *
     * Получить список всех заявок с сайта.
     *
     * **Требует аутентификации администратора.**
     *
     * **Фильтрация:**
     * - `status` - статус заявки (new, processing, completed, cancelled)
     * - `city` - ID города
     * - `service` - ID услуги
     *
     * **Сортировка:**
     * По умолчанию сортируется по дате создания (новые сверху).
     *
     * @param city
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @param service
     * @param status * `new` - Новая
     * * `processing` - В обработке
     * * `converted` - Конвертирована
     * * `rejected` - Отклонена
     * @returns PaginatedLeadList
     * @throws ApiError
     */
    public static websiteLeadsList(
        city?: number,
        limit?: number,
        offset?: number,
        service?: number,
        status?: 'converted' | 'new' | 'processing' | 'rejected',
    ): CancelablePromise<PaginatedLeadList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/website/leads/',
            query: {
                'city': city,
                'limit': limit,
                'offset': offset,
                'service': service,
                'status': status,
            },
        });
    }
    /**
     * Создать заявку с сайта
     *
     * Отправить заявку (лид) с корпоративного сайта.
     *
     * **Обязательные поля:**
     * - `name` - имя клиента (2-100 символов)
     * - `phone` - номер телефона (10-20 символов, поддерживает форматы: +7..., 8..., и т.д.)
     *
     * **Опциональные поля:**
     * - `email` - электронная почта
     * - `city` - ID города
     * - `service` - ID услуги
     * - `message` - сообщение от клиента
     * - `source_page` - URL страницы, с которой отправлена заявка
     * - `utm_source`, `utm_medium`, `utm_campaign` - UTM метки для аналитики
     *
     * **Статус заявки:**
     * По умолчанию создается со статусом `new` (новая).
     *
     * **Rate Limiting:**
     * Ограничено 5 заявками в час с одного IP адреса (планируется).
     *
     * **Примеры использования:**
     * ```json
     * {
         * "name": "Иван Иванов",
         * "phone": "+79991234567",
         * "email": "ivan@example.com",
         * "city": 1,
         * "service": 2,
         * "message": "Нужен шиномонтаж завтра утром",
         * "source_page": "/moskva/shinomontazh/",
         * "utm_source": "google",
         * "utm_medium": "cpc"
         * }
         * ```
         *
         * @param requestBody
         * @returns Lead
         * @throws ApiError
         */
        public static websiteLeadsCreate(
            requestBody: LeadCreateRequest,
        ): CancelablePromise<Lead> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/website/leads/',
                body: requestBody,
                mediaType: 'application/json',
            });
        }
        /**
         * Детали заявки (только для администраторов)
         * Получить детальную информацию о конкретной заявке. Требует аутентификации.
         * @param id A unique integer value identifying this Заявка.
         * @returns Lead
         * @throws ApiError
         */
        public static websiteLeadsRetrieve(
            id: number,
        ): CancelablePromise<Lead> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/leads/{id}/',
                path: {
                    'id': id,
                },
            });
        }
        /**
         * Список метрик
         *
         * Получить список бизнес-метрик платформы.
         *
         * **Фильтрация:**
         * - `metric_type` - тип метрики (platform, partner, client)
         * - `visible_only=true` - только метрики видимые на публичном сайте (is_visible_on_site=True)
         * - `is_visible_on_site` - фильтр по видимости (true/false)
         *
         * **Примеры метрик:**
         * - Количество городов присутствия
         * - Количество партнеров
         * - Средний рейтинг платформы
         * - Количество завершенных заказов
         *
         * Результаты отсортированы по display_order.
         *
         * @param isVisibleOnSite Фильтр по видимости на сайте
         * @param limit Number of results to return per page.
         * @param metricType Тип метрики
         * @param offset The initial index from which to return the results.
         * @param ordering Which field to use when ordering the results.
         * @param visibleOnly Только метрики видимые на сайте (is_visible_on_site=True)
         * @returns PaginatedMetricList
         * @throws ApiError
         */
        public static websiteMetricsList(
            isVisibleOnSite?: boolean,
            limit?: number,
            metricType?: 'client' | 'partner' | 'platform',
            offset?: number,
            ordering?: string,
            visibleOnly?: boolean,
        ): CancelablePromise<PaginatedMetricList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/metrics/',
                query: {
                    'is_visible_on_site': isVisibleOnSite,
                    'limit': limit,
                    'metric_type': metricType,
                    'offset': offset,
                    'ordering': ordering,
                    'visible_only': visibleOnly,
                },
            });
        }
        /**
         * Детали метрики
         * Получить детальную информацию о конкретной метрике
         * @param id A unique integer value identifying this Метрика.
         * @returns Metric
         * @throws ApiError
         */
        public static websiteMetricsRetrieve(
            id: number,
        ): CancelablePromise<Metric> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/metrics/{id}/',
                path: {
                    'id': id,
                },
            });
        }
        /**
         * Список опций
         *
         * Получить список всех опций услуг.
         *
         * **Возвращает только активные опции** (is_active=True).
         *
         * **Фильтрация:**
         * - По услуге (`service` - ID услуги)
         * - По slug услуги (`service__slug` - например, `shinomontazh`)
         *
         * **Примеры опций:**
         * - Радиус колеса для шиномонтажа (R13-R22)
         * - Тип автомобиля (легковой, кроссовер, внедорожник)
         * - Расстояние эвакуации (до 10 км, 10-50 км, и т.д.)
         * - Тип техники для перевозки
         *
         * **Пример запроса:**
         * - `/api/website/options/?service__slug=shinomontazh` - опции для шиномонтажа
         *
         * @param limit Number of results to return per page.
         * @param offset The initial index from which to return the results.
         * @param ordering Which field to use when ordering the results.
         * @param search Поиск по названию опции
         * @param service ID услуги для фильтрации опций
         * @param serviceSlug Slug услуги для фильтрации опций
         * @returns PaginatedOptionListList
         * @throws ApiError
         */
        public static websiteOptionsList(
            limit?: number,
            offset?: number,
            ordering?: string,
            search?: string,
            service?: number,
            serviceSlug?: string,
        ): CancelablePromise<PaginatedOptionListList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/options/',
                query: {
                    'limit': limit,
                    'offset': offset,
                    'ordering': ordering,
                    'search': search,
                    'service': service,
                    'service__slug': serviceSlug,
                },
            });
        }
        /**
         * Детальная информация об опции
         *
         * Получить полную информацию об опции с ценами по всем городам.
         *
         * **Возвращает 404 для неактивных опций.**
         *
         * **Включает:**
         * - Название опции
         * - Описание
         * - Связанная услуга
         * - Цены по всем городам (где доступна)
         * - Категории техники (если применимо)
         *
         * @param id A unique integer value identifying this Опция.
         * @returns OptionDetail
         * @throws ApiError
         */
        public static websiteOptionsRetrieve(
            id: number,
        ): CancelablePromise<OptionDetail> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/options/{id}/',
                path: {
                    'id': id,
                },
            });
        }
        /**
         * Опции по городу
         *
         * Получить опции с ценами для конкретного города.
         *
         * **Обязательные параметры:**
         * - `city` - slug города (например, `moskva`)
         *
         * **Опциональные параметры:**
         * - `service` - slug услуги для фильтрации (например, `shinomontazh`)
         *
         * **Возвращает только активные опции с ценами в указанном городе.**
         *
         * **Примеры запросов:**
         * - `/api/website/options/by-city/?city=moskva` - все опции в Москве
         * - `/api/website/options/by-city/?city=moskva&service=shinomontazh` - опции шиномонтажа в Москве
         *
         * **Цены:**
         * Для каждой опции возвращается массив цен по категориям техники (если применимо).
         * Если опция имеет фиксированную цену, возвращается одна цена без категории.
         *
         * @param city Slug города (обязательный)
         * @param service Slug услуги для фильтрации (опционально)
         * @returns OptionDetail
         * @throws ApiError
         */
        public static websiteOptionsByCityRetrieve(
            city: string,
            service?: string,
        ): CancelablePromise<OptionDetail> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/options/by-city/',
                query: {
                    'city': city,
                    'service': service,
                },
            });
        }
        /**
         * Список услуг
         *
         * Получить список всех доступных услуг.
         *
         * **Возвращает только активные услуги** (is_active=True).
         *
         * **Доступные услуги:**
         * - 🚗 Эвакуатор
         * - 🔧 Шиномонтаж
         * - ⚡ Техническая помощь на дороге
         * - ⛽ Заправка топливом
         * - 🔑 Вскрытие автомобиля
         * - 🔋 Прикурить автомобиль
         * - 🚛 Грузоперевозки
         * - 🧰 Замена масла
         *
         * **Функции:**
         * - Поиск по названию услуги (параметр `search`)
         * - Сортировка по `display_order` или `title`
         * - Пагинация результатов
         *
         * Результаты отсортированы по display_order.
         *
         * @param limit Number of results to return per page.
         * @param offset The initial index from which to return the results.
         * @param ordering Which field to use when ordering the results.
         * @param search Поиск по названию услуги
         * @returns PaginatedServiceListList
         * @throws ApiError
         */
        public static websiteServicesList(
            limit?: number,
            offset?: number,
            ordering?: string,
            search?: string,
        ): CancelablePromise<PaginatedServiceListList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/services/',
                query: {
                    'limit': limit,
                    'offset': offset,
                    'ordering': ordering,
                    'search': search,
                },
            });
        }
        /**
         * Детальная информация об услуге
         *
         * Получить полную информацию об услуге по slug.
         *
         * **Возвращает 404 для неактивных услуг.**
         *
         * **Включает:**
         * - Название и slug услуги
         * - Краткое и полное описание
         * - Иконка услуги
         * - Список доступных опций (активные)
         * - HTML контент для страницы услуги (если есть)
         * - SEO метаданные (если настроены)
         *
         * **Пример slug:** `shinomontazh`, `evakuator`, `tehnicheskaya-pomoshch`
         *
         * @param slug
         * @returns ServiceDetail
         * @throws ApiError
         */
        public static websiteServicesRetrieve(
            slug: string,
        ): CancelablePromise<ServiceDetail> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/services/{slug}/',
                path: {
                    'slug': slug,
                },
            });
        }
        /**
         * Опции услуги
         *
         * Получить список опций для конкретной услуги.
         *
         * **Возвращает только активные опции** (is_active=True).
         *
         * **Примеры опций для шиномонтажа:**
         * - Радиус колеса (R13, R14, R15, и т.д.)
         * - Тип автомобиля (легковой, кроссовер, внедорожник)
         * - Балансировка колес
         * - Замена вентилей
         *
         * Для каждой опции возвращается название, описание и цены по городам.
         *
         * @param slug
         * @returns ServiceDetail
         * @throws ApiError
         */
        public static websiteServicesOptionsRetrieve(
            slug: string,
        ): CancelablePromise<ServiceDetail> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/services/{slug}/options/',
                path: {
                    'slug': slug,
                },
            });
        }
        /**
         * Список категорий техники
         *
         * Получить список категорий техники для различных услуг.
         *
         * **Фильтрация:**
         * - По услуге (`service` - ID услуги)
         * - По slug услуги (`service__slug`)
         *
         * **Примеры категорий:**
         * - Легковой автомобиль
         * - Кроссовер
         * - Внедорожник
         * - Легкий коммерческий транспорт
         * - Мотоцикл
         *
         * Категории техники используются для дифференциации цен на опции в зависимости от типа автомобиля.
         *
         * @param limit Number of results to return per page.
         * @param offset The initial index from which to return the results.
         * @param service ID услуги для фильтрации
         * @param serviceSlug Slug услуги для фильтрации
         * @returns PaginatedTechnicCategoryList
         * @throws ApiError
         */
        public static websiteTechnicCategoriesList(
            limit?: number,
            offset?: number,
            service?: number,
            serviceSlug?: string,
        ): CancelablePromise<PaginatedTechnicCategoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/technic-categories/',
                query: {
                    'limit': limit,
                    'offset': offset,
                    'service': service,
                    'service__slug': serviceSlug,
                },
            });
        }
        /**
         * Детали категории техники
         * Получить детальную информацию о категории техники
         * @param id A unique integer value identifying this Категория техники.
         * @returns TechnicCategory
         * @throws ApiError
         */
        public static websiteTechnicCategoriesRetrieve(
            id: number,
        ): CancelablePromise<TechnicCategory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/website/technic-categories/{id}/',
                path: {
                    'id': id,
                },
            });
        }
    }
