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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash2, BookOpen, Users, Clock, MessageSquare, GraduationCap, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockClasses = [
  {
    id: '1',
    name: '9°A',
    grade: '9º Ano',
    shift: 'Manhã',
    teacher: 'Maria Santos',
    totalStudents: 32,
    capacity: 35,
    subjects: ['Matemática', 'Português', 'História', 'Geografia', 'Ciências'],
    status: 'Ativa',
    classroom: 'Sala 201'
  },
  {
    id: '2',
    name: '8°B',
    grade: '8º Ano',
    shift: 'Tarde',
    teacher: 'João Silva',
    totalStudents: 28,
    capacity: 35,
    subjects: ['Matemática', 'Português', 'História', 'Geografia', 'Ciências'],
    status: 'Ativa',
    classroom: 'Sala 105'
  },
  {
    id: '3',
    name: '7°C',
    grade: '7º Ano',
    shift: 'Manhã',
    teacher: 'Ana Costa',
    totalStudents: 30,
    capacity: 35,
    subjects: ['Matemática', 'Português', 'História', 'Geografia', 'Ciências'],
    status: 'Inativa',
    classroom: 'Sala 102'
  },
];

const mockTeacherClasses = [
  {
    id: '1',
    name: '9°A',
    subject: 'Matemática',
    totalStudents: 32,
    shift: 'Manhã',
    schedule: 'Seg, Qua, Sex - 08:00',
    classroom: 'Sala 201',
    nextClass: '2024-03-15 08:00'
  },
  {
    id: '2',
    name: '8°B',
    subject: 'Matemática',
    totalStudents: 28,
    shift: 'Tarde',
    schedule: 'Ter, Qui - 14:00',
    classroom: 'Sala 105',
    nextClass: '2024-03-14 14:00'
  }
];

const grades = ['6º Ano', '7º Ano', '8º Ano', '9º Ano'];
const shifts = ['Manhã', 'Tarde', 'Noite'];
const teachers = ['Maria Santos', 'João Silva', 'Ana Costa', 'Carlos Lima'];

// Mock students data
const mockStudents = [
  {
    id: '1',
    name: 'Pedro Oliveira',
    email: 'pedro@escola.com',
    avatar_url: '🧑‍🎓',
    observations: 'Aluno dedicado e participativo nas aulas.'
  },
  {
    id: '2',
    name: 'Ana Silva',
    email: 'ana.silva@escola.com',
    avatar_url: '👩‍🎓',
    observations: ''
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos.santos@escola.com',
    avatar_url: '👨‍🎓',
    observations: 'Precisa melhorar a participação em sala.'
  },
  {
    id: '4',
    name: 'Maria Costa',
    email: 'maria.costa@escola.com',
    avatar_url: '👩‍🎓',
    observations: ''
  }
];

function AdminClasses() {
  const [classes, setClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    shift: '',
    teacher: '',
    capacity: 35,
    classroom: '',
    status: 'Ativa'
  });

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingClass) {
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { 
              ...c, 
              ...formData, 
              totalStudents: c.totalStudents,
              subjects: c.subjects 
            }
          : c
      ));
      toast({
        title: "Turma atualizada",
        description: "Os dados da turma foram atualizados com sucesso.",
      });
    } else {
      const newClass = {
        id: Date.now().toString(),
        ...formData,
        totalStudents: 0,
        subjects: ['Matemática', 'Português', 'História', 'Geografia', 'Ciências']
      };
      setClasses([...classes, newClass]);
      toast({
        title: "Turma cadastrada",
        description: "Nova turma foi cadastrada com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingClass(null);
    setFormData({ 
      name: '', 
      grade: '', 
      shift: '', 
      teacher: '', 
      capacity: 35, 
      classroom: '', 
      status: 'Ativa' 
    });
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      shift: cls.shift,
      teacher: cls.teacher,
      capacity: cls.capacity,
      classroom: cls.classroom,
      status: cls.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    toast({
      title: "Turma removida",
      description: "A turma foi removida do sistema.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Turmas</h1>
          <p className="text-muted-foreground">Cadastre e gerencie as turmas da escola</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClass ? 'Editar Turma' : 'Cadastrar Nova Turma'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da turma abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Turma</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: 9°A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Série</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a série" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shift">Turno</Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({...formData, shift: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher">Professor Responsável</Label>
                  <Select value={formData.teacher} onValueChange={(value) => setFormData({...formData, teacher: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidade</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 35})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classroom">Sala</Label>
                  <Input
                    id="classroom"
                    value={formData.classroom}
                    onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                    placeholder="Ex: Sala 201"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Inativa">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingClass ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lista de Turmas
          </CardTitle>
          <CardDescription>
            {filteredClasses.length} turma(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, professor ou série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell>{cls.teacher}</TableCell>
                  <TableCell>{cls.shift}</TableCell>
                  <TableCell>
                    <span className="font-medium">{cls.totalStudents}/{cls.capacity}</span>
                  </TableCell>
                  <TableCell>{cls.classroom}</TableCell>
                  <TableCell>
                    <Badge variant={cls.status === 'Ativa' ? 'default' : 'secondary'}>
                      {cls.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cls.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherClasses() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const [showGradesDialog, setShowGradesDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentObservation, setStudentObservation] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [grades, setGrades] = useState<{[key: string]: number}>({});
  const [attendance, setAttendance] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setStudentObservation(student.observations || '');
  };

  const handleSaveObservation = () => {
    setStudents(students.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, observations: studentObservation }
        : s
    ));
    setSelectedStudent(null);
    setStudentObservation('');
    toast({
      title: "Observação salva",
      description: "A observação do aluno foi salva com sucesso.",
    });
  };

  const handleSaveGrades = () => {
    toast({
      title: "Notas lançadas",
      description: "As notas foram salvas com sucesso.",
    });
    setShowGradesDialog(false);
    setGrades({});
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Frequência registrada", 
      description: "A frequência foi registrada com sucesso.",
    });
    setShowAttendanceDialog(false);
    setAttendance({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Minhas Turmas</h1>
        <p className="text-muted-foreground">Gerencie suas turmas e horários</p>
      </div>

      <div className="grid gap-6">
        {mockTeacherClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Turma {cls.name} - {cls.subject}
                  </CardTitle>
                  <CardDescription>
                    {cls.totalStudents} alunos • {cls.shift} • {cls.classroom}
                  </CardDescription>
                </div>
                <Badge variant="default">{cls.shift}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{cls.totalStudents} Alunos</p>
                    <p className="text-sm text-muted-foreground">Total matriculados</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{cls.schedule}</p>
                    <p className="text-sm text-muted-foreground">Horário das aulas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{cls.classroom}</p>
                    <p className="text-sm text-muted-foreground">Local das aulas</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Dialog open={showStudentsList} onOpenChange={setShowStudentsList}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedClass(cls)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Ver Lista de Alunos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Lista de Alunos - Turma {selectedClass?.name}</DialogTitle>
                        <DialogDescription>
                          Clique em um aluno para adicionar observações
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        {students.map((student) => (
                          <Card 
                            key={student.id} 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleStudentSelect(student)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={student.avatar_url} />
                                  <AvatarFallback>{student.avatar_url}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                  {student.observations && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <MessageSquare className="h-3 w-3 inline mr-1" />
                                      {student.observations}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showGradesDialog} onOpenChange={setShowGradesDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedClass(cls)}
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Lançar Notas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Lançar Notas - Turma {selectedClass?.name}</DialogTitle>
                        <DialogDescription>
                          Digite as notas dos alunos (0 a 10)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={student.avatar_url} />
                              <AvatarFallback>{student.avatar_url}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{student.name}</p>
                            </div>
                            <div className="w-20">
                              <Input
                                type="number"
                                min="0"
                                max="10" 
                                step="0.1"
                                placeholder="Nota"
                                value={grades[student.id] || ''}
                                onChange={(e) => setGrades({
                                  ...grades,
                                  [student.id]: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                          </div>
                        ))}
                        <Button onClick={handleSaveGrades} className="w-full">
                          Salvar Notas
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedClass(cls)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Registrar Frequência
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Registrar Frequência - Turma {selectedClass?.name}</DialogTitle>
                        <DialogDescription>
                          Marque os alunos presentes na aula de hoje
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center gap-4">
                            <Checkbox
                              id={`attendance-${student.id}`}
                              checked={attendance[student.id] || false}
                              onCheckedChange={(checked) => setAttendance({
                                ...attendance,
                                [student.id]: !!checked
                              })}
                            />
                            <Avatar>
                              <AvatarImage src={student.avatar_url} />
                              <AvatarFallback>{student.avatar_url}</AvatarFallback>
                            </Avatar>
                            <Label 
                              htmlFor={`attendance-${student.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </Label>
                          </div>
                        ))}
                        <Button onClick={handleSaveAttendance} className="w-full">
                          Salvar Frequência
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Observation Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Observações - {selectedStudent.name}</DialogTitle>
              <DialogDescription>
                Adicione observações sobre o aluno
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedStudent.avatar_url} />
                  <AvatarFallback>{selectedStudent.avatar_url}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={studentObservation}
                  onChange={(e) => setStudentObservation(e.target.value)}
                  placeholder="Digite suas observações sobre o aluno..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveObservation} className="flex-1">
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function Turmas() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminClasses />;
  } else if (user?.role === 'professor') {
    return <TeacherClasses />;
  }

  return <div>Acesso não autorizado</div>;
}