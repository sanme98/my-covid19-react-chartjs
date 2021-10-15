import React from 'react';
import {
    Row,
    Col,
    Table
} from 'reactstrap';

const TableCovid = (props) => {
    //const { data } = props;

    const renderHeader = () => {
        let headerElement = ['Date', 'New Cases', 'Import Cases', 'Recovered Cases', 'Active Cases']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        //console.log(props);
        return props.data && props.data.map(({ date, cases_new, cases_import, cases_recovered, cases_active }) => {
            return (
                <tr key={date}>
                    <td>{date}</td>
                    <td>{parseInt(cases_new).toLocaleString()}</td>
                    <td>{parseInt(cases_import).toLocaleString()}</td>
                    <td>{parseInt(cases_recovered).toLocaleString()}</td>
                    <td>{parseInt(cases_active).toLocaleString()}</td>
                </tr>
            )
        });
    }

    return (
        <>
            <h4>Last 14 Days New Cases</h4>
            <Table hover size="sm" striped bordered id='data'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </Table>
        </>
    )
}

export default TableCovid