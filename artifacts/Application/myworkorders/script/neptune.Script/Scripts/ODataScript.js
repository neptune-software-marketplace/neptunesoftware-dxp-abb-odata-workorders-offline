// Read C_ObjPgMaintOrder EntitySet which contains Maintenance Orders
// Filter on Responsible Person
// Expand to MaintOrderOperation
function getSAPWorkOrders(employeeNumber) {
    return new Promise(function (resolve, reject) {
        // Initialise ODataMaintenanceOrder
        if (!ODataMaintenanceOrder) {
            createODataMaintenanceOrder({});
        }

        // Filter on Responsible Person
        const filterEmployee = new sap.ui.model.Filter("MaintOrdPersonResponsible", "EQ", employeeNumber);
        const filterPhase = new sap.ui.model.Filter("MaintenanceProcessingPhase", "EQ", "2");
        const filters = [filterEmployee, filterPhase];

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

// Function Import C_MaintOrderOpForActionCreatetimeconf
// Save Actual Work on Work Order
function saveActualWork(operation, employeeNumber) {
    return new Promise(function (resolve, reject) {
        if (!ODataMaintenanceOrder) {
            createODataMaintenanceOrder({});
        }

        const urlParameters = {
            MaintenanceOrder: operation.MaintenanceOrder,
            MaintenanceOrderOperation: operation.MaintenanceOrderOperation,
            MaintenanceOrderSubOperation: operation.MaintenanceOrderSubOperation,
            Actualworkquantity: operation.Actual,
            Actualworkquantityunit: "HR",
            Isfinalconfirmation: false,
            Personnelnumber: employeeNumber,
            Postingdate: new Date(),
        };

        ODataMaintenanceOrder.callFunction("/C_MaintOrderOpForActionCreatetimeconf", {
            method: "POST",
            urlParameters: urlParameters,
            success: function (response) {
                console.log("Success:", response);
                resolve(response);
            },
            error: function (error) {
                console.error("Error:", error);
                reject(error);
            },
        });
    });
}

// Function Import C_MaintOrderForActionChangeassgmt
// Change Assignment of Work Order
function changeAssignment(order) {
    return new Promise(function (resolve, reject) {
        if (!ODataMaintenanceOrder) {
            createODataMaintenanceOrder({});
        }

        const urlParameters = {
            MaintenanceOrder: order.MaintenanceOrder,
            MainWorkCenter: order.MainWorkCenter,
            MainWorkCenterPlant: order.MainWorkCenterPlant,
            MaintOrdPersonResponsible: "",
            MaintenancePlannerGroup: order.MaintenancePlannerGroup,
        };

        ODataMaintenanceOrder.callFunction("/C_MaintOrderForActionChangeassgmt", {
            method: "POST",
            urlParameters: urlParameters,
            success: function (response) {
                console.log("Success:", response);
                resolve(response);
            },
            error: function (error) {
                console.error("Error:", error);
                reject(error);
            },
        });
    });
}

// Read EmployeeDetailSet
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
