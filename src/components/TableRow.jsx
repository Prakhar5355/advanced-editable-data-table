import React, { memo } from 'react';
import { COLUMN_DEFS } from '../utils/dataGenerator';
import { EditableCell } from './EditableCell';
import { RowActions } from './RowActions';
import { StatusBadge } from './StatusBadge';
import { useTable } from '../context/TableContext';

export const TableRow = memo(function TableRow({ row, style }) {
  const { state } = useTable();
  const hasEdits = !!(state.edits[row.id] && Object.keys(state.edits[row.id]).length > 0);

  return (
    <div
      className={`table-row data-row ${hasEdits ? 'row-dirty' : ''}`}
      style={style}
    >
      <div className="td td-actions">
        <RowActions rowId={row.id} />
      </div>
      {COLUMN_DEFS.map(col => {
        const rawVal = state.edits[row.id]?.[col.key] !== undefined
          ? state.edits[row.id][col.key]
          : row[col.key];

        return (
          <div
            key={col.key}
            className="td"
            style={{ width: col.width, minWidth: col.width }}
          >
            {col.key === 'status' && state.editingCell?.rowId !== row.id ? (
              <div className={`cell-value ${col.editable ? 'editable' : ''}`}>
                <StatusBadge value={rawVal} />
              </div>
            ) : (
              <EditableCell
                rowId={row.id}
                field={col.key}
                value={rawVal}
                type={col.type}
                editable={col.editable}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
