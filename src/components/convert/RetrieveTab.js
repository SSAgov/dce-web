import React, { Component, PropTypes } from "react";
import Form from "react-jsonschema-form";
import PacmanLoader from 'halogen/PacmanLoader';
import { ConversionDataTable } from "./BootstrapTables";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as convertActions from '../../actions/convertActions';
import './Convert.css'

class RetrieveTab extends Component {
    constructor(props) {
        super(props);
        this.state = { formData: {}, DCIRetrieveResult: [], loading: false, loadMessage: "Retrieving...", errorMessageDisplay: false, errorMessage: '' };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    DCIretrieveSchema = {
        type: 'object',
        properties: {
            appID: { type: 'string', title: 'App ID' },
            DCI: { type: 'string', title: 'DCI' },
        }
    }

    AppIDWidget = (props) => {
        let appIds = "AppIDs";
        return (
            <div>
                <input type="text" className="form-control" list="appID" placeholder="Select one..." onChange={(event) => props.onChange(event.target.value)} />
                <datalist id="appID">
                    {this.props.actionsObj.filterJsonData(appIds, this.props.convertDropDownDataObj).map((value, index) => { return <option key={index} value={value}>{value}</option> })}
                </datalist>
            </div>

        )
    }

    DCIretrieveUISchema = {
        appID: {
            'ui:widget': "hidden",
            classNames: "uiSchema",
        },
        DCI: {
            'ui:widget': "textarea",
            classNames: "uiSchema",
            "ui:options": {
                rows: 4
            },
            "ui:help": "**One DCI per line"
        }
    }


    handleSubmit({ formData }) {
        document.getElementById("DCIRetrieveTable").removeAttribute("hidden");
        this.setState({ loading: true, errorMessageDisplay: false, DCIRetrieveResult: [] });

        this.setState({ formData }, function () {
            var DCIRetrieveFormData = new FormData();

            DCIRetrieveFormData.append('appID', this.state.formData.appID);

            var DCIvalues = document.getElementById("root_DCI").value.split('\n');
            for (var DCI = 0; DCI < DCIvalues.length; DCI++) {
                DCIRetrieveFormData.append("ticketID", DCIvalues[DCI]);
            }

            this.props.actionsObj.convertRetrieveFetch(DCIRetrieveFormData, this.props.fetchTarget, "/File/Retrieve", (response) => {
                console.log("TESTTAB RETRIEVE RESPONSE::", response);
                this.setState({
                    DCIRetrieveResult: response.returnResult,
                    loading: response.loading,
                    errorMessageDisplay: response.errorMessageDisplay,
                    errorMessage: response.errorMessage
                });
            })
        });
    }


    render() {
        return (
            <div className="container" >
                <Form
                    schema={this.DCIretrieveSchema}
                    uiSchema={this.DCIretrieveUISchema}
                    formData={this.state.formData}
                    onChange={({ formData }) => { this.setState({ formData }); document.getElementById("DCIRetrieveTable").setAttribute("hidden", true); }}
                    onSubmit={this.handleSubmit}>

                    <div id="DCIRetrieveTable" hidden>
                        <label style={{ marginLeft: "5px" }}>Retrieve Result</label>
                        <ConversionDataTable dataSet={this.state.DCIRetrieveResult} hiddenBool={true} />
                    </div>
                    <div>
                        <button className="btn btn-info">Retrieve</button>
                    </div>
                </Form>
                <div style={{ marginLeft: "50%" }}>{this.state.loading ? <h4><PacmanLoader color='#265a88' />{this.state.loadMessage}</h4> : ""}</div>
                <br /> <br />
                <div className="conversionError" style={{ display: this.state.errorMessageDisplay ? "block" : "none" }}><h4>{this.state.errorMessage}</h4></div>
            </div >
        )
    }
}

RetrieveTab.propTypes = {
    convertDropDownDataObj: PropTypes.object.isRequired,
    actionsObj: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
        fetchTarget: state.fetchTarget,
        convertDropDownDataObj: state.convertDropDownData,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actionsObj: bindActionCreators(convertActions, dispatch)
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(RetrieveTab);