import React from 'react';
import { useTable } from '../context/TableContext';
import { COLUMN_DEFS } from '../utils/dataGenerator';

export function TableHeader() {
  const { state, actions } = useTable();

  return (
    <div className="table-header-group">
      {/* Sort row */}
      <div className="table-row header-row">
        <div className="th th-actions" />
        {COLUMN_DEFS.map(col => {
          const sortEntry = state.sortConfig.find(s => s.key === col.key);
          const sortIndex = state.sortConfig.findIndex(s => s.key === col.key);
          return (
            <div
              key={col.key}
              className={`th ${sortEntry ? 'sorted' : ''}`}
              style={{ width: col.width, minWidth: col.width }}
              onClick={() => actions.setSort(col.key)}
            >
              <span className="th-label">{col.label}</span>
              <span className="sort-indicator">
                {sortEntry ? (
                  <>
                    <span className="sort-arrow">{sortEntry.dir === 'asc' ? '↑' : '↓'}</span>
                    {state.sortConfig.length > 1 && (
                      <span className="sort-rank">{sortIndex + 1}</span>
                    )}
                  </>
                ) : (
                  <span className="sort-arrow inactive">⇅</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="table-row filter-row">
        <div className="th th-actions" />
        {COLUMN_DEFS.map(col => (
          <div
            key={col.key}
            className="th-filter"
            style={{ width: col.width, minWidth: col.width }}
          >
            <input
              className="filter-input"
              placeholder={`Filter…`}
              value={state.filters[col.key] || ''}
              onChange={e => actions.setFilter(col.key, e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
