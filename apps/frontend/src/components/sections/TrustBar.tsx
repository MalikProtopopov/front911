'use client'

import * as React from "react"
import { useMetrics } from "@/lib/api/hooks"
import { SkeletonMetrics } from "@/components/common/Skeleton"
import { Section } from "@/components/ui"
import type { Metric } from "@/lib/api/generated"

interface TrustBarProps {
  initialMetrics?: Metric[]
}

// Fallback metrics
const fallbackMetrics = [
  { key: 'cities', value: 82, label: 'города' },
  { key: 'partners', value: 195, label: 'партнёров' },
  { key: 'reviews', value: 2728, label: 'отзывов' },
  { key: 'rating', value: 4.84, label: 'рейтинг' },
]

interface AnimatedCounterProps {
  target: number
  isDecimal?: boolean
  isVisible: boolean
}

function AnimatedCounter({ target, isDecimal = false, isVisible }: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let currentStep = 0
    
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      setCount(target * progress)
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setCount(target)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [target, isVisible])
  
  if (isDecimal) {
    return <>{count.toFixed(2)}</>
  }
  
  return <>{Math.floor(count).toLocaleString('ru-RU')}</>
}

interface MetricItemProps {
  metricKey: string
  value: string | number
  label: string
  isVisible: boolean
  index: number
}

function MetricItem({ metricKey, value, label, isVisible, index }: MetricItemProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const isDecimal = numericValue % 1 !== 0 || metricKey === 'rating'
  
  return (
    <div
      className={`flex flex-col items-center text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${index * 0.1}s` : undefined,
      } as React.CSSProperties}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-none text-[var(--color-primary)]">
        <AnimatedCounter 
          target={numericValue} 
          isDecimal={isDecimal} 
          isVisible={isVisible} 
        />
      </div>
      <div className="text-base md:text-lg text-[var(--foreground-secondary)] font-medium">
        {label}
      </div>
    </div>
  )
}

export function TrustBar({ initialMetrics = [] }: TrustBarProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  
  // SSR-only mode: uses server data, no client revalidation
  const { metrics, isLoading } = useMetrics(
    undefined,
    { fallbackData: initialMetrics.length > 0 ? initialMetrics : undefined }
  )

  // Use SSR data (metrics from hook includes fallbackData)
  const displayMetricsData = metrics.length > 0 ? metrics : initialMetrics
  
  // Only show loading if no data at all
  const showLoading = isLoading && displayMetricsData.length === 0
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("trust-bar")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  // Transform API metrics or use fallback
  const displayMetrics = React.useMemo(() => {
    if (displayMetricsData.length > 0) {
      return displayMetricsData.slice(0, 4).map((metric: Metric) => ({
        key: metric.metric_key,
        value: metric.value,
        label: metric.display_label,
      }))
    }
    return fallbackMetrics
  }, [displayMetricsData])

  return (
    <Section id="trust-bar" bg="secondary" spacing="lg">
      {showLoading ? (
        <SkeletonMetrics />
      ) : (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
          {displayMetrics.map((metric, index) => (
            <div key={metric.key} className="w-[calc(50%-1rem)] md:w-[calc(50%-1.5rem)] lg:w-auto lg:flex-1 max-w-[280px] flex justify-center">
              <MetricItem
                metricKey={metric.key}
                value={metric.value}
                label={metric.label}
                isVisible={isVisible}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
