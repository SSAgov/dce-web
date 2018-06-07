import dataURLtoBlob from 'dataurl-to-blob';
import FileSaver from 'file-saver';
import fetch from 'isomorphic-fetch';
import * as types from './actionTypes';
import toastr from 'toastr';

export function mapConvertDropDownsSuccess(filteredJsonforDropdowns) {
    return { type: types.MAP_CONVERTDROPDOWNS_SUCCESS, filteredJsonforDropdowns }
}

export function mapConvertDropDownsErrored(bool) {
    return { type: types.MAP_CONVERTDROPDOWNS_ERRORED, hasErrored: bool }
}

export function filterJsonData(dropdownType, dataObj) {
    return dispatch => {
        var filteredJsonforDropdowns = dataObj.Configuration.filter(
            (dropdownName) => { return dropdownName.Setting === dropdownType });
        return filteredJsonforDropdowns[0].Values;
    }
}

export function saveFile(data, fileName) {
    return (dispatch) => {
        var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
            ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
            ieEDGE = navigator.userAgent.match(/Edge/g),
            ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

        if (ie && ieVer < 10) {
            console.log("No blobs on IE ver<10");
            return;
        }

        var mimeType = data.split(',')[0].split(':')[1].split(';')[0];
        var extension = '';
        if (mimeType.includes("zip")) {
            extension = "zip"
        }
        else {
            extension = mimeType.substr(mimeType.lastIndexOf('/') + 1);
        }

        var fileBlob = dataURLtoBlob(data);
        FileSaver.saveAs(fileBlob, fileName + "." + extension);

    }
}

export function hideHash(property, sizeLimit) {
    return dispatch => {
        var formLabels = document.getElementsByClassName("control-label");
        if (property > sizeLimit) {
            document.getElementById("hashDiv").setAttribute("hidden", true);

            for (var x = 0; x < formLabels.length; x++) {
                if (formLabels[x].innerHTML === "MD5 Hash") {
                    formLabels[x].style.display = "none";
                }
            }
        }
    }
}

export function getFileSize(elementId) {
    return dispatch => {
        var totalSize = 0;
        var allFiles = document.getElementById(elementId).files;
        if (typeof allFiles !== 'undefined') {
            for (var files = 0; files < allFiles.length; files++) {
                totalSize += allFiles[files].size
            }

            if (elementId === 'multiFileName') {
                dispatch(hideHash(totalSize, 100000000));
                //this.setState({ disabled:true }); //disable send
            }

            console.log("ACTIONS FILE SIZE::", totalSize);
            return totalSize;
        }
        else {
            return;
        }
    }
}

export function checkConversionSupport(fileFieldName, convertToFieldName, fileNames, callback) {
    return dispatch => {
        if (document.getElementById(fileFieldName).files[0] !== null && document.getElementById(fileFieldName).files[0] !== undefined) {
            var fileTypes = [],
                convertToType = document.getElementById(convertToFieldName).value,
                toPDFSupportedTypes = ['doc', 'docx', 'ps', 'rtf', 'tif', 'tiff', 'txt', 'wpd'],
                conversionSupportObj = {};


            //get file name(s)
            if (fileNames) {
                for (let fileType of fileNames) {
                    fileTypes.push(fileType.substr(fileType.lastIndexOf('.') + 1));
                }
            } else {
                var fileName = document.getElementById(fileFieldName).files[0].name;
                fileTypes.push(fileName.substr(fileName.lastIndexOf('.') + 1))
            }

            //check support
            if (convertToType.includes("OCR") && !fileTypes.every((extension) => extension === "pdf")) {
                conversionSupportObj = { fileTypeNotSupported: true, fileTypeNotSupportedMessage: "One or more files are not supported for OCR conversion. Please reselect file(s) of accepted formats: .pdf." }
                return callback(conversionSupportObj);
            }
            else if (convertToType.toUpperCase() === "PDF" && !fileTypes.every((extension) => toPDFSupportedTypes.includes(extension))) {
                conversionSupportObj = { fileTypeNotSupported: true, fileTypeNotSupportedMessage: "One or more files are not supported for PDF conversion. Please reselect file(s) of accepted formats: .doc, .docx, .ps, .rtf, .tif/.tiff, .txt, .wpd." }
                return callback(conversionSupportObj);
            }
            else {
                conversionSupportObj = { fileTypeNotSupported: false }
                return callback(conversionSupportObj);
            }
        }
    }
}

