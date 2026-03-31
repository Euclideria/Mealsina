import { UserAuthForm } from './components/user-auth-form'
import { DNAHelix } from './components/dna-helix'

export function SignIn2() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col items-center justify-center px-8'>
        <div className='w-full max-w-sm space-y-6'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>Connexion à Mealsina</h2>
          </div>
          <UserAuthForm />
        </div>
      </div>
      <div className='hidden bg-muted lg:flex lg:items-center lg:justify-center'>
        <DNAHelix />
      </div>
    </div>
  )
}
