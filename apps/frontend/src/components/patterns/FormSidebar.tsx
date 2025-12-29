/**
 * FormSidebar Component
 * Переиспользуемый сайдбар с формой LeadForm для использования в TwoColumnLayout
 */

import { LeadForm } from '@/components/forms/LeadForm'

export interface FormSidebarProps {
  /** ID города для привязки заявки */
  cityId?: number
  /** ID услуги для привязки заявки */
  serviceId?: number
  /** Заголовок формы */
  title?: string
  /** Коллбек при успешной отправке */
  onSuccess?: () => void
}

/**
 * Компонент сайдбара с формой заявки
 * Используется в TwoColumnLayout как prop sidebar
 * 
 * @example
 * ```tsx
 * <TwoColumnLayout
 *   sidebar={<FormSidebar cityId={city.id} title={`Заказать в ${city.title}`} />}
 *   sidebarPosition="right"
 * >
 *   {content}
 * </TwoColumnLayout>
 * ```
 */
export function FormSidebar({
  cityId,
  serviceId,
  title = 'Оставить заявку',
  onSuccess,
}: FormSidebarProps) {
  return (
    <div className="form-sidebar space-y-6">
      <LeadForm
        cityId={cityId}
        serviceId={serviceId}
        title={title}
        noBorder
        cardClassName="-mt-6"
        onSuccess={onSuccess}
      />
    </div>
  )
}

