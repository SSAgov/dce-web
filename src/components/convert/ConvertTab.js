import React, { Component, PropTypes } from "react";
import Form from "react-jsonschema-form";
import PacmanLoader from 'halogen/PacmanLoader';
import { Popover, OverlayTrigger, Glyphicon } from 'react-bootstrap';
import { ConversionDataTable } from './BootstrapTables';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as convertActions from '../../actions/convertActions';
import './Convert.css'

let arrayOfBaseFileNames = [];

const fileWidgetPopup = (
    <Popover id="popover-trigger-hover-focus" title={<span><Glyphicon className="multiConvertGlyphicon" glyph="info-sign" /> Supported File Types</span>}>
        Select one or more files. Only certain file types are accepted to convert to PDF and OCR.<br /><strong>to PDF: </strong> .doc, .docx, .ps, .rtf, .tiff/.tif, .txt, .wpd. <br /><strong>OCR: </strong> .pdf.
  </Popover>
);

class ConvertTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {}, loading: false, uncaughtErrorMessageDisplay: false, fileSize: 0, conversionErrorMessage: '',
            conversionErrorMessageDisplay: false, baseFileSize: 0, fileTypeNotSupportedMessage: '', fileTypeNotSupported: false,
            populatedBaseUISchema: {}, errorStyle: '', baseConvertResult: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ populatedBaseUISchema: this.baseUISchema });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.convertToTypes !== this.props.convertToTypes) {
            await this.setState({ populatedBaseUISchema: {} });
            this.setState({ populatedBaseUISchema: this.baseUISchema });
        }
    }

    handleSubmit({ formData }) {
        if (this.state.fileSize <= 2147483648) {
            this.props.actionsObj.removeValidationErrors();
            document.getElementById("baseConvertTable").removeAttribute("hidden");
            this.setState({ loading: true, uncaughtErrorMessageDisplay: false, conversionErrorMessageDisplay: false, baseConvertResult: [] });
            this.setState({ formData }, function () {
                var baseConvertFormData = new FormData();
                baseConvertFormData.append("appID", this.state.formData.appID);
                baseConvertFormData.append("convertTo", this.state.formData.convertTo);

                var baseFiles = document.getElementById('baseFileName').files;
                for (var x = 0; x < baseFiles.length; x++) {
                    baseConvertFormData.append("file" + x, baseFiles[x]);
                }

                console.log("BASECONVERT_TARGET::", this.props.fetchTarget + "File/Convert");

                this.props.actionsObj.convertRetrieveFetch(baseConvertFormData, this.props.fetchTarget, "File/Convert", (response) => {
                    this.setState({
                        baseConvertResult: response.returnResult,
                        loading: response.loading,
                        uncaughtErrorMessageDisplay: response.errorMessageDisplay
                    })

                    if (response.returnResult[0].statusCode === '0000' || response.returnResult[0].statusCode === '0001' || response.returnResult[0].statusCode === '0002' || response.returnResult[0].statusCode === '0004') {
                        console.log("STATUS CODE:: ", response.returnResult[0].statusCode);
                        this.setState({ conversionErrorMessageDisplay: true, errorStyle: 'informationalError' })
                        if (response.returnResult[0].TicketID) {
                            this.setState({ conversionErrorMessage: "Your document conversion has timed out in DCE. Please try again later using the Retrieve tab if you like with your DCI: " + response.returnResult[0].TicketID + ". If this issue continues, use the Test tab to diagnose any possible problems in the DCE environment or contact someone from the DCE support team (links under contacts menu)." });
                        }
                        else {
                            this.setState({ conversionErrorMessage: "Your document conversion has timed out in DCE. Please try again later. If this issue continues, use the Test tab to diagnose any possible problems in the DCE environment or contact someone from the DCE support team (links under contacts menu) for assistance." });
                        }


                    }
                    else if (response.returnResult[0].statusCode === '0003' || response.returnResult[0].statusCode === '0005' || response.returnResult[0].statusCode === '0006') {
                        console.log("STATUS CODE:: ", response.returnResult[0].statusCode);
                        if (response.returnResult.length > 1) {
                            this.props.actionsObj.saveFile(response.returnResult[0].ReturnDocument, "convertedFiles_download");
                        }
                        else {
                            this.props.actionsObj.saveFile(response.returnResult[0].ReturnDocument, response.returnResult[0].ticketID);
                        }
                    }
                    else if (response.returnResult[0].statusCode === '1000' && response.returnResult[0].returnCode === '0000') {
                        this.setState({ conversionErrorMessageDisplay: true, errorStyle: 'informationalError' })
                        if (response.returnResult[0].TicketID) {
                            this.setState({ conversionErrorMessage: "Your document conversion has timed out in DCE. Please try again later using the Retrieve tab if you like with your DCI: " + response.returnResult[0].TicketID + ". If this issue continues, use the Test tab to diagnose any possible problems in the DCE environment or contact someone from the DCE support team (links under contacts menu)." });
                        }
                        else {
                            this.setState({ conversionErrorMessage: "Your document conversion has timed out in DCE. Please try again later. If this issue continues, use the Test tab to diagnose any possible problems in the DCE environment or contact someone from the DCE support team (links under contacts menu) for assistance." });

                        }
                    }
                    else {
                        //(returnObject[0].statusCode === '1000' || returnObject[0].statusCode === '1006') 
                        console.log("STATUS CODE:: ", response.returnResult[0].statusCode);
                        this.setState({
                            conversionErrorMessageDisplay: true,
                            errorStyle: 'conversionError',
                            conversionErrorMessage: "DCE was unable to convert your document. Error " + response.returnResult[0].returnCode + ": " + response.returnResult[0].returnCodeDescription
                        })
                    }
                });
            });
        }
    }


    checkConversionSupport() {
        this.props.actionsObj.checkConversionSupport("baseFileName", "baseConvertTo", arrayOfBaseFileNames, (response) => {
            console.log("REPSONSE::", response);
            this.setState({ fileTypeNotSupported: response.fileTypeNotSupported, fileTypeNotSupportedMessage: response.fileTypeNotSupportedMessage });
        });
    }


    /**JSONSCHEMA FORM VARIABLES **/

    baseSchema = {
        type: 'object',
        properties: {
            file: { type: 'string', format: 'data-url', title: 'File' },
            convertTo: { type: 'string', title: 'Convert To' },
            appID: { type: 'string', title: 'App ID', default: 'DDB' }
        }
    }

    dropdownWidget = (props, type, id) => {
        return (
            <div>
                <input id={id} type="text" className="form-control" list={type} placeholder="Select one..." onChange={(event) => props.onChange(event.target.value)} />
                <datalist id={type}>
                    {this.props.actionsObj.filterJsonData(type, this.props.convertDropDownDataObj).map((value, index) => { return <option key={index} value={value}>{value}</option> })}
                </datalist>
            </div>
        )
    }

    BaseFileWidget = (props) => {
        return (
            <div>
                <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={fileWidgetPopup}>
                    <input type="file" id="baseFileName" required={props.required} onChange={(event) => { props.onChange(event.target.value); this.getFileNames() }} multiple />
                </OverlayTrigger>
                <textarea id="baseFileNameList" className="form-control" rows="4" style={{ marginTop: "2%" }} readOnly />
            </div>
        )
    }

    baseUISchema = {
        appID: {
            'ui:widget': "hidden",
            classNames: "uiSchema"
        },
        convertTo: {
            'ui:widget': (props) => this.dropdownWidget(props, "ConvertToTypes", "baseConvertTo"),
            classNames: "uiSchema"
        },
        file: {
            'ui:widget': this.BaseFileWidget,
            classNames: "uiSchema"
        }
    }

    getFileNames() {
        let fileCount = 0,
            files = document.getElementById("baseFileName").files;
        arrayOfBaseFileNames = [];

        for (let i = 0; i < files.length; i++) {
            fileCount++;
            if (arrayOfBaseFileNames.indexOf(files.item(i).name) < 1) {
                arrayOfBaseFileNames.push(files.item(i).name);
            }
        }
        document.getElementById("baseFileNameList").value = arrayOfBaseFileNames.join("\n");
        console.log("FILE COUNT:: ", fileCount);
    }

    render() {
        return (
            <div className="container">
                <Form
                    schema={this.baseSchema}
                    uiSchema={this.state.populatedBaseUISchema}
                    formData={this.state.formData}
                    validate={this.props.actionsObj.validate}
                    showErrorList={false}
                    onChange={({ formData }) => { this.setState({ formData }); this.setState({ fileSize: this.props.actionsObj.getFileSize("baseFileName") }); this.checkConversionSupport(); document.getElementById("baseConvertTable").setAttribute("hidden", true); }}
                    onSubmit={this.handleSubmit}
                >
                    <div id="baseConvertTable" hidden>
                        <label style={{ marginLeft: "5px" }}>Convert Result</label>
                        <ConversionDataTable dataSet={this.state.baseConvertResult} hiddenBool={false} />
                    </div>

                    <div style={{ marginLeft: "50%" }}>{this.state.loading ? <h4><PacmanLoader color='#265a88' />Converting...</h4> : ""}</div>
                    <div className="conversionError" style={{ display: this.state.uncaughtErrorMessageDisplay ? "block" : "none" }}><h4>Uh Oh! Looks like an error occurred. Please try again. If you continue to have issues use the contact links for help.</h4></div>
                    <div className={this.state.errorStyle} style={{ display: this.state.conversionErrorMessageDisplay ? "block" : "none" }}><h4>{this.state.conversionErrorMessage}</h4></div>
                    <div className="conversionError" style={{ display: this.state.fileSize > 2147483648 ? "block" : "none" }}><h4>File size exceeded. Please remove or reselect files.</h4></div>
                    <div className="conversionError" style={{ display: this.state.fileTypeNotSupported ? "block" : "none" }}><h4>{this.state.fileTypeNotSupportedMessage}</h4></div>

                    <div>
                        <button id="baseConvertButton" type="submit" className="btn btn-info">Convert</button>
                    </div>
                </Form>
            </div>
        )
    }
}

ConvertTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ConvertTab);