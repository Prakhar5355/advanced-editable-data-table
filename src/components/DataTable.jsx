import React, { useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useTable } from '../context/TableContext';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { Toolbar } from './Toolbar';
import { Pagination } from './Pagination';
import { COLUMN_DEFS } from '../utils/dataGenerator';

const ROW_HEIGHT = 44;
const TOTAL_WIDTH = COLUMN_DEFS.reduce((sum, c) => sum + c.width, 0) + 100; // +100 for actions

function VirtualTableBody({ rows }) {
  const listRef = useRef(null);

  const Row = useCallback(({ index, style }) => (
    <TableRow row={rows[index]} style={style} />
  ), [rows]);

  return (
    <List
      ref={listRef}
      height={600}
      itemCount={rows.length}
      itemSize={ROW_HEIGHT}
      width="100%"
      style={{ overflowX: 'visible' }}
      className="virtual-list"
    >
      {Row}
    </List>
  );
}

function PaginatedTableBody({ rows }) {
  return (
    <div className="paginated-body">
      {rows.map(row => (
        <TableRow key={row.id} row={row} />
      ))}
    </div>
  );
}

export function DataTable() {
  const { state, processedRows, paginatedRows } = useTable();

  if (state.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Generating 10,000 rows…</div>
      </div>
    );
  }

  return (
    <div className="datatable-wrapper">
      <Toolbar />

      <div className="table-scroll-container">
        <div className="table-inner" style={{ minWidth: TOTAL_WIDTH }}>
          <TableHeader />

          <div className="table-body">
            {state.useVirtualScroll ? (
              <VirtualTableBody rows={processedRows} />
            ) : (
              <PaginatedTableBody rows={paginatedRows} />
            )}
          </div>
        </div>
      </div>

      {!state.useVirtualScroll && <Pagination />}

      <div className="table-footer">
        <span>↕ Virtual scroll renders only visible rows • Double-click any cell to edit • Multi-column sort by clicking headers</span>
      </div>
    </div>
  );
}
