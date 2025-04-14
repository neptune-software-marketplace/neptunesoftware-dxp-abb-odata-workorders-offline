// Triggered from cacheInitLoadFinished Event from WorkOrders MultiModel
async function cacheInitLoadFinished() {
    // Retrieve SAP data only when online and no employee in cache
    if (navigator.onLine && !modelWorkOrders.getProperty("/employee")) {
        const employeeDetail = await getEmployeeDetail();
        modelWorkOrders.setProperty("/employee", employeeDetail);
        setCacheWorkOrders();
        loadSAPWorkOrders();
    }
}

async function loadSAPWorkOrders(){
    const employeeDetail = modelWorkOrders.getProperty("/employee");
    const employeeNumber = employeeDetail.EmployeeNumber.replace(/^0+/, "");
    const orders = await getSAPWorkOrders(employeeNumber);
    modelWorkOrders.setProperty("/orders", orders);
    setCacheWorkOrders();
}

// Sync function to send data back to SAP
function sync() {
    const employee = modelWorkOrders.getProperty("/employee");
    const orders = modelWorkOrders.getProperty("/orders");
    const completed = orders.filter((order) => order.MaintenanceProcessingPhase === "3");

    const workOrderChangesPromises = [];

    // First call the Function Imports and wait for response, then call CreatePdfAPI

    // Changes on Work Order Operations
    for (const order of completed) {
        order.to_MaintOrderOperation?.results?.forEach((operation) => {
            const employeeNumber = employee.EmployeeNumber.replace(/^0+/, "");

            const promiseSaveActualWork = saveActualWork(operation, employeeNumber); //.then(function () {

            workOrderChangesPromises.push(promiseSaveActualWork);
        });

        Promise.all(workOrderChangesPromises).then(function (results) {
            // Clear Assignment
            changeAssignment(order).then(function () {
                var options = {
                    data: order,
                };

                apiCreatePdfAPI(options).then(function () {
                    sap.m.MessageToast.show("Data is synced with SAP!");
                    getSAPWorkOrders().then(function () {
                       // Reload updated data from SAP
                       loadSAPWorkOrders();
                    });
                });
            });
            //workOrderChangesPromises.push(promiseChangeStatus);
        });
    }
}

// Translate function to call SAP Translation Hub API
async function translate() {

    const description = modelWorkOrderDetailPage.getProperty("/MaintenanceOrderDesc");

    const payload = {
        sourceLanguage: "en-US", 
        targetLanguage: "de-DE", 
        contentType: "text/plain",
        encoding: "plain",
        strictMode: "false",
        data: description,
    };
    var options = {
        data: payload,
    };

    await apiTranslationHubAPI(options).then(function (response) {
        modelWorkOrderDetailPage.setProperty("/Translation", response.data);
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

    const newDialog = new sap.m.Dialog({
        type: sap.m.DialogType.Message,
        title: "Photo upload",
        content: [
            new sap.m.Image({
                src: image,
                height: "95%",
                width: "95%"
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

                newDialog.close();
            },
        }),
        endButton: new sap.m.Button({
            text: "Cancel",
            press: function () {
                newDialog.close();
            },
        }),
    });

    newDialog.open();
}
