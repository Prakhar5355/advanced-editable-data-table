import React from 'react';
import { useTable } from '../context/TableContext';
import { exportToCSV } from '../utils/csvExport';
import { COLUMN_DEFS } from '../utils/dataGenerator';

export function Toolbar() {
  const { state, processedRows, actions, hasUnsavedChanges, unsavedCount } = useTable();
  const activeFilterCount = Object.values(state.filters).filter(Boolean).length;

  const handleExport = () => {
    exportToCSV(processedRows, COLUMN_DEFS, 'data-export.csv');
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="data-stats">
          <span className="stat-value">{processedRows.length.toLocaleString()}</span>
          <span className="stat-label">rows</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button className="btn btn-ghost" onClick={actions.clearFilters}>
            Clear filters ✕
          </button>
        )}

        {hasUnsavedChanges && (
          <div className="unsaved-indicator">
            <span className="pulse-dot" />
            {unsavedCount} unsaved row{unsavedCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="toolbar-right">
        <button
          className={`btn btn-toggle ${state.useVirtualScroll ? 'active' : ''}`}
          onClick={actions.toggleVirtual}
          title="Toggle virtual scrolling vs pagination"
        >
          {state.useVirtualScroll ? '⚡ Virtual' : '📄 Paginated'}
        </button>

        <button className="btn btn-export" onClick={handleExport}>
          ↓ CSV
        </button>
      </div>
    </div>
  );
}
