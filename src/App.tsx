import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Dashboard } from "@/pages/Dashboard";
import { Alunos } from "@/pages/Alunos";
import { Professores } from "@/pages/Professores";
import { Turmas } from "@/pages/Turmas";
import { Notas } from "@/pages/Notas";
import { Boletim } from "@/pages/Boletim";
import { Auth } from "@/pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="gestao-escolar-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/alunos" element={
                <ProtectedRoute>
                  <Layout>
                    <Alunos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/professores" element={
                <ProtectedRoute>
                  <Layout>
                    <Professores />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/turmas" element={
                <ProtectedRoute>
                  <Layout>
                    <Turmas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notas" element={
                <ProtectedRoute>
                  <Layout>
                    <Notas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/boletim" element={
                <ProtectedRoute>
                  <Layout>
                    <Boletim />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/frequencia" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
