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
          className='flex w-full items-center justify-center gap-2'
        >
          <img
            src='/Mealsina_logo.png'
            alt='Mealsina'
            className='h-7 w-7 shrink-0 object-contain'
          />
          <span className='flex-1 truncate font-semibold'>Mealsina</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
