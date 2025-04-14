sap.ui.getCore().attachInit(function (startParams) {
    // Initialize OData Model
    createODataSource({});

    getWorkOrders();
    getODataSelectDialog();
});

function getWorkOrders() {
    App.setBusy(true);
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const isoDate = date.toISOString().slice(0, 19);

    var filter = new sap.ui.model.Filter({
        filters: [
            new sap.ui.model.Filter("CreationDate", "GT", isoDate),
            new sap.ui.model.Filter("MaintenanceProcessingPhase", "EQ", "2"),
        ],
        and: true,
    });

    getODataTable("/C_ObjPgMaintOrder", {
        filters: [filter],
    });
}

function assignTechnician(order, personnelNumber, fullName) {
    return new Promise(function (resolve, reject) {
        ODataSource.callFunction("/C_MaintOrderForActionChangeassgmt", {
            method: "POST",
            urlParameters: {
                MaintenanceOrder: order.MaintenanceOrder,
                MainWorkCenter: order.MainWorkCenter,
                MainWorkCenterPlant: order.MainWorkCenterPlant,
                MaintOrdPersonResponsible: personnelNumber,
                MaintenancePlannerGroup: order.MaintenancePlannerGroup,
            },
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                console.log(error);
                reject(error);
            },
        });
    });
}
