import React from 'react';
import { useTable } from '../context/TableContext';

export function Pagination() {
  const { state, processedRows, actions } = useTable();
  const totalPages = Math.ceil(processedRows.length / state.pageSize);
  const page = state.page;

  const getPages = () => {
    const pages = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    if (start > 0) { pages.push(0); if (start > 1) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) { if (end < totalPages - 2) pages.push('...'); pages.push(totalPages - 1); }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {(page * state.pageSize + 1).toLocaleString()}–
        {Math.min((page + 1) * state.pageSize, processedRows.length).toLocaleString()}
        {' '}of {processedRows.length.toLocaleString()}
      </div>

      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={page === 0}
          onClick={() => actions.setPage(0)}
        >«</button>
        <button
          className="page-btn"
          disabled={page === 0}
          onClick={() => actions.setPage(page - 1)}
        >‹</button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => actions.setPage(p)}
            >{p + 1}</button>
          )
        )}

        <button
          className="page-btn"
          disabled={page >= totalPages - 1}
          onClick={() => actions.setPage(page + 1)}
        >›</button>
        <button
          className="page-btn"
          disabled={page >= totalPages - 1}
          onClick={() => actions.setPage(totalPages - 1)}
        >»</button>
      </div>

      <select
        className="page-size-select"
        value={state.pageSize}
        onChange={e => actions.setPageSize(Number(e.target.value))}
      >
        {[25, 50, 100, 200].map(n => (
          <option key={n} value={n}>{n} / page</option>
        ))}
      </select>
    </div>
  );
}
