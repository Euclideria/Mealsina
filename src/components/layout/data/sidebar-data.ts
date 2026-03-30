import {
  LayoutDashboard,
  Heart,
  TestTube,
  TrendingUp,
  Utensils,
  BarChart3,
  Pill,
  Bot,
  AlertTriangle,
  Thermometer,
  Bell,
  Search,
  Download,
  Settings,
  Activity,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Utilisateur',
    email: 'user@mealsina.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Mealsina',
      logo: Heart,
      plan: 'Health Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'Accueil',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Santé',
      items: [
        {
          title: 'Garmin',
          url: '/health',
          icon: Activity,
        },
        {
          title: 'Bilans Sanguins',
          url: '/blood-tests',
          icon: TestTube,
        },
        {
          title: 'KPIs',
          url: '/kpi',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'Nutrition',
      items: [
        {
          title: 'Repas',
          url: '/meals',
          icon: Utensils,
        },
        {
          title: 'Graphiques',
          url: '/charts',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Traitements',
      items: [
        {
          title: 'Médicaments',
          url: '/treatments',
          icon: Pill,
        },
      ],
    },
    {
      title: 'IA',
      items: [
        {
          title: 'Chat IA',
          url: '/ai',
          icon: Bot,
        },
      ],
    },
    {
      title: 'Alertes',
      items: [
        {
          title: 'Anomalies',
          url: '/anomalies',
          icon: AlertTriangle,
        },
        {
          title: 'Maladies',
          url: '/illness',
          icon: Thermometer,
        },
      ],
    },
    {
      title: 'Système',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
          icon: Bell,
        },
        {
          title: 'Recherche',
          url: '/search',
          icon: Search,
        },
        {
          title: 'Préférences',
          url: '/preferences',
          icon: Settings,
        },
        {
          title: 'Export',
          url: '/export',
          icon: Download,
        },
      ],
    },
  ],
}
