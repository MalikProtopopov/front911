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
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов').max(100).optional().or(z.literal('')),
  phone: z.string().min(10, 'Введите корректный номер телефона').max(20),
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
}

export function LeadForm({ 
  cityId, 
  serviceId, 
  onSuccess,
  showCard = true,
  title = 'Оставить заявку',
  cardClassName,
  noBorder = false,
  isModal = false,
  open,
  onOpenChange
}: LeadFormProps) {
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isRateLimited, setIsRateLimited] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(open ?? false)
  const phoneInputRef = React.useRef<HTMLInputElement>(null)
  
  const { submitLead, isSubmitting } = useLeadForm({
    onSuccess: () => {
      setIsSuccess(true)
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
      reset()
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  const phoneRegister = register('phone')

  const onSubmit = async (data: LeadFormData) => {
    if (isRateLimited) {
      return
    }

    await submitLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      city: cityId,
      service: serviceId,
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
              placeholder="Иван Иванов"
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
              {...phoneRegister}
              ref={(e) => {
                phoneRegister.ref(e)
                phoneInputRef.current = e
              }}
              placeholder="+7 (999) 123-45-67"
              disabled={isSubmitting}
              className={errors.phone ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-sm font-normal text-[var(--foreground-secondary)]">(необязательно)</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="ivan@example.com"
              disabled={isSubmitting}
              className={errors.email ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Опишите вашу проблему..."
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
              className="text-[var(--color-primary)] hover:underline"
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
}
