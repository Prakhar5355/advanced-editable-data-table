import React from 'react';
import { useTable } from '../context/TableContext';

export function RowActions({ rowId }) {
  const { state, actions } = useTable();
  const hasEdits = !!(state.edits[rowId] && Object.keys(state.edits[rowId]).length > 0);
  const hasHistory = !!(state.editHistory[rowId] && Object.values(state.editHistory[rowId]).some(h => h.length > 0));

  if (!hasEdits) return <div className="row-actions-placeholder" />;

  return (
    <div className="row-actions">
      <button
        className="btn-action btn-save"
        onClick={() => actions.saveRow(rowId)}
        title="Save changes"
      >
        ✓
      </button>
      {hasHistory && (
        <button
          className="btn-action btn-undo"
          onClick={() => actions.undoRow(rowId)}
          title="Undo last change"
        >
          ↩
        </button>
      )}
      <button
        className="btn-action btn-cancel"
        onClick={() => actions.cancelRow(rowId)}
        title="Cancel changes"
      >
        ✕
      </button>
    </div>
  );
}
