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
    Table.removeSelections(true);
    SelectDialog.getBinding("items").filter([]);

    App.setBusy(true);

    ODataSource.callFunction("/C_MaintOrderForActionChangeassgmt", {
        method: "POST",
        urlParameters: {
            MaintenanceOrder: order.MaintenanceOrder,
            MainWorkCenter: order.MainWorkCenter,
            MainWorkCenterPlant: order.MainWorkCenterPlant,
            MaintOrdPersonResponsible: personnelNumber,
            MaintenancePlannerGroup: order.MaintenancePlannerGroup,
        },
        success: function (oData) {
            App.setBusy(false);
            // Use MessageToast
            const text = `Order ${order.MaintenanceOrder} assigned to ${fullName}`;
            sap.m.MessageToast.show(text);
            // Refresh data
            getWorkOrders();
        },
        error: function (error) {
            App.setBusy(false);
            console.log(error);
        },
    });
}
