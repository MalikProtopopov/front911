'use client'

import * as React from "react"
import { Users, MapPin, MessageSquare, Star, TrendingUp } from "lucide-react"
import { useMetrics } from "@/lib/api/hooks"
import { SkeletonMetrics } from "@/components/common/Skeleton"
import type { Metric } from "@/lib/api/generated"

// Icon mapping for metrics
const metricIcons: Record<string, React.ReactNode> = {
  'cities': <MapPin className="w-8 h-8" />,
  'partners': <Users className="w-8 h-8" />,
  'reviews': <MessageSquare className="w-8 h-8" />,
  'rating': <Star className="w-8 h-8" />,
  'orders': <TrendingUp className="w-8 h-8" />,
}

// Color mapping for metrics
const metricColors: Record<string, string> = {
  'cities': 'var(--color-primary)',
  'partners': 'var(--color-secondary)',
  'reviews': 'var(--color-accent)',
  'rating': 'var(--color-success)',
  'orders': 'var(--color-primary)',
}

// Fallback metrics
const fallbackMetrics = [
  { key: 'cities', value: 82, label: 'города', color: 'var(--color-primary)' },
  { key: 'partners', value: 195, label: 'партнёров', color: 'var(--color-secondary)' },
  { key: 'reviews', value: 2728, label: 'отзывов', color: 'var(--color-accent)' },
  { key: 'rating', value: 4.84, label: 'рейтинг', color: 'var(--color-success)' },
]

function getMetricIcon(metricKey: string): React.ReactNode {
  return metricIcons[metricKey] ?? <TrendingUp className="w-8 h-8" />
}

function getMetricColor(metricKey: string): string {
  return metricColors[metricKey] ?? 'var(--color-primary)'
}

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
  color: string
  isVisible: boolean
  index: number
}

function MetricItem({ metricKey, value, label, color, isVisible, index }: MetricItemProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const isDecimal = numericValue % 1 !== 0 || metricKey === 'rating'
  
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        animation: isVisible
          ? `fadeIn 0.5s ease-out ${index * 0.1}s backwards`
          : 'none',
      }}
    >
      <div className="flex justify-center mb-4 hidden">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {getMetricIcon(metricKey)}
        </div>
      </div>
      <div
        className="text-5xl md:text-6xl font-bold mb-2 leading-none"
        style={{ color }}
      >
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

export function TrustBar() {
  const [isVisible, setIsVisible] = React.useState(false)
  const { metrics, isLoading } = useMetrics()
  
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
    if (metrics.length > 0) {
      return metrics.slice(0, 4).map((metric: Metric) => ({
        key: metric.metric_key,
        value: metric.value,
        label: metric.display_label,
        color: getMetricColor(metric.metric_key),
      }))
    }
    return fallbackMetrics
  }, [metrics])

  return (
    <section
      id="trust-bar"
      className="section-spacing-lg bg-gradient-to-r from-[var(--color-primary)]/5 via-[var(--color-secondary)]/5 to-[var(--color-accent)]/5"
    >
      <div className="container mx-auto px-4">
        {isLoading ? (
          <SkeletonMetrics />
        ) : (
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {displayMetrics.map((metric, index) => (
              <div key={metric.key} className="w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] flex justify-center">
                <MetricItem
                  metricKey={metric.key}
                  value={metric.value}
                  label={metric.label}
                  color={metric.color}
                  isVisible={isVisible}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
