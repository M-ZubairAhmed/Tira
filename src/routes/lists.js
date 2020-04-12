import React, { useMemo } from 'react'
import { useTable, useSortBy, useFilters } from 'react-table'
import { Link } from 'react-router-dom'

export const tableColumnsUser = {
  Header: 'Stories',
  columns: [
    {
      Header: 'ID',
      accessor: 'ID',
    },
    {
      Header: 'Summary',
      accessor: 'summary',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Type',
      accessor: 'type',
      Filter: SelectColumnFilter,
      filter: 'includes',
    },
    {
      Header: 'Complexity',
      accessor: 'complexity',
    },
    {
      Header: 'Estimated Hours',
      accessor: 'estimatedHrs',
    },
    {
      Header: 'Cost',
      accessor: 'cost',
    },
  ],
}

export const tableColumnsAdmin = {
  Header: 'Stories',
  columns: [
    {
      Header: 'ID',
      accessor: 'ID',
    },
    {
      Header: 'Summary',
      accessor: 'summary',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Type',
      accessor: 'type',
      Filter: SelectColumnFilter,
      filter: 'includes',
    },
    {
      Header: 'Complexity',
      accessor: 'complexity',
    },
    {
      Header: 'Estimated Hours',
      accessor: 'estimatedHrs',
    },
    {
      Header: 'Cost',
      accessor: 'cost',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
  ],
}

function SelectColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}>
      <option value="">All</option>
      <option value="enhancement">Enhancement</option>
      <option value="bugfix">Bugfix</option>
      <option value="development">Development</option>
      <option value="qa">Q/A</option>
    </select>
  )
}

const Table = ({ data, isAdmin }) => {
  const columnsForAdmins = useMemo(() => [tableColumnsAdmin], [])
  const columnsForUsers = useMemo(() => [tableColumnsUser], [])

  const columns = isAdmin ? columnsForAdmins : columnsForUsers

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    state,
    headers,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy,
  )

  const isFiltered = state.filters.length !== 0 ? state.filters[0].value : ''
  const noRows = rows.length === 0

  return (
    <div className="table-responsive-sm">
      <table {...getTableProps()} className="table table-bordered table-hover">
        {isFiltered ? (
          <caption>
            Showing <strong>"{isFiltered}"</strong> type of stories{' '}
            <span className="badge badge-secondary">{rows.length}</span>
          </caption>
        ) : (
          <caption>
            Showing all stories{' '}
            <span className="badge badge-secondary">{rows.length}</span>
          </caption>
        )}
        <thead className="">
          {headers.map((headerGroup) => (
            <tr {...headerGroup.getHeaderProps()}>
              {headerGroup.headers.map((column) => {
                const isSortable =
                  column.id === 'ID' || column.id === 'complexity'

                const isFilterable = column.id === 'type'
                if (isSortable) {
                  return (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      scope="col"
                      className="align-middle">
                      {column.render('Header')}

                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span className="ml-2">&#10595;</span>
                          ) : (
                            <span className="ml-2">&#10597;</span>
                          )
                        ) : (
                          <span className="ml-2">&#10606;</span>
                        )}
                      </span>
                    </th>
                  )
                }
                return (
                  <th
                    {...column.getHeaderProps()}
                    scope="col"
                    className="align-middle">
                    {column.render('Header')}
                    <div>
                      {column.canFilter && isFilterable
                        ? column.render('Filter')
                        : null}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {noRows && (
            <tr className="text-center" style={{ height: '10rem' }}>
              <td colSpan="8" className="align-middle">
                No stories
              </td>
            </tr>
          )}
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  let prefix = ''
                  let text = ''
                  let suffix = ''
                  let capitalize = ''
                  let link = `/story/view/${row.values.ID}`

                  if (cell.column.id === 'cost') {
                    prefix = '$'
                  }

                  if (cell.column.id === 'estimatedHrs') {
                    suffix = ' Hours'
                    if (cell.value === 1) {
                      suffix = ' Hour'
                    }
                  }

                  if (
                    cell.column.id === 'type' ||
                    cell.column.id === 'complexity' ||
                    cell.column.id === 'status'
                  ) {
                    capitalize = 'text-capitalize'
                  }

                  if (cell.column.id === 'status') {
                    text = (
                      <span
                        className={`badge badge-pill ${
                          cell.value === 'approved'
                            ? 'badge-success'
                            : cell.value === 'rejected'
                            ? 'badge-danger'
                            : 'badge-dark'
                        }`}>
                        {cell.render('Cell')}
                      </span>
                    )
                  } else {
                    text = cell.render('Cell')
                  }

                  return (
                    <td
                      {...cell.getCellProps()}
                      className={`p-0 ${capitalize}`}>
                      <Link to={link} className="btn btn-link-no-hover p-3">
                        {prefix}
                        {text}
                        {suffix}
                      </Link>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ({ stories, isAdmin }) => {
  return <Table data={stories} isAdmin={isAdmin} />
}
