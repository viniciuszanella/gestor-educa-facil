import { useAuth } from '@/contexts/AuthContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Calendar,
  ClipboardList,
  Star,
  Clock
} from 'lucide-react';

// Mock data
const adminStats = {
  totalStudents: 1247,
  totalTeachers: 85,
  totalClasses: 42,
  activeClasses: 38,
};

const teacherStats = {
  myClasses: 6,
  totalStudents: 185,
  assignmentsGraded: 92,
  pendingGrades: 15,
};

const studentStats = {
  currentGrade: 8.5,
  attendance: 95,
  assignmentsCompleted: 28,
  assignmentsPending: 3,
};

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do sistema escolar</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Alunos"
          value={adminStats.totalStudents}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <DashboardCard
          title="Total de Professores"
          value={adminStats.totalTeachers}
          icon={GraduationCap}
          trend={{ value: 2.1, isPositive: true }}
        />
        <DashboardCard
          title="Turmas Ativas"
          value={`${adminStats.activeClasses}/${adminStats.totalClasses}`}
          icon={BookOpen}
          description="Turmas em andamento"
        />
        <DashboardCard
          title="Taxa de Crescimento"
          value="12.5%"
          icon={TrendingUp}
          description="Novos alunos este semestre"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Users className="h-4 w-4 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">5 novos alunos cadastrados</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <BookOpen className="h-4 w-4 text-accent" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Turma 9°A criada</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <GraduationCap className="h-4 w-4 text-warning" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Prof. Maria Santos - novo cadastro</p>
                  <p className="text-xs text-muted-foreground">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Rápidas</CardTitle>
            <CardDescription>Resumo do desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxa de Aprovação</span>
                <span className="text-sm font-bold text-success">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Frequência Média</span>
                <span className="text-sm font-bold text-primary">91.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfação dos Pais</span>
                <span className="text-sm font-bold text-accent">4.7/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard do Professor</h1>
        <p className="text-muted-foreground">Gerencie suas turmas e atividades</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Minhas Turmas"
          value={teacherStats.myClasses}
          icon={BookOpen}
          description="Turmas ativas"
        />
        <DashboardCard
          title="Total de Alunos"
          value={teacherStats.totalStudents}
          icon={Users}
          description="Em todas as turmas"
        />
        <DashboardCard
          title="Atividades Corrigidas"
          value={teacherStats.assignmentsGraded}
          icon={ClipboardList}
          trend={{ value: 8.3, isPositive: true }}
        />
        <DashboardCard
          title="Pendências"
          value={teacherStats.pendingGrades}
          icon={Clock}
          description="Notas para lançar"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
            <CardDescription>Agenda de hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">9°A - Matemática</p>
                  <p className="text-sm text-muted-foreground">Sala 205</p>
                </div>
                <span className="text-sm font-bold">08:00</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">8°B - Matemática</p>
                  <p className="text-sm text-muted-foreground">Sala 205</p>
                </div>
                <span className="text-sm font-bold">10:00</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">7°C - Matemática</p>
                  <p className="text-sm text-muted-foreground">Sala 205</p>
                </div>
                <span className="text-sm font-bold">14:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho das Turmas</CardTitle>
            <CardDescription>Média geral por turma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">9°A</span>
                <span className="text-sm font-bold text-success">8.7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">8°B</span>
                <span className="text-sm font-bold text-primary">7.9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">7°C</span>
                <span className="text-sm font-bold text-warning">6.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Painel</h1>
        <p className="text-muted-foreground">Acompanhe seu desempenho acadêmico</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Média Geral"
          value={studentStats.currentGrade}
          icon={Star}
          trend={{ value: 2.5, isPositive: true }}
        />
        <DashboardCard
          title="Frequência"
          value={`${studentStats.attendance}%`}
          icon={Calendar}
          description="Taxa de presença"
        />
        <DashboardCard
          title="Atividades Concluídas"
          value={studentStats.assignmentsCompleted}
          icon={ClipboardList}
          description="Este bimestre"
        />
        <DashboardCard
          title="Pendências"
          value={studentStats.assignmentsPending}
          icon={Clock}
          description="Atividades em atraso"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Avaliações</CardTitle>
            <CardDescription>Agenda de provas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Prova de Matemática</p>
                  <p className="text-sm text-muted-foreground">Capítulos 5-7</p>
                </div>
                <span className="text-sm font-bold">15/03</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Trabalho de História</p>
                  <p className="text-sm text-muted-foreground">Segunda Guerra Mundial</p>
                </div>
                <span className="text-sm font-bold">20/03</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Prova de Ciências</p>
                  <p className="text-sm text-muted-foreground">Sistema Solar</p>
                </div>
                <span className="text-sm font-bold">25/03</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas Recentes</CardTitle>
            <CardDescription>Últimas avaliações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Matemática - Prova</span>
                <span className="text-sm font-bold text-success">9.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Português - Redação</span>
                <span className="text-sm font-bold text-primary">8.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">História - Trabalho</span>
                <span className="text-sm font-bold text-accent">8.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'professor':
      return <TeacherDashboard />;
    case 'aluno':
      return <StudentDashboard />;
    default:
      return <div>Tipo de usuário não reconhecido</div>;
  }
}