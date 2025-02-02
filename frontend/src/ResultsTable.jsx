// src/components/ResultsTable.jsx
import React, { useMemo } from 'react';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
} from '@mui/material';

const ResultsTable = ({ data, onRowClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'URL',
        accessor: 'URL',
        Cell: ({ value }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: 'Title',
        accessor: 'Title',
      },
      {
        Header: 'Title Length',
        accessor: 'Title Length',
      },
      {
        Header: 'Meta Description',
        accessor: 'Meta Description',
      },
      {
        Header: 'Meta Length',
        accessor: 'Meta Description Length',
      },
      {
        Header: 'H1 Present',
        accessor: 'Has H1',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      {
        Header: 'Keyword Density (%)',
        accessor: 'Keyword Density (%)',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of rows, use page for pagination
    setGlobalFilter,
    state: { globalFilter, pageIndex, pageSize },
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Paper sx={{ width: '100%', mb: 4 }}>
      <TextField
        variant="outlined"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        sx={{ m: 2, width: '50%' }}
      />
      <TableContainer>
        <Table {...getTableProps()} aria-label="results table">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    {column.render('Header')}
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <TableRow
                    {...row.getRowProps()}
                    key={row.id}
                    onClick={() => onRowClick(row.original)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Paper>
  );
};

export default ResultsTable;