function resetErrorStyling() {
    //error message below field
    let formErrors = document.getElementsByClassName("text-danger");
    for (var errorMesssage = 0; errorMesssage < formErrors.length; errorMesssage++) {
        formErrors[errorMesssage].style.display = "";
    }

    //box outline, label color
    let divClassNames = document.getElementsByClassName("validateField uiSchema");
    for (var divError = 0; divError < divClassNames.length; divError++) {
        divClassNames[divError].className = "validateField form-group field field-string has-error uiSchema";
    }
}

export function validate(formData, errors) {
    return dispatch => {
        if (document.getElementById("envType")) {
            resetErrorStyling();
            if (formData.envType === undefined || formData.envType === '') {
                errors.envType.addError("Environment type is required.");
            }
        }
        else {
            resetErrorStyling();
            if (formData.convertTo === undefined || formData.convertTo === '') {
                errors.convertTo.addError("Convert to type is required.");
            }
            if (formData.file === undefined || formData.file === '') {
                errors.file.addError("A file is required.");
            }
        }
        return errors;
    }
}

export function removeValidationErrors() {
    return dispatch => {
        //error message below field
        let formErrors = document.getElementsByClassName("text-danger");
        for (var errorMesssage = 0; errorMesssage < formErrors.length; errorMesssage++) {
            formErrors[errorMesssage].style.display = "none";
        }

        //box outline, label color
        let divClassNames = document.getElementsByClassName("has-error");
        while (divClassNames.length > 0) {
            divClassNames[0].className = "validateField uiSchema";
        }
    }
}

function getConvertedFileCount(responseObject) {

    let convertedFileCount = 0;

    for (let objectNum = 0; objectNum < responseObject.length; objectNum++) {
        if (responseObject[objectNum].statusCode === '0003' || responseObject[objectNum].statusCode === '0005') {
            convertedFileCount++;
        }
    }

    if (convertedFileCount === responseObject.length) {
        return toastr.success('You have successfully converted all your documents.', '', { timeOut: 8000, closeButton: true });
    }
    else {
        return toastr.info('You have downloaded ' + convertedFileCount + ' of your documents. Continue to click the Retrieve button to download your remaining documents.', '', { timeOut: 9000, closeButton: true });
    }
}

//hash thunk
export function getHash(hashFormData, fetchTarget, callback) {
    return dispatch => {

        fetch(fetchTarget + "/File/MD5Hash", {
            method: 'POST',
            //mode: 'cors',
            credentials: 'include',
            body: hashFormData
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            return response.text();

        }).then(response => {
            document.getElementById("hashCodeDisplay").value = response.replace(/['"]+/g, '');
            document.getElementById("hashLoading").setAttribute("hidden", true);
        }).catch((error) => {
            console.log("CATCH ERROR:: ", error.message);
            document.getElementById("hashLoading").setAttribute("hidden", true);
            var errorObj = { errorMessageDisplay: true, errorMessage: error.message }
            return callback(errorObj);
        })
    }
}

//global convert thunk
export function convertRetrieveFetch(retrieveFormData, fetchTarget, targetExtension, callback) {
    return dispatch => {
        return (
            fetch(fetchTarget + targetExtension, {
                method: 'post',
                //mode: 'cors',
                credentials: 'include',
                body: retrieveFormData
            }).then(response => {
                if (response.status >= 400) {
                    throw new Error(response.statusText);
                }
                return response.text();
            }).then(response => {
                var responseObj = JSON.parse(response);

                //toastr on base convert
                if (targetExtension.indexOf("Convert") !== -1) {
                    if (responseObj[0].ReturnDocument) {
                        getConvertedFileCount(responseObj);
                    }
                }

                //handle multi-retrieve
                if (targetExtension.indexOf("Retrieve") !== -1) {
                    for (let array of responseObj) {
                        if (array.ReturnDocument) {
                            if (responseObj.length > 1) {
                                dispatch(saveFile(responseObj[0].ReturnDocument, "testFiles_download"));
                            } else {
                                dispatch(saveFile(responseObj[0].ReturnDocument, responseObj[0].ticketID));
                            }
                            getConvertedFileCount(responseObj);
                        }
                    }
                }

                var returnObject = { returnResult: responseObj, loading: false };
                return callback(returnObject);
            }).catch((error) => {
                console.log("CATCH ERROR:: ", error);
                var errorObj = { loading: false, errorMessageDisplay: true, errorMessage: error.message }
                return callback(errorObj);
            })
        );
    }
}
