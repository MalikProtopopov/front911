'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLeadForm } from '@/lib/api/hooks'
import type { LeadType } from '@/lib/api/services'
import { CheckCircle } from 'lucide-react'
import { cn, formatPhoneInput, cleanPhoneNumber } from '@/lib/utils'

const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100).optional().or(z.literal('')),
  phone: z.string()
    .min(1, 'Введите номер телефона')
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '')
      // Must have 11 digits (7 + 10 digits)
      return cleaned.length === 11 && cleaned.startsWith('7')
    }, 'Введите корректный номер телефона в формате +7 (999)-999-99-99'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  message: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadFormProps {
  cityId?: number
  serviceId?: number
  onSuccess?: () => void
  showCard?: boolean
  title?: string
  cardClassName?: string
  noBorder?: boolean
  isModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  messagePlaceholder?: string
  /** Lead type for categorization: service, feedback, partnership */
  leadType?: LeadType
  /** Show toast notifications (default: true, disabled when using inline success state) */
  showToast?: boolean
}

export interface LeadFormRef {
  setMessage: (message: string) => void
}

export const LeadForm = React.forwardRef<LeadFormRef, LeadFormProps>(({ 
  cityId, 
  serviceId, 
  onSuccess,
  showCard = true,
  title = 'Оставить заявку',
  cardClassName,
  noBorder = false,
  isModal = false,
  open,
  onOpenChange,
  messagePlaceholder = 'Опишите ваш запрос менеджеру',
  leadType = 'service',
  showToast = true,
}, ref) => {
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isRateLimited, setIsRateLimited] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(open ?? false)
  const [phoneValue, setPhoneValue] = React.useState('')
  const phoneInputRef = React.useRef<HTMLInputElement>(null)
  
  const { submitLead, isSubmitting } = useLeadForm({
    showToast,
    onSuccess: () => {
      setIsSuccess(true)
      setPhoneValue('')
      reset()
      onSuccess?.()
      
      // Close modal if in modal mode
      if (isModal) {
        setTimeout(() => {
          setIsOpen(false)
          onOpenChange?.(false)
          setIsSuccess(false)
        }, 3000)
      } else {
        // Hide success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000)
      }
    },
    onError: (error) => {
      if (error.message?.includes('rate') || error.message?.includes('limit')) {
        setIsRateLimited(true)
      }
    }
  })

  // Sync external open state
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Auto-focus phone input when modal opens
  React.useEffect(() => {
    if (isModal && isOpen && phoneInputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        phoneInputRef.current?.focus()
      }, 100)
    }
  }, [isModal, isOpen])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
    if (!newOpen) {
      setIsSuccess(false)
      setPhoneValue('')
      reset()
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      message: '',
    },
  })

  // Expose setMessage method via ref
  React.useImperativeHandle(ref, () => ({
    setMessage: (message: string) => {
      setValue('message', message, { shouldValidate: false })
    },
  }))

  const phoneRegister = register('phone')

  const onSubmit = async (data: LeadFormData) => {
    if (isRateLimited) {
      return
    }

    // Clean phone number before sending (remove formatting)
    const cleanPhone = cleanPhoneNumber(data.phone)

    await submitLead({
      name: data.name,
      phone: cleanPhone,
      message: data.message,
      city: cityId,
      service: serviceId,
      lead_type: leadType,
    })
  }

  const formContent = (
    <>
      {isSuccess ? (
        <div className="p-6 bg-[var(--color-success)]/10 border-2 border-[var(--color-success)] rounded-lg text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-[var(--color-success)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Заявка отправлена!</h3>
          <p className="text-[var(--foreground-secondary)]">
            Мы свяжемся с вами в ближайшее время
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Имя <span className="text-sm font-normal text-[var(--foreground-secondary)]">(необязательно)</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Иван"
              disabled={isSubmitting}
              className={errors.name ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneValue}
              onChange={(e) => {
                // Only allow digits and format
                const formatted = formatPhoneInput(e.target.value)
                setPhoneValue(formatted)
                // Update form value
                setValue('phone', formatted, { shouldValidate: true })
              }}
              onKeyDown={(e) => {
                // Allow: backspace, delete, tab, escape, enter, and arrow keys
                if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
                    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true)) {
                  return
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                  e.preventDefault()
                }
              }}
              onBlur={phoneRegister.onBlur}
              ref={(e) => {
                phoneRegister.ref(e)
                phoneInputRef.current = e
              }}
              placeholder="+7 (999)-999-99-99"
              disabled={isSubmitting}
              maxLength={18} // +7 (999)-999-99-99 = 18 chars
              className={errors.phone ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={messagePlaceholder}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isRateLimited}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </Button>

          {isRateLimited && (
            <p className="text-sm text-red-600 text-center">
              Превышен лимит заявок. Попробуйте позже.
            </p>
          )}

          <p className="text-sm text-[var(--foreground-secondary)] text-center mt-3">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <a
              href="/privacy"
              className="text-[var(--color-primary)] underline hover:no-underline"
            >
              политикой конфиденциальности
            </a>
          </p>
        </form>
      )}
    </>
  )

  // Modal mode
  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold leading-tight">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{formContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  // Card mode or no wrapper
  if (!showCard) {
    return (
      <div>
        {title && <h2 className="text-3xl font-bold leading-tight mb-4">{title}</h2>}
        {formContent}
      </div>
    )
  }

  return (
    <Card 
      className={cn("max-w-2xl mx-auto", noBorder && "card--no-border", cardClassName)}
    >
      <CardHeader className="sidebar-card-header">
        <CardTitle className="text-3xl font-bold leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">{formContent}</CardContent>
    </Card>
  )
})

LeadForm.displayName = 'LeadForm'
