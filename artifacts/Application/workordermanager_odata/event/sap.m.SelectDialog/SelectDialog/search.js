const value = oEvent.getParameter("value");
const filter = new sap.ui.model.Filter("EmployeeFullName", "Contains", value);

SelectDialog.getBinding("items").filter([filter]);