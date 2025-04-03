jQuery.sap.require("sap.m.MessageBox");

sap.m.MessageBox.warning("Refresh the data from SAP?", {
    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
    emphasizedAction: sap.m.MessageBox.Action.OK,
    onClose: function (action) {
        if (action === "OK") {
            getSAPWorkOrders();
        }
    },
});