import { useSidebar } from '@/components/ui/sidebar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function TeamSwitcher() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          onClick={toggleSidebar}
          aria-label='Toggle sidebar'
          className='flex flex-col items-center justify-center gap-1'
        >
          <img
            src='/Mealsina_logo.png'
            alt='Mealsina'
            className='h-8 w-8 object-contain'
          />
          <span className='text-xs font-semibold'>Mealsina</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
