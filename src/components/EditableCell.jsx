import React, { useState, useRef, useEffect } from 'react';
import { useTable } from '../context/TableContext';

export function EditableCell({ rowId, field, value, type, editable }) {
  const { state, actions } = useTable();
  const isEditing =
    state.editingCell?.rowId === rowId && state.editingCell?.field === field;
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(value);
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [isEditing, value]);

  const handleDoubleClick = () => {
    if (editable) actions.setEditing(rowId, field);
  };

  const commit = () => {
    const parsed = type === 'number' ? (isNaN(Number(draft)) ? value : Number(draft)) : draft;
    if (parsed !== value) {
      actions.commitEdit(rowId, field, parsed);
    } else {
      actions.setEditing(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') actions.setEditing(null);
    e.stopPropagation();
  };

  const hasRowEdit = !!(state.edits[rowId]);
  const isFieldEdited = state.edits[rowId]?.[field] !== undefined;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className="cell-input"
        type={type === 'number' ? 'number' : 'text'}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div
      className={`cell-value ${editable ? 'editable' : ''} ${isFieldEdited ? 'edited' : ''}`}
      onDoubleClick={handleDoubleClick}
      title={editable ? 'Double-click to edit' : undefined}
    >
      {type === 'number' && field === 'salary'
        ? value?.toLocaleString()
        : value}
      {isFieldEdited && <span className="edit-dot" />}
    </div>
  );
}
