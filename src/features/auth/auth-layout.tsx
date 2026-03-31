type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='relative grid h-svh max-w-none items-center justify-center'>
      <div className='absolute start-8 top-8'>
        <img src='/Mealsina_logo.png' alt='Mealsina' className='h-12 w-auto' />
      </div>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        {children}
      </div>
    </div>
  )
}
