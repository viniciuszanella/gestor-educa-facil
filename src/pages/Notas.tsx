import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Save, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockTeacherGrades = [
  {
    studentId: '1',
    studentName: 'Ana Silva',
    class: '9°A',
    subject: 'Matemática',
    grade1: 8.5,
    grade2: 7.8,
    grade3: null,
    grade4: null,
    average: 8.15
  },
  {
    studentId: '2',
    studentName: 'Bruno Santos',
    class: '9°A',
    subject: 'Matemática',
    grade1: 7.2,
    grade2: 8.0,
    grade3: null,
    grade4: null,
    average: 7.6
  },
];

const mockStudentGrades = [
  {
    subject: 'Matemática',
    teacher: 'Prof. Maria Santos',
    grade1: 8.5,
    grade2: 7.8,
    grade3: 9.0,
    grade4: 8.2,
    average: 8.4,
    status: 'Aprovado'
  },
  {
    subject: 'Português',
    teacher: 'Prof. João Silva',
    grade1: 7.5,
    grade2: 8.0,
    grade3: 7.8,
    grade4: 8.5,
    average: 7.95,
    status: 'Aprovado'
  },
  {
    subject: 'História',
    teacher: 'Prof. Ana Costa',
    grade1: 9.0,
    grade2: 8.5,
    grade3: 8.8,
    grade4: 9.2,
    average: 8.88,
    status: 'Aprovado'
  },
];

function TeacherGrades() {
  const [grades, setGrades] = useState(mockTeacherGrades);
  const [selectedClass, setSelectedClass] = useState('9°A');
  const [selectedBimester, setSelectedBimester] = useState('1');
  const { toast } = useToast();

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0 || numValue > 10) return;

    setGrades(grades.map(grade => 
      grade.studentId === studentId 
        ? { ...grade, [`grade${selectedBimester}`]: numValue }
        : grade
    ));
  };

  const handleSave = () => {
    toast({
      title: "Notas salvas",
      description: "As notas foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lançamento de Notas</h1>
        <p className="text-muted-foreground">Gerencie as notas dos seus alunos</p>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2">
          <Label>Turma</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9°A">9°A</SelectItem>
              <SelectItem value="8°B">8°B</SelectItem>
              <SelectItem value="7°C">7°C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Bimestre</Label>
          <Select value={selectedBimester} onValueChange={setSelectedBimester}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1° Bimestre</SelectItem>
              <SelectItem value="2">2° Bimestre</SelectItem>
              <SelectItem value="3">3° Bimestre</SelectItem>
              <SelectItem value="4">4° Bimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Notas - {selectedClass} - {selectedBimester}° Bimestre
          </CardTitle>
          <CardDescription>
            Matéria: Matemática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.studentId}>
                  <TableCell className="font-medium">{grade.studentName}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={grade[`grade${selectedBimester}` as keyof typeof grade] || ''}
                      onChange={(e) => handleGradeChange(grade.studentId, e.target.value)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      (grade[`grade${selectedBimester}` as keyof typeof grade] as number) >= 7 
                        ? 'default' 
                        : 'destructive'
                    }>
                      {(grade[`grade${selectedBimester}` as keyof typeof grade] as number) >= 7 
                        ? 'Aprovado' 
                        : 'Recuperação'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Notas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentGrades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Minhas Notas</h1>
        <p className="text-muted-foreground">Acompanhe seu desempenho acadêmico</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas por Disciplina
            </CardTitle>
            <CardDescription>
              Desempenho no ano letivo atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>1° Bim</TableHead>
                  <TableHead>2° Bim</TableHead>
                  <TableHead>3° Bim</TableHead>
                  <TableHead>4° Bim</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudentGrades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{grade.subject}</TableCell>
                    <TableCell>{grade.teacher}</TableCell>
                    <TableCell>{grade.grade1.toFixed(1)}</TableCell>
                    <TableCell>{grade.grade2.toFixed(1)}</TableCell>
                    <TableCell>{grade.grade3.toFixed(1)}</TableCell>
                    <TableCell>{grade.grade4.toFixed(1)}</TableCell>
                    <TableCell className="font-bold">{grade.average.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={grade.status === 'Aprovado' ? 'default' : 'destructive'}>
                        {grade.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">8.4</div>
                <div className="text-sm text-muted-foreground">Média Geral</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Disciplinas Aprovado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Recuperação</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Notas() {
  const { user } = useAuth();

  if (user?.role === 'professor') {
    return <TeacherGrades />;
  } else if (user?.role === 'aluno') {
    return <StudentGrades />;
  }

  return <div>Acesso não autorizado</div>;
}