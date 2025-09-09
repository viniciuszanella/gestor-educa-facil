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
import { Plus, Search, Edit, Trash2, BookOpen, Users, Clock } from 'lucide-react';
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
                  <Button variant="outline" size="sm">
                    Ver Lista de Alunos
                  </Button>
                  <Button variant="outline" size="sm">
                    Lançar Notas
                  </Button>
                  <Button variant="outline" size="sm">
                    Registrar Frequência
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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