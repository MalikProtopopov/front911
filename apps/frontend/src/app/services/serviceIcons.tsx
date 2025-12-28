import { Wrench, Fuel, Truck, Construction, HelpCircle } from "lucide-react"

// Icon mapping (IconCircle handles sizing)
const serviceIcons: Record<string, React.ReactNode> = {
  'shinomontazh': <Wrench />,
  'zapravka-toplivom': <Fuel />,
  'fuel-delivery': <Fuel />, // Legacy slug support
  'evakuator': <Truck />,
  'evacuator': <Truck />, // Legacy slug support
  'avtovyshka': <Construction />,
  'auto-lift': <Construction />, // Legacy slug support
}

export function getServiceIcon(slug: string, _iconUrl?: string): React.ReactNode {
  return serviceIcons[slug] ?? <HelpCircle className="w-12 h-12" />
}

