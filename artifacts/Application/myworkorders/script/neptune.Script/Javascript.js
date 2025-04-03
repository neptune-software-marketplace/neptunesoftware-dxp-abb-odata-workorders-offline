// Triggered from cacheInitLoadFinished Event from WorkOrders MultiModel
function cacheInitLoadFinished() {
    //const orders = modelWorkOrders.getProperty("/orders") || [];
    const employee = modelWorkOrders.getProperty("/employee");

    // Retrieve SAP data only when online and no Work Orders in cache
    if (navigator.onLine) {
        if (!employee) {
            getEmployeeDetail().then(function (data) {
                modelWorkOrders.setProperty("/employee", data);
                const employeeNumber = data.EmployeeNumber.replace(/^0+/, "");
                getSAPWorkOrders(employeeNumber).then(function (orders) {
                    modelWorkOrders.setProperty("/orders", orders);
                    setCacheWorkOrders();
                });
            });
        }
    }
}

function getSAPWorkOrders(employeeNumber) {
    return new Promise(function (resolve, reject) {
        // Initialise ODataMaintenanceOrder
        if (!ODataMaintenanceOrder) {
            createODataMaintenanceOrder({});
        }

        // Filter on Responsible Person
        // (Hardcoded for now, in final application we will use another OData Service
        // to retrieve the Person Number for current SAP User)
        const filter = new sap.ui.model.Filter("MaintOrdPersonResponsible", "EQ", employeeNumber);
        const filters = [filter];

        // Read Work Orders
        ODataMaintenanceOrder.read("/C_ObjPgMaintOrder", {
            filters: filters,
            urlParameters: "$expand=to_MaintOrderOperation",
            success: function (data) {
                resolve(data.results);
            },
            error: function (error) {
                console.log(error);
                reject(error);
            },
        });
    });
}

function getEmployeeDetail() {
    return new Promise(function (resolve, reject) {
        // Initialise ODataMaintenanceOrder
        if (!ODataEmployeeDetail) {
            createODataEmployeeDetail({});
        }

        ODataEmployeeDetail.read("/EmployeeDetailSet", {
            success: function (data) {
                resolve(data.results[0]);
            },
            error: function (error) {
                console.log(error);
                reject(error);
            },
        });
    });
}

function sync() {

    // TODO get personell numbrer
    const orders = modelWorkOrders.getProperty("/orders");
    const completed = orders.filter((order) => order.MaintenanceProcessingPhase === "3");

    for (const order of completed) {
        order.to_MaintOrderOperation?.results?.forEach((operation) => {
            const urlParameters = {
                MaintenanceOrder: operation.MaintenanceOrder,
                MaintenanceOrderOperation: operation.MaintenanceOrderOperation,
                MaintenanceOrderSubOperation: operation.MaintenanceOrderSubOperation,
                Actualworkquantity: operation.Actual,
                Actualworkquantityunit: "HR",
                Isfinalconfirmation: false,
                Personnelnumber: 57,
                Postingdate: new Date(),
            };

            // First do Function and wait for response, then call CreatePdfAPI
            saveActualWork(urlParameters).then(function () {
                var options = {
                    data: order,
                };

                apiCreatePdfAPI(options).then(function () {
                    sap.m.MessageToast.show("Data is synced with SAP!");
                });

                
            });
        });
    }
}

function saveActualWork(urlParameters) {
    return new Promise(function (resolve, reject) {

        resolve();

        if (!ODataMaintenanceOrder) {
            createODataMaintenanceOrder({});
        }
        // TODO make a promise so I can catch success/errors outside of this and attach MessageToast
        ODataMaintenanceOrder.callFunction("/C_MaintOrderOpForActionCreatetimeconf", {
            method: "POST",
            urlParameters: urlParameters,
            success: function (response) {
                console.log("Success:", response);
                resolve(response);
            },
            error: function (error) {
                console.error("Error:", error);
                resolve(error);
            },
        });
    });
}

function translate() {
    const payload = {
        sourceLanguage: "en-US",
        targetLanguage: "de-DE",
        contentType: "text/plain",
        encoding: "plain",
        strictMode: "false",
        data: CommentsTextArea.getValue(),
    };
    var options = {
        data: payload,
    };

    apiTranslationHubAPI(options).then(function (response) {
        TranslatedTextArea.setValue(response.data);
    });
}

function fileUpload(oEvent, imageName) {
    var file = oEvent.getParameter("files")[0];
    try {
        if (file && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function (e) {
                openPhotoDialog(reader.result.split(",")[1], imageName);
            };
            reader.onerror = function (e) {
                console.error(e);
            };
            reader.readAsDataURL(file);
        }
    } catch (e) {
        console.error(e);
    }
}

function openPhotoDialog(imageData, imageName) {
    let image = "data:image/jpeg;base64," + imageData;

    if (!this.oSubmitDialog) {
        this.oSubmitDialog = new sap.m.Dialog({
            type: sap.m.DialogType.Message,
            title: "Photo upload",
            content: [
                new sap.m.Image({
                    src: image,
                }),
            ],
            beginButton: new sap.m.Button({
                type: sap.m.ButtonType.Emphasized,
                text: "Submit",
                press: function () {
                    modelWorkOrderDetailPage.setProperty("/Documents/" + imageName, image);
                    if (imageName === "BeforeImage") {
                        BeforeIconTabFilter.setIconColor("Positive");
                    } else {
                        AfterIconTabFilter.setIconColor("Positive");
                    }
                    setCacheWorkOrders();

                    this.oSubmitDialog.close();
                }.bind(this),
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function () {
                    this.oSubmitDialog.close();
                }.bind(this),
            }),
        });
    }

    this.oSubmitDialog.open();
}
