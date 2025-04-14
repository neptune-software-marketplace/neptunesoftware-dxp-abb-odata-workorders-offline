const aContexts = oEvent.getParameter("selectedContexts");
const personnelNumber = aContexts[0].getProperty("PersonnelNumber");
const fullName = aContexts[0].getProperty("EmployeeFullName");

App.setBusy(true);

Table.getSelectedContexts().forEach((context) => {
    const order = context.getObject();
    assignTechnician(order, personnelNumber, fullName).then(function (response) {
        Table.removeSelections(true);
        SelectDialog.getBinding("items").filter([]);

        // Use MessageToast
        const text = `Order ${order.MaintenanceOrder} assigned to ${fullName}`;
        sap.m.MessageToast.show(text);
        // Refresh data
        getWorkOrders();

        App.setBusy(false);
    });
});
