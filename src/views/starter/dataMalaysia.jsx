import React from 'react';
import {
    Table,
    Button,
    Input,
    Label,
    FormGroup,
    Row,
    Col,
} from 'reactstrap';
import Papa from "papaparse/papaparse.js";
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';

function AdvancedTable({ columns, data }) {
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <Input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        )
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 20 },
            defaultColumn, // Be sure to pass the defaultColumn option
        },
        useFilters,
        useSortBy,
        usePagination,
    )

    // Render the UI for your table
    return (
        <>
            <Table striped bordered hover size="sm" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps()}>                                    
                                    {/* Render the columns filter UI */}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
            <div className="form-inline">
                <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={{ marginRight: '3px' }}>
                    {'<<'}
                </Button>{' '}
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} style={{ marginRight: '3px' }}>
                    {'<'}
                </Button>{' '}
                <Button onClick={() => nextPage()} disabled={!canNextPage} style={{ marginRight: '3px' }}>
                    {'>'}
                </Button>{' '}
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} style={{ marginRight: '3px' }}>
                    {'>>'}
                </Button>{' '}
                <span style={{ marginRight: '3px' }}>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <Col>
                    <FormGroup>
                        <Label for="pageNo">Go to page:</Label>
                        <Input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                            id="pageNo"
                        />
                    </FormGroup>
                </Col>
                <Input type="select"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Input>
            </div>
        </>
    )
}

const DataMalaysia = () => {

    const [state, setState] = React.useState([]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: 'New Cases',
                accessor: 'cases_new',
                Filter: SliderColumnFilter,
                filter: filterGreaterThan,
            },
            {
                Header: 'Import Cases',
                accessor: 'cases_import',
                Filter: SliderColumnFilter,
                filter: filterGreaterThan,
            },
            {
                Header: 'Recovered Cases',
                accessor: 'cases_recovered',
                Filter: SliderColumnFilter,
                filter: filterGreaterThan,
            },
            {
                Header: 'Active Cases',
                accessor: 'cases_active',
                Filter: SliderColumnFilter,
                filter: filterGreaterThan,
            },
        ],
        []
    )

    React.useEffect(() => {
        async function getData() {
            const response = await fetch('https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_malaysia.csv')
                .then(response => response.text())
                .then(v => Papa.parse(v, { header: true, skipEmptyLines: true }))
                .catch(err => console.log(err));

            setState(response.data);
        }
        getData();
    }, []);


    // This is a custom filter UI that uses a
    // slider to set the filter value between a column's
    // min and max values
    function SliderColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        // Calculate the min and max
        // using the preFilteredRows

        const [min, max] = React.useMemo(() => {
            let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
            preFilteredRows.forEach(row => {
                min = Math.min(row.values[id], min)
                max = Math.max(row.values[id], max)
            })
            return [min, max]
        }, [id, preFilteredRows])

        return (
            <>
                <Input
                    type="range"
                    min={min}
                    max={max}
                    value={filterValue || min}
                    onChange={e => {
                        setFilter(parseInt(e.target.value, 10))
                    }}
                />
            </>
        )
    }

    // Define a custom filter filter function!
    function filterGreaterThan(rows, id, filterValue) {
        return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue >= filterValue
        })
    }

    // This is an autoRemove method on the filter function that
    // when given the new filter value and returns true, the filter
    // will be automatically removed. Normally this is just an undefined
    // check, but here, we want to remove the filter if it's not a number
    filterGreaterThan.autoRemove = val => typeof val !== 'number'

    return (
        <div>
            <AdvancedTable columns={columns} data={state} />
        </div>
    );
}

export default DataMalaysia;
