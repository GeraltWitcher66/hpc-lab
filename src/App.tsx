import { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramEditorPage from './pages/ProgramEditorPage';
import ProgramPrintPage from './pages/ProgramPrintPage';
import ClientsPage from './pages/ClientsPage';
import ClientEditorPage from './pages/ClientEditorPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentEditorPage from './pages/AssessmentEditorPage';
import SettingsPage from './pages/SettingsPage';

type Page =
  | 'dashboard'
  | 'exercises'
  | 'programs'
  | 'program-editor'
  | 'program-print'
  | 'clients'
  | 'client-editor'
  | 'reports'
  | 'assessment-editor'
  | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setEditingProgramId(null);
    setEditingClientId(null);
    setEditingAssessmentId(null);
    setCurrentPage(page as Page);
  };

  const handleOpenProgram = (id: string | null) => {
    if (id) {
      setEditingProgramId(id);
      setEditingClientId(null);
      setEditingAssessmentId(null);
      setCurrentPage('program-editor');
    }
  };

  const handleOpenClient = (id: string | null) => {
    if (id) {
      setEditingClientId(id);
      setEditingProgramId(null);
      setEditingAssessmentId(null);
      setCurrentPage('client-editor');
    }
  };

  const handleOpenAssessment = (id: string | null) => {
    if (id) {
      setEditingAssessmentId(id);
      setEditingProgramId(null);
      setEditingClientId(null);
      setCurrentPage('assessment-editor');
    }
  };

  const renderPage = () => {
    if (currentPage === 'program-print' && editingProgramId) {
      return (
        <ProgramPrintPage
          programId={editingProgramId}
          onBack={() => setCurrentPage('program-editor')}
        />
      );
    }

    if (currentPage === 'program-editor' && editingProgramId) {
      return (
        <ProgramEditorPage
          programId={editingProgramId}
          onBack={() => {
            setEditingProgramId(null);
            setCurrentPage('programs');
          }}
          onPrint={() => setCurrentPage('program-print')}
        />
      );
    }

    if (currentPage === 'client-editor' && editingClientId) {
      return (
        <ClientEditorPage
          clientId={editingClientId}
          onBack={() => {
            setEditingClientId(null);
            setCurrentPage('clients');
          }}
          onOpenProgram={handleOpenProgram}
        />
      );
    }

    if (currentPage === 'assessment-editor' && editingAssessmentId) {
      return (
        <AssessmentEditorPage
          assessmentId={editingAssessmentId}
          onBack={() => {
            setEditingAssessmentId(null);
            setCurrentPage('reports');
          }}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'exercises':
        return <ExercisesPage />;
      case 'programs':
        return <ProgramsPage onOpenProgram={handleOpenProgram} />;
      case 'clients':
        return <ClientsPage onOpenClient={handleOpenClient} />;
      case 'reports':
        return <AssessmentsPage onOpenAssessment={handleOpenAssessment} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  const sidebarPage =
    currentPage === 'program-editor' || currentPage === 'program-print'
      ? 'programs'
      : currentPage === 'client-editor'
        ? 'clients'
        : currentPage === 'assessment-editor'
          ? 'reports'
          : currentPage;

  if (currentPage === 'program-print') {
    return renderPage();
  }

  return (
    <Layout currentPage={sidebarPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
