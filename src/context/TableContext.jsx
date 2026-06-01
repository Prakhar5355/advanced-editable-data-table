import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { generateDataset } from '../utils/dataGenerator';

const TableContext = createContext(null);

const initialState = {
  originalData: [],
  data: [],
  edits: {},        // { rowId: { field: newValue } }
  editHistory: {},  // for undo: { rowId: { field: [oldVal, ...] } }
  editingCell: null,// { rowId, field }
  sortConfig: [],   // [{ key, dir }]
  filters: {},      // { field: value }
  page: 0,
  pageSize: 50,
  useVirtualScroll: true,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA': {
      return { ...state, originalData: action.payload, data: action.payload, loading: false };
    }
    case 'SET_EDITING': {
      return { ...state, editingCell: action.payload };
    }
    case 'COMMIT_EDIT': {
      const { rowId, field, value } = action.payload;
      const prevEdits = state.edits[rowId] || {};
      const originalRow = state.originalData.find(r => r.id === rowId);
      const currentVal = prevEdits[field] !== undefined ? prevEdits[field] : (originalRow ? originalRow[field] : undefined);
      const prevHistory = state.editHistory[rowId] || {};
      const fieldHistory = prevHistory[field] || [];
      return {
        ...state,
        edits: {
          ...state.edits,
          [rowId]: { ...prevEdits, [field]: value },
        },
        editHistory: {
          ...state.editHistory,
          [rowId]: { ...prevHistory, [field]: [...fieldHistory, currentVal] },
        },
        editingCell: null,
      };
    }
    case 'UNDO_ROW': {
      const { rowId } = action.payload;
      const history = state.editHistory[rowId] || {};
      const currentEdits = state.edits[rowId] || {};
      const newEdits = { ...currentEdits };
      const newHistory = { ...history };
      Object.keys(history).forEach(field => {
        const stack = history[field];
        if (stack && stack.length > 0) {
          newEdits[field] = stack[stack.length - 1];
          newHistory[field] = stack.slice(0, -1);
        }
      });
      return {
        ...state,
        edits: { ...state.edits, [rowId]: newEdits },
        editHistory: { ...state.editHistory, [rowId]: newHistory },
      };
    }
    case 'SAVE_ROW': {
      const { rowId } = action.payload;
      const rowEdits = state.edits[rowId] || {};
      const newOriginal = state.originalData.map(r =>
        r.id === rowId ? { ...r, ...rowEdits } : r
      );
      const newEdits = { ...state.edits };
      delete newEdits[rowId];
      const newHistory = { ...state.editHistory };
      delete newHistory[rowId];
      return {
        ...state,
        originalData: newOriginal,
        data: newOriginal,
        edits: newEdits,
        editHistory: newHistory,
      };
    }
    case 'CANCEL_ROW': {
      const newEdits = { ...state.edits };
      delete newEdits[action.payload.rowId];
      const newHistory = { ...state.editHistory };
      delete newHistory[action.payload.rowId];
      return { ...state, edits: newEdits, editHistory: newHistory };
    }
    case 'SET_SORT': {
      const { key } = action.payload;
      const existing = state.sortConfig.find(s => s.key === key);
      let newSort;
      if (!existing) {
        newSort = [{ key, dir: 'asc' }, ...state.sortConfig.filter(s => s.key !== key)].slice(0, 3);
      } else if (existing.dir === 'asc') {
        newSort = state.sortConfig.map(s => s.key === key ? { ...s, dir: 'desc' } : s);
      } else {
        newSort = state.sortConfig.filter(s => s.key !== key);
      }
      return { ...state, sortConfig: newSort, page: 0 };
    }
    case 'SET_FILTER': {
      const newFilters = { ...state.filters, [action.payload.field]: action.payload.value };
      if (!action.payload.value) delete newFilters[action.payload.field];
      return { ...state, filters: newFilters, page: 0 };
    }
    case 'CLEAR_FILTERS': {
      return { ...state, filters: {}, page: 0 };
    }
    case 'SET_PAGE': {
      return { ...state, page: action.payload };
    }
    case 'SET_PAGE_SIZE': {
      return { ...state, pageSize: action.payload, page: 0 };
    }
    case 'TOGGLE_VIRTUAL': {
      return { ...state, useVirtualScroll: !state.useVirtualScroll };
    }
    default:
      return state;
  }
}

export function TableProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    // Generate on next tick to not block paint
    const timer = setTimeout(() => {
      const data = generateDataset(10000);
      dispatch({ type: 'INIT_DATA', payload: data });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const processedRows = useMemo(() => {
    let rows = state.originalData;

    // Apply edits to view
    if (Object.keys(state.edits).length > 0) {
      rows = rows.map(row => {
        const rowEdits = state.edits[row.id];
        return rowEdits ? { ...row, ...rowEdits } : row;
      });
    }

    // Filter
    const activeFilters = Object.entries(state.filters).filter(([, v]) => v !== '');
    if (activeFilters.length > 0) {
      rows = rows.filter(row =>
        activeFilters.every(([field, filterVal]) => {
          const cellVal = String(row[field] ?? '').toLowerCase();
          return cellVal.includes(String(filterVal).toLowerCase());
        })
      );
    }

    // Sort
    if (state.sortConfig.length > 0) {
      rows = [...rows].sort((a, b) => {
        for (const { key, dir } of state.sortConfig) {
          const av = a[key], bv = b[key];
          if (av === bv) continue;
          const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
          return dir === 'asc' ? cmp : -cmp;
        }
        return 0;
      });
    }

    return rows;
  }, [state.originalData, state.edits, state.filters, state.sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = state.page * state.pageSize;
    return processedRows.slice(start, start + state.pageSize);
  }, [processedRows, state.page, state.pageSize]);

  const hasUnsavedChanges = Object.keys(state.edits).length > 0;
  const unsavedCount = Object.keys(state.edits).length;

  const actions = useMemo(() => ({
    setEditing: (rowId, field) => dispatch({ type: 'SET_EDITING', payload: rowId && field ? { rowId, field } : null }),
    commitEdit: (rowId, field, value) => dispatch({ type: 'COMMIT_EDIT', payload: { rowId, field, value } }),
    undoRow: (rowId) => dispatch({ type: 'UNDO_ROW', payload: { rowId } }),
    saveRow: (rowId) => dispatch({ type: 'SAVE_ROW', payload: { rowId } }),
    cancelRow: (rowId) => dispatch({ type: 'CANCEL_ROW', payload: { rowId } }),
    setSort: (key) => dispatch({ type: 'SET_SORT', payload: { key } }),
    setFilter: (field, value) => dispatch({ type: 'SET_FILTER', payload: { field, value } }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
    setPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
    setPageSize: (size) => dispatch({ type: 'SET_PAGE_SIZE', payload: size }),
    toggleVirtual: () => dispatch({ type: 'TOGGLE_VIRTUAL' }),
  }), []);

  return (
    <TableContext.Provider value={{ state, processedRows, paginatedRows, actions, hasUnsavedChanges, unsavedCount }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  return useContext(TableContext);
}
