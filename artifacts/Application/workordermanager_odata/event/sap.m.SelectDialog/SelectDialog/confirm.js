const aContexts = oEvent.getParameter("selectedContexts");
const personnelNumber = aContexts[0].getProperty("PersonnelNumber");
const fullName = aContexts[0].getProperty("EmployeeFullName");

Table.getSelectedContexts().forEach(context => {
    const order = context.getObject();
    assignTechnician(order, personnelNumber, fullName);
})