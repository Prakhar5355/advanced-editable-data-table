import React from 'react';
import { TableProvider, useTable } from './context/TableContext';
import { DataTable } from './components/DataTable';
import { useUnsavedChangesPrompt } from './hooks/useUnsavedChangesPrompt';
import './styles.css';

function AppInner() {
  const { hasUnsavedChanges } = useTable();
  useUnsavedChangesPrompt(hasUnsavedChanges);
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="logo">
            <span className="logo-mark">◈</span>
            <span className="logo-text">DataGrid<span className="logo-pro">Pro</span></span>
          </div>
          <div className="header-meta">
            <span>10,000 rows · Virtual Scroll · Multi-sort · Inline Edit</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DataTable />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TableProvider>
      <AppInner />
    </TableProvider>
  );
}
