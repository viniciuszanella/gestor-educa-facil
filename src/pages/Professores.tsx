import { useState } from 'react';
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
import { Plus, Search, Edit, Trash2, GraduationCap, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockTeachers = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@escola.com',
    phone: '(11) 99999-1111',
    subject: 'Matemática',
    classes: ['9°A', '8°B', '7°C'],
    status: 'Ativo',
    hireDate: '2020-02-15',
    experience: '15 anos'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@escola.com',
    phone: '(11) 99999-2222',
    subject: 'Português',
    classes: ['9°A', '9°B'],
    status: 'Ativo',
    hireDate: '2018-03-10',
    experience: '12 anos'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@escola.com',
    phone: '(11) 99999-3333',
    subject: 'História',
    classes: ['8°A', '7°B'],
    status: 'Licença',
    hireDate: '2019-08-20',
    experience: '8 anos'
  },
];

const subjects = [
  'Matemática', 'Português', 'História', 'Geografia', 'Ciências',
  'Educação Física', 'Arte', 'Inglês', 'Filosofia', 'Sociologia'
];

const allClasses = ['9°A', '9°B', '8°A', '8°B', '7°A', '7°B', '6°A', '6°B'];

export function Professores() {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    classes: [] as string[],
    status: 'Ativo',
    experience: ''
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingTeacher) {
      setTeachers(teachers.map(t => 
        t.id === editingTeacher.id 
          ? { ...t, ...formData, hireDate: t.hireDate }
          : t
      ));
      toast({
        title: "Professor atualizado",
        description: "Os dados do professor foram atualizados com sucesso.",
      });
    } else {
      const newTeacher = {
        id: Date.now().toString(),
        ...formData,
        hireDate: new Date().toISOString().split('T')[0]
      };
      setTeachers([...teachers, newTeacher]);
      toast({
        title: "Professor cadastrado",
        description: "Novo professor foi cadastrado com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingTeacher(null);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      subject: '', 
      classes: [], 
      status: 'Ativo', 
      experience: '' 
    });
  };

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      classes: teacher.classes,
      status: teacher.status,
      experience: teacher.experience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast({
      title: "Professor removido",
      description: "O professor foi removido do sistema.",
      variant: "destructive"
    });
  };

  const handleClassToggle = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Professores</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os professores da escola</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? 'Editar Professor' : 'Cadastrar Novo Professor'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do professor abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@escola.com"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Disciplina Principal</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Turmas Atribuídas</Label>
                <div className="grid grid-cols-4 gap-2">
                  {allClasses.map((className) => (
                    <Button
                      key={className}
                      type="button"
                      variant={formData.classes.includes(className) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleClassToggle(className)}
                    >
                      {className}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experiência</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="Ex: 10 anos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Licença">Licença</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingTeacher ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Lista de Professores
          </CardTitle>
          <CardDescription>
            {filteredTeachers.length} professor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou disciplina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Experiência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.map((cls) => (
                          <Badge key={cls} variant="secondary" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.experience}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          teacher.status === 'Ativo' ? 'default' : 
                          teacher.status === 'Licença' ? 'secondary' : 'destructive'
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(teacher.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}