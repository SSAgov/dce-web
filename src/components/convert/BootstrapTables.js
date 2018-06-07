import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './Convert.css'

function statusCodeFormat(cell, row) {
    return (
        <div>{row.statusCode} - {row.statusCodeDescription}</div>
    )
}

function returnCodeFormat(cell, row) {
    return (
        <div>{row.returnCode} - {row.returnCodeDescription}</div>
    )
}

function formatDocumentName(cell, row) {
    if (cell) {
        return cell.replace(/.*[\/\\]/, '');
    }
    return;
}

export const ConversionDataTable = ({ dataSet, selectRow, hiddenBool }) => {
    return (
        <BootstrapTable data={dataSet} striped={true} hover={true} selectRow={selectRow}>
            <TableHeaderColumn dataField="ticketID" isKey={true} dataSort={true} width='30%'>DCI</TableHeaderColumn>
            <TableHeaderColumn dataFormat={statusCodeFormat} width='20%'>Status Code/Desc</TableHeaderColumn>
            <TableHeaderColumn dataFormat={returnCodeFormat} >Return Code/Desc</TableHeaderColumn>
            <TableHeaderColumn dataField="originalDocumentName" dataFormat={formatDocumentName} hidden={hiddenBool}>Document Name</TableHeaderColumn>
        </BootstrapTable>
    )
};
