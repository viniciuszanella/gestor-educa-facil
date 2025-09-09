import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const menuByRole = {
  admin: [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Alunos', url: '/alunos', icon: Users },
    { title: 'Professores', url: '/professores', icon: GraduationCap },
    { title: 'Turmas', url: '/turmas', icon: BookOpen },
    { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
  ],
  professor: [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Minhas Turmas', url: '/turmas', icon: BookOpen },
    { title: 'Lançar Notas', url: '/notas', icon: ClipboardList },
    { title: 'Frequência', url: '/frequencia', icon: Calendar },
  ],
  aluno: [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Minhas Notas', url: '/notas', icon: ClipboardList },
    { title: 'Boletim', url: '/boletim', icon: BarChart3 },
    { title: 'Frequência', url: '/frequencia', icon: Calendar },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  if (!user) return null;

  const menuItems = menuByRole[user.role] || [];
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">Sistema Escolar</h1>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium flex items-center gap-2 px-3 py-2 rounded-md" 
                          : "text-foreground hover:bg-muted hover:text-sidebar-accent-foreground flex items-center gap-2 px-3 py-2 rounded-md transition-colors"
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" style={{ color: 'currentColor' }} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="w-full"
        >
          <LogOut className="h-4 w-4 text-current" />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}