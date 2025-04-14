jQuery.sap.require("sap.m.MessageBox");

sap.m.MessageBox.warning("Refresh the data from SAP? Locally cached data will be overwritten when not synced yet", {
    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
    emphasizedAction: sap.m.MessageBox.Action.OK,
    onClose: function (action) {
        if (action === "OK") {
            const employeeNumber = "57";
            getSAPWorkOrders(employeeNumber).then(function (orders) {
                    modelWorkOrders.setProperty("/orders", orders);
                    setCacheWorkOrders();
                });
        }
    },
});