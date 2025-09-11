-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'professor', 'aluno');

-- Create enum for class shifts
CREATE TYPE public.class_shift AS ENUM ('manha', 'tarde', 'noite');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  registration_number TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  shift class_shift NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  max_students INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table (students in classes)
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  UNIQUE(student_id, class_id)
);

-- Create assignments table (teachers teaching subjects to classes)
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, class_id, subject_id, year)
);

-- Create grades table
CREATE TABLE public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  bimester INTEGER NOT NULL CHECK (bimester BETWEEN 1 AND 4),
  grade DECIMAL(4,2) CHECK (grade >= 0 AND grade <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, assignment_id, bimester)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  present BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id, date)
);

-- Create observations table
CREATE TABLE public.observations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  observation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user is teacher of a class
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(class_id_param UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.teachers t ON a.teacher_id = t.id
    WHERE a.class_id = class_id_param AND t.user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user is student in class
CREATE OR REPLACE FUNCTION public.is_student_in_class(class_id_param UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.students s ON e.student_id = s.id
    WHERE e.class_id = class_id_param AND s.user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (get_current_user_role() = 'admin');
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (get_current_user_role() = 'admin');

-- Students policies
CREATE POLICY "Admins can manage all students" ON public.students FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can view students in their classes" ON public.students FOR SELECT USING (
  get_current_user_role() = 'professor' AND EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.assignments a ON e.class_id = a.class_id
    JOIN public.teachers t ON a.teacher_id = t.id
    WHERE e.student_id = students.id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Students can view their own data" ON public.students FOR SELECT USING (user_id = auth.uid());

-- Teachers policies
CREATE POLICY "Admins can manage all teachers" ON public.teachers FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can view their own data" ON public.teachers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can view teacher names" ON public.teachers FOR SELECT USING (true);

-- Subjects policies
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (get_current_user_role() = 'admin');

-- Classes policies
CREATE POLICY "Admins can manage all classes" ON public.classes FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can view their classes" ON public.classes FOR SELECT USING (
  get_current_user_role() = 'professor' AND EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.teachers t ON a.teacher_id = t.id
    WHERE a.class_id = classes.id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Students can view their classes" ON public.classes FOR SELECT USING (
  get_current_user_role() = 'aluno' AND EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.students s ON e.student_id = s.id
    WHERE e.class_id = classes.id AND s.user_id = auth.uid()
  )
);

-- Enrollments policies
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can view enrollments in their classes" ON public.enrollments FOR SELECT USING (is_teacher_of_class(class_id));
CREATE POLICY "Students can view their own enrollment" ON public.enrollments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = enrollments.student_id AND s.user_id = auth.uid()
  )
);

-- Assignments policies
CREATE POLICY "Admins can manage assignments" ON public.assignments FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can view their assignments" ON public.assignments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = assignments.teacher_id AND t.user_id = auth.uid()
  )
);

-- Grades policies
CREATE POLICY "Admins can manage all grades" ON public.grades FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can manage grades for their assignments" ON public.grades FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.teachers t ON a.teacher_id = t.id
    WHERE a.id = grades.assignment_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Students can view their own grades" ON public.grades FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = grades.student_id AND s.user_id = auth.uid()
  )
);

-- Attendance policies
CREATE POLICY "Admins can manage all attendance" ON public.attendance FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can manage attendance for their classes" ON public.attendance FOR ALL USING (is_teacher_of_class(class_id));
CREATE POLICY "Students can view their own attendance" ON public.attendance FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = attendance.student_id AND s.user_id = auth.uid()
  )
);

-- Observations policies
CREATE POLICY "Admins can manage all observations" ON public.observations FOR ALL USING (get_current_user_role() = 'admin');
CREATE POLICY "Teachers can manage their own observations" ON public.observations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.id = observations.teacher_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Students can view observations about them" ON public.observations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = observations.student_id AND s.user_id = auth.uid()
  )
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON public.observations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'aluno')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample subjects
INSERT INTO public.subjects (name, code, description) VALUES
('Matemática', 'MAT', 'Disciplina de Matemática'),
('Português', 'POR', 'Disciplina de Língua Portuguesa'),
('História', 'HIS', 'Disciplina de História'),
('Geografia', 'GEO', 'Disciplina de Geografia'),
('Ciências', 'CIE', 'Disciplina de Ciências'),
('Inglês', 'ING', 'Disciplina de Língua Inglesa'),
('Educação Física', 'EDF', 'Disciplina de Educação Física'),
('Artes', 'ART', 'Disciplina de Artes');

-- Insert sample classes
INSERT INTO public.classes (name, grade, shift, year) VALUES
('6º Ano A', '6º Ano', 'manha', 2024),
('6º Ano B', '6º Ano', 'tarde', 2024),
('7º Ano A', '7º Ano', 'manha', 2024),
('7º Ano B', '7º Ano', 'tarde', 2024),
('8º Ano A', '8º Ano', 'manha', 2024),
('9º Ano A', '9º Ano', 'manha', 2024);