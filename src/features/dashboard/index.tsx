import { useDashboard } from '@/hooks/api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function Dashboard() {
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useDashboard()

  if (dashboardError) {
    return (
      <>
        <Header>
          <div className='ms-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='p-8 text-center'>
            <h2 className='text-xl font-bold text-destructive'>Erreur de chargement</h2>
            <p className='text-muted-foreground mt-2'>Vérifiez votre connexion et reconnectez-vous si nécessaire.</p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Tableau de bord</h1>
        </div>

        {/* KPIs - from dashboard */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          {dashboardLoading ? (
            <>
              {[...Array(4)].map((_, i) => <Skeleton key={i} className='h-32' />)}
            </>
          ) : (
            <>
              {dashboard?.kpis?.sleep !== null && (
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Sommeil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>{dashboard?.kpis?.sleep ?? '-'}</div>
                    <p className='text-xs text-muted-foreground'>
                      Score
                    </p>
                  </CardContent>
                </Card>
              )}
              {dashboard?.kpis?.recovery !== null && (
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Récupération</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>{dashboard?.kpis?.recovery ?? '-'}</div>
                    <p className='text-xs text-muted-foreground'>
                      Score
                    </p>
                  </CardContent>
                </Card>
              )}
              {dashboard?.kpis?.activity !== null && (
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Activité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>{dashboard?.kpis?.activity ?? '-'}</div>
                    <p className='text-xs text-muted-foreground'>
                      Score
                    </p>
                  </CardContent>
                </Card>
              )}
              {dashboard?.kpis?.stress !== null && (
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>Stress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-3xl font-bold'>{dashboard?.kpis?.stress ?? '-'}</div>
                    <p className='text-xs text-muted-foreground'>
                      Score
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Trends 7 days - only show if data exists */}
        {dashboard?.trends_7d && dashboard.trends_7d.sleep && dashboard.trends_7d.sleep.some(v => v !== null) && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6'>
            <Card className='col-span-full'>
              <CardHeader>
                <CardTitle className='text-sm'>Tendances 7 derniers jours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-7 gap-2'>
                  {dashboard.trends_7d.sleep?.map((value, index) => (
                    <div key={`sleep-${index}`} className='text-center'>
                      <div
                        className='w-full bg-blue-500 rounded-t-md'
                        style={{ height: `${(value || 0) * 1.5}px`, maxHeight: '150px' }}
                      />
                      <p className='text-xs text-muted-foreground mt-1'>Jour {index + 1}</p>
                      <p className='text-xs font-medium'>{value ?? '-'}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-4 text-center text-sm text-muted-foreground'>
                  <span className='inline-block px-2'>Sommeil</span>
                  <span className='inline-block px-2'>|</span>
                  <span className='inline-block px-2'>Récupération: {(dashboard.trends_7d.recovery || []).filter(v => v !== null).join(', ') || '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Summary */}
        {dashboard?.ai_summary && dashboard.ai_summary !== "Pas encore assez de données pour générer un résumé." && (
          <Card className='mb-6 border-primary'>
            <CardHeader>
              <CardTitle className='text-sm'>Résumé IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>{dashboard.ai_summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Today's Summary */}
        {dashboardLoading ? (
          <Skeleton className='h-48' />
        ) : dashboard ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader><CardTitle>Repas du jour</CardTitle></CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboard.meals_today?.count || 0}</div>
                <p className='text-sm text-muted-foreground'>
                  {dashboard.meals_today?.total_calories || 0} kcal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Traitements</CardTitle></CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboard.treatments_today?.taken || 0} / {dashboard.treatments_today?.pending || 0}
                </div>
                <p className='text-sm text-muted-foreground'>
                  {dashboard.treatments_today?.compliance || '0%'} observance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Jours consécutifs</CardTitle></CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboard.streak}</div>
                <p className='text-sm text-muted-foreground'>jours de suite</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Active Alerts */}
        {dashboard?.active_alerts && dashboard.active_alerts.length > 0 && (
          <Card className='mt-6 border-destructive'>
            <CardHeader>
              <CardTitle className='text-destructive'>Alertes actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {dashboard.active_alerts.map((alert, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <span className='text-destructive'>⚠️</span>
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/',
    isActive: true,
    disabled: false,
  },
]
