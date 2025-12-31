/**
 * FormSidebar Component
 * Переиспользуемый сайдбар с формой LeadForm для использования в TwoColumnLayout
 */

import * as React from 'react'
import { LeadForm, type LeadFormRef } from '@/components/forms/LeadForm'
import type { LeadType } from '@/lib/api/services'

export interface FormSidebarProps {
  /** ID города для привязки заявки */
  cityId?: number
  /** ID услуги для привязки заявки */
  serviceId?: number
  /** Заголовок формы */
  title?: string
  /** Коллбек при успешной отправке */
  onSuccess?: () => void
  /** Тип заявки (по умолчанию service) */
  leadType?: LeadType
  /** Ref для доступа к методам формы */
  formRef?: React.RefObject<LeadFormRef | null>
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
  leadType = 'service',
  formRef,
}: FormSidebarProps) {
  return (
    <div className="form-sidebar space-y-6">
      <LeadForm
        ref={formRef}
        cityId={cityId}
        serviceId={serviceId}
        title={title}
        noBorder
        cardClassName="-mt-6"
        onSuccess={onSuccess}
        leadType={leadType}
      />
    </div>
  )
}

