import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock data
const studentInfo = {
  name: 'Pedro Oliveira',
  class: '9°A',
  studentId: '20240001',
  year: '2024',
  school: 'Escola Municipal Dom Pedro II'
};

const gradesBySubject = [
  {
    subject: 'Matemática',
    teacher: 'Prof. Maria Santos',
    grade1: 8.5,
    grade2: 7.8,
    grade3: 9.0,
    grade4: 8.2,
    average: 8.4,
    status: 'Aprovado',
    absences: 2
  },
  {
    subject: 'Português',
    teacher: 'Prof. João Silva',
    grade1: 7.5,
    grade2: 8.0,
    grade3: 7.8,
    grade4: 8.5,
    average: 7.95,
    status: 'Aprovado',
    absences: 1
  },
  {
    subject: 'História',
    teacher: 'Prof. Ana Costa',
    grade1: 9.0,
    grade2: 8.5,
    grade3: 8.8,
    grade4: 9.2,
    average: 8.88,
    status: 'Aprovado',
    absences: 0
  },
  {
    subject: 'Geografia',
    teacher: 'Prof. Carlos Lima',
    grade1: 7.0,
    grade2: 6.5,
    grade3: 7.5,
    grade4: 8.0,
    average: 7.25,
    status: 'Aprovado',
    absences: 3
  },
  {
    subject: 'Ciências',
    teacher: 'Prof. Lucia Mendes',
    grade1: 8.8,
    grade2: 9.0,
    grade3: 8.5,
    grade4: 9.2,
    average: 8.88,
    status: 'Aprovado',
    absences: 1
  },
  {
    subject: 'Educação Física',
    teacher: 'Prof. Roberto Souza',
    grade1: 9.5,
    grade2: 9.8,
    grade3: 9.2,
    grade4: 9.5,
    average: 9.5,
    status: 'Aprovado',
    absences: 0
  }
];

const summary = {
  totalSubjects: gradesBySubject.length,
  approvedSubjects: gradesBySubject.filter(g => g.status === 'Aprovado').length,
  generalAverage: gradesBySubject.reduce((acc, g) => acc + g.average, 0) / gradesBySubject.length,
  totalAbsences: gradesBySubject.reduce((acc, g) => acc + g.absences, 0),
  attendanceRate: 98.5
};

export function Boletim() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    toast({
      title: "Download iniciado",
      description: "O boletim está sendo gerado em PDF.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Boletim Escolar</h1>
          <p className="text-muted-foreground">Relatório completo de desempenho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Header do Boletim */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">{studentInfo.school}</CardTitle>
              <CardDescription className="text-lg font-semibold">
                Boletim Escolar - Ano Letivo {studentInfo.year}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Dados do Aluno</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Nome:</strong> {studentInfo.name}</p>
                <p><strong>Matrícula:</strong> {studentInfo.studentId}</p>
                <p><strong>Turma:</strong> {studentInfo.class}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resumo Geral</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Média Geral:</strong> {summary.generalAverage.toFixed(2)}</p>
                <p><strong>Frequência:</strong> {summary.attendanceRate}%</p>
                <p><strong>Status:</strong> 
                  <Badge className="ml-2" variant="default">
                    Aprovado
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas por Disciplina */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader>
          <CardTitle>Desempenho por Disciplina</CardTitle>
          <CardDescription>
            Notas e frequência detalhadas por matéria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead className="text-center">1° Bim</TableHead>
                  <TableHead className="text-center">2° Bim</TableHead>
                  <TableHead className="text-center">3° Bim</TableHead>
                  <TableHead className="text-center">4° Bim</TableHead>
                  <TableHead className="text-center">Média</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesBySubject.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{grade.subject}</TableCell>
                    <TableCell>{grade.teacher}</TableCell>
                    <TableCell className="text-center">{grade.grade1.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{grade.grade2.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{grade.grade3.toFixed(1)}</TableCell>
                    <TableCell className="text-center">{grade.grade4.toFixed(1)}</TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {grade.average.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">{grade.absences}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={grade.status === 'Aprovado' ? 'default' : 'destructive'}>
                        {grade.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader>
          <CardTitle>Estatísticas Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {summary.generalAverage.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Média Geral</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">
                {summary.approvedSubjects}/{summary.totalSubjects}
              </div>
              <div className="text-sm text-muted-foreground">Disciplinas Aprovadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {summary.attendanceRate}%
              </div>
              <div className="text-sm text-muted-foreground">Frequência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">
                {summary.totalAbsences}
              </div>
              <div className="text-sm text-muted-foreground">Total de Faltas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-success">Pontos Fortes:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Excelente desempenho em Educação Física e Ciências</li>
                <li>Baixo número de faltas demonstra comprometimento</li>
                <li>Melhoria consistente ao longo dos bimestres</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-warning">Recomendações:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Manter o foco nos estudos para o próximo ano letivo</li>
                <li>Continuar participando ativamente das aulas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="text-center text-sm text-muted-foreground print:mt-8">
        <Separator className="mb-4" />
        <p>Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        <p className="mt-1">{studentInfo.school} - Sistema de Gestão Escolar</p>
      </div>
    </div>
  );
}