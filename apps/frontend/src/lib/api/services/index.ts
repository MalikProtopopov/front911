/**
 * API Services exports
 */

export { servicesService, type GetServicesParams } from './services.service'
export { 
  citiesService, 
  type GetCitiesParams, 
  type CityServiceResponse, 
  type CityServiceOption,
  type ParameterValue,
  type ParameterType,
  type ParameterPriceItem,
  type DeliveryZone,
} from './cities.service'
export { leadsService, captureUtmParams, getCurrentPageUrl, getFullPageUrl, type CreateLeadData, type LeadType } from './leads.service'
export { seoService, type GetSeoMetaParams } from './seo.service'
export { 
  contentService, 
  type GetAdvantagesParams, 
  type GetMetricsParams, 
  type GetContactsParams,
  type GetAppLinksParams,
  type GetOptionsParams,
} from './content.service'

