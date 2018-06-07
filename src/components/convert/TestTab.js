import React, { Component, PropTypes } from "react";
import Form from "react-jsonschema-form";
import PacmanLoader from 'halogen/PacmanLoader';
import PulseLoader from 'halogen/PulseLoader';
import { Popover, OverlayTrigger, Glyphicon } from 'react-bootstrap';
import { ConversionDataTable } from './BootstrapTables';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as convertActions from '../../actions/convertActions';
import './Convert.css'

var selectedFiles = [],
    fileCount = 0,
    arrayOfTestFileNames = [],
    formLabels = document.getElementsByClassName("control-label");


const fileWidgetPopup = (
    <Popover id="popover-trigger-hover-focus" title={<span><Glyphicon className="multiConvertGlyphicon" glyph="info-sign" /> Supported File Types</span>}>
        Select one or more files. Only certain file types are accepted to convert to PDF and OCR.<br /><strong>to PDF: </strong> .doc, .docx, .ps, .rtf, .tiff/.tif, .txt, .wpd. <br /><strong>OCR: </strong> .pdf.
  </Popover>
);

const downloadButtonPopup = (
    <Popover id="popover-trigger-hover-focus">
        <Glyphicon className="multiConvertGlyphicon" glyph="info-sign" /> Continue to click Retrieve until all your files have a "Converted" status.
</Popover>
)

const websNotificationPopup = (
    <Popover id="popover-trigger-hover-focus" title={<span><Glyphicon className="multiConvertGlyphicon" glyph="info-sign" /> Retrieval via <strong>WEBS</strong></span>}>
        Webs Notification you will need to verify manually.  This app will not auto retrieve your WEBS Notification.  To verify if WEBS Notification went through consider using the DCE Support Utility Set Document Status component (standalone application) to verify status.  You can still use the manual retrieve option below to get your document back if you like.
      </Popover>
)

const appIDPopup = (
    <Popover id="popover-trigger-hover-focus" title={<span><Glyphicon className="multiConvertGlyphicon" glyph="info-sign" /> App IDs</span>}>
        The most commonly used App IDs are listed here, but any <strong>3</strong> character ID is accepted.
      </Popover>
)


class TestTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            populatedMultiUISchema: {}, formData: {}, clickedID: '',
            convertResult: [], retrieveResult: [], loading: false, loadMessage: '', errorMessageDisplay: false, errorMessage: '', totalFileSize: 0,
            selectedFilesStateObj: [], fileTypeNotSupported: false, fileTypeNotSupportedMessage: '', disabled: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGetButtonID = this.handleGetButtonID.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.hideResultTables = this.hideResultTables.bind(this);
    }

    componentDidMount() {
        this.setState({ populatedMultiUISchema: this.multiUISchema });
    }

    handleGetButtonID(event) {
        this.setState({ clickedID: event.target.id });
    }

    handleSubmit({ formData }) {
        if (this.state.totalFileSize <= 2147483648) {
            this.props.actionsObj.removeValidationErrors();
            if (this.state.clickedID === "multiConvert") {
                document.getElementById("convertResultTable").removeAttribute("hidden");
                document.getElementById("retrieveResultTable").setAttribute("hidden", true);
                selectedFiles = [];
                this.setState({ convertResult: [], retrieveResult: [], loading: true, loadMessage: "Converting...", errorMessageDisplay: false, disabled: true });

                this.setState({ formData }, function () {
                    var convertFormData = new FormData();
                    convertFormData.append("appID", this.state.formData.appID);
                    convertFormData.append("convertTo", this.state.formData.convertTo);

                    var multiFiles = document.getElementById('multiFileName').files;
                    for (var x = 0; x < multiFiles.length; x++) {
                        convertFormData.append("file" + x, multiFiles[x]);
                    }

                    //console.log(document.getElementById("hashCodeDisplay").value);

                    //convertFormData.append("hash", document.getElementById("hashCodeDisplay").value);
                    convertFormData.append("notification", this.state.formData.notification);
                    convertFormData.append("contextID", this.state.formData.contextID);
                    convertFormData.append("consumerID", this.state.formData.consumerID);
                    convertFormData.append("envtype", this.state.formData.envType);
                    convertFormData.append("downloadoption", "no");

                    console.log("MULTICONVERT_TARGET::", this.props.fetchTarget)

                    this.props.actionsObj.convertRetrieveFetch(convertFormData, this.props.fetchTarget, "File/TestConvert", (response) => {
                        console.log("TESTTAB CONVERT RESPONSE::", response);
                        this.setState({
                            convertResult: response.returnResult,
                            loading: response.loading,
                            errorMessageDisplay: response.errorMessageDisplay,
                            errorMessage: response.errorMessage
                        });
                    })
                })
            }
            else if (this.state.clickedID === "multiRetrieve") {
                document.getElementById("retrieveResultTable").removeAttribute("hidden");
                this.setState({ loading: true, loadMessage: "Retrieving...", errorMessageDisplay: false });
                this.setState({ formData }, function () {
                    var retrieveFormData = new FormData();
                    retrieveFormData.append("appID", this.state.formData.appID);

                    var ticketNum;
                    if (selectedFiles.length) {
                        //console.log("DEFINED::");
                        for (ticketNum = 0; ticketNum < selectedFiles.length; ticketNum++) {
                            retrieveFormData.append("ticketID" + ticketNum, selectedFiles[ticketNum].ticketID);
                        }
                    }

                    else {
                        //console.log("UNDEFINED::");
                        for (ticketNum = 0; ticketNum < this.state.selectedFilesStateObj.length; ticketNum++) {
                            retrieveFormData.append("ticketID" + ticketNum, this.state.selectedFilesStateObj[ticketNum].ticketID);
                        }
                    }

                    retrieveFormData.append("contextID", this.state.formData.contextID);
                    retrieveFormData.append("consumerID", this.state.formData.consumerID);
                    retrieveFormData.append("envtype", this.state.formData.envType);

                    this.props.actionsObj.convertRetrieveFetch(retrieveFormData, this.props.fetchTarget, "File/TestRetrieve", (response) => {
                        console.log("TESTTAB RETRIEVE RESPONSE::", response);
                        this.setState({
                            retrieveResult: response.returnResult,
                            loading: response.loading,
                            errorMessageDisplay: response.errorMessageDisplay,
                            errorMessage: response.errorMessage
                        });
                    })
                });
            }
            else {
                this.setState({ errorMessageDisplay: false });
                document.getElementById("hashLoading").removeAttribute("hidden");
                this.setState({ formData }, function () {
                    var hashFormData = new FormData();
                    hashFormData.append("file", document.getElementById('multiFileName').files[0]);
                    console.log("HASH_TARGET::", this.props.fetchTarget)
                    this.props.actionsObj.getHash(hashFormData, this.props.fetchTarget, (response) => {
                        this.setState({ errorMessage: response.errorMessage, errorMessageDisplay: response.errorMessageDisplay });
                    });
                });
            }
        }
    }

    checkConversionSupport() {
        this.props.actionsObj.checkConversionSupport("multiFileName", "multiConvertTo", arrayOfTestFileNames, (response) => {
            this.setState({ fileTypeNotSupported: response.fileTypeNotSupported, fileTypeNotSupportedMessage: response.fileTypeNotSupportedMessage });
        });
    }

    //**JSON SCHEMA FORM VARIABLES**//

    multiSchema = {
        type: 'object',
        properties: {
            file: { type: 'string', format: 'data-url', title: "File" },
            convertTo: { type: 'string', title: 'Convert To' },
            envType: { type: 'string', title: 'DCE EnvType' },
            contextID: { type: 'string', title: 'Context ID' },
            consumerID: { type: 'string', title: 'Consumer ID' },
            hash: { type: "string", title: "MD5 Hash" },
            appID: { type: 'string', title: 'App ID' },
            notification: { type: "string", title: "Notification" }
        }
    }

    dropdownWidget = (props, type, id) => {
        return (
            <div>
                <input id={id} type="text" className="form-control" list={type} placeholder="Select one..." onChange={(event) => { props.onChange(event.target.value); this.hideResultTables(event.target.id) }} />
                <datalist id={type}>
                    {this.props.actionsObj.filterJsonData(type, this.props.convertDropDownDataObj).map((value, index) => { return <option key={index} value={value}>{value}</option> })}
                </datalist>
            </div>
        )
    }

    multiFileWidget = (props) => {
        return (
            <div>
                <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={fileWidgetPopup}>
                    <input type="file" id="multiFileName" onChange={(event) => { props.onChange(event.target.value); this.getFileNames(); this.hideResultTables(event.target.id) }} multiple />
                </OverlayTrigger>
                <textarea id="multiFileNameList" className="form-control" rows="4" style={{ marginTop: "2%" }} readOnly />
            </div>
        )
    }

    hashWidget = (props) => {
        return (
            <div id="hashDiv">
                <input type="text" id="hashCodeDisplay" style={{ marginLeft: 0, marginTop: 5, width: "80%" }} className="form-control" onChange={(event) => { props.onChange(event.target.value); this.hideResultTables(event.target.id) }} />
                <button id="generateHash" className="btn btn-primary" onClick={this.handleGetButtonID} style={{ marginLeft: "85%", marginTop: "-10%" }}>Generate</button>
                <div id="hashLoading" hidden style={{ marginLeft: "35%" }}><h4><PulseLoader color='#265a88' />Generating...</h4></div>
            </div>
        )
    }

    dropdownTooltipWidget = (props, type, id, tooltip) => {
        return (
            <div>
                <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={tooltip} hidden>
                    <input id={id} type="text" className="form-control" list={type} placeholder="Select one..." onChange={(event) => { props.onChange(event.target.value); this.hideResultTables(event.target.id) }} />
                </OverlayTrigger>
                <datalist id={type}>
                    {this.props.actionsObj.filterJsonData(type, this.props.convertDropDownDataObj).map((value, index) => { return <option key={index} value={value}>{value}</option> })}
                </datalist>
            </div>
        )
    }

    multiUISchema = {
        file: {
            'ui:widget': this.multiFileWidget,
            classNames: "uiSchema",
        },
        hash: {
            'ui:widget': this.hashWidget,
            classNames: "uiSchema"
        },
        appID: {
            'ui:widget': (props) => this.dropdownTooltipWidget(props, "AppIDs", "appIDs", appIDPopup),
            classNames: "uiSchema"
        },
        convertTo: {
            'ui:widget': (props) => this.dropdownWidget(props, "ConvertToTypes", "multiConvertTo"),
            classNames: "uiSchema"
        },
        notification: {
            'ui:widget': (props) => this.dropdownTooltipWidget(props, "NotificationType", "notification", websNotificationPopup),
            classNames: "uiSchema"
        },
        contextID: {
            'ui:widget': (props) => this.dropdownWidget(props, "ContextIDs", "contextIDs"),
            classNames: "uiSchema"
        },
        consumerID: {
            'ui:widget': (props) => this.dropdownWidget(props, "ConsumerIDs", "consumerIDs"),
            classNames: "uiSchema"
        },
        envType: {
            'ui:widget': (props) => this.dropdownWidget(props, "EnvironmentTypes", "envType"),
            classNames: "uiSchema"
        }
    }

    getFileNames() {
        arrayOfTestFileNames = [];
        document.getElementById("hashCodeDisplay").value = "";

        fileCount = 0;
        var files = document.getElementById("multiFileName").files;
        for (var i = 0; i < files.length; i++) {
            fileCount++;
            if (arrayOfTestFileNames.indexOf(files.item(i).name) < 1) {
                arrayOfTestFileNames.push(files.item(i).name);
            }
        }
        document.getElementById("multiFileNameList").value = arrayOfTestFileNames.join("\n");
        console.log("FILE COUNT:: ", fileCount);

        this.props.actionsObj.hideHash(fileCount, 1);

        if (fileCount <= 1) {
            document.getElementById("hashDiv").removeAttribute("hidden");

            for (var y = 0; y < formLabels.length; y++) {
                if (formLabels[y].innerHTML === "MD5 Hash") {
                    formLabels[y].style.display = "inline-block";
                }
            }
        }
    }

    hideResultTables(targetId) {
        if (document.getElementById("convertResultTable").offsetHeight > 0) {
            if (targetId === 'multiFileName' || targetId === 'multiConvertTo') {
                selectedFiles = [];
                document.getElementById("convertResultTable").setAttribute("hidden", true);
                document.getElementById("retrieveResultTable").setAttribute("hidden", true);
                this.setState({ disabled: true })
            }
        }
    }


    //**BOOTSTRAP TABLE**//
    onRowSelect(row, isSelected) {
        if (isSelected) {
            selectedFiles.push(row);
            this.setState({ disabled: false, selectedFilesStateObj: selectedFiles })
        }
        else {
            selectedFiles.splice(selectedFiles.indexOf(row), 1);
            this.setState({ selectedFilesStateObj: selectedFiles });
            if (selectedFiles.length === 0) {
                this.setState({ disabled: true })
            }
        }
    }

    onSelectAll(isSelected, rows) {
        if (isSelected) {
            selectedFiles.push(rows);
            console.log(selectedFiles);
            console.log(selectedFiles[0])
            selectedFiles = selectedFiles[0];

            this.setState({ disabled: false, selectedFilesStateObj: selectedFiles })
        }
        else {
            selectedFiles = [];
            this.setState({ selectedFilesStateObj: selectedFiles, disabled: true });
        }
    }


    render() {

        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            bgColor: function (row, isSelect) {
                if (isSelect) {
                    return '#ffffb3';
                }
                return null;
            }
        };

        return (
            <div className="container" >
                <Form
                    schema={this.multiSchema}
                    uiSchema={this.state.populatedMultiUISchema}
                    formData={this.state.formData}
                    validate={this.props.actionsObj.validate}
                    showErrorList={false}
                    onChange={({ formData }) => { this.setState({ formData, totalFileSize: this.props.actionsObj.getFileSize("multiFileName") }); this.checkConversionSupport() }}
                    onSubmit={this.handleSubmit}
                >
                    <div id="convertResultTable" hidden>
                        <label style={{ marginLeft: "5px" }}>Convert Result</label>
                        <Glyphicon className="multiConvertGlyphicon" style={{ marginLeft: "11%", marginBottom: "4%" }} glyph="info-sign" /><strong> Select one or more files to retrieve</strong>
                        <ConversionDataTable dataSet={this.state.convertResult} selectRow={selectRowProp} hiddenBool={false} />
                    </div>
                    <div id="retrieveResultTable" hidden>
                        <label style={{ marginLeft: "5px" }}>Retrieve Result</label>
                        <ConversionDataTable dataSet={this.state.retrieveResult} hiddenBool={true} />
                    </div>
                    <div>
                        <button id="multiConvert" className="btn btn-info" onClick={this.handleGetButtonID}>Send</button>
                        <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={downloadButtonPopup}>
                            <button id="multiRetrieve" className="btn btn-info" onClick={this.handleGetButtonID} disabled={this.state.disabled}>Retrieve</button>
                        </OverlayTrigger>
                    </div>
                </Form>
                <div style={{ marginLeft: "50%" }}>{this.state.loading ? <h4><PacmanLoader color='#265a88' />{this.state.loadMessage}</h4> : ""}</div>
                <br /> <br />
                <div className="conversionError" style={{ display: this.state.errorMessageDisplay ? "block" : "none" }}><h4>{this.state.errorMessage}</h4></div>
                <div className="conversionError" style={{ display: this.state.totalFileSize > 2147483648 ? "block" : "none" }}><h4>File size exceeded. Please remove or reselect files.</h4></div>
                <div className="conversionError" style={{ display: this.state.fileTypeNotSupported ? "block" : "none" }}><h4>{this.state.fileTypeNotSupportedMessage}</h4></div>
            </div >
        )
    }
}

TestTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TestTab);