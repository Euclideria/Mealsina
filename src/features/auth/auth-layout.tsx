import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative grid h-svh max-w-none items-center justify-center'>
      <div className='absolute start-8 top-8'>
        <Logo className='h-10 w-auto text-primary' />
      </div>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        {children}
      </div>
    </div>
  )
}
