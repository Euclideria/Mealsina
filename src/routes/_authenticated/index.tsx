import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { Dashboard } from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const tokenCookie = getCookie('thisisjustarandomstring')
    if (!tokenCookie) {
      throw redirect({ to: '/auth' })
    }
  },
  component: Dashboard,
})
