const context = oEvent.getSource().getBindingContext("WorkOrders");
const order = context.getObject();

if (!order.Documents) {
    order.Documents = {
        BeforeImage: "",
        AfterImage: "",
        Signature: "",
    };
    BeforeIconTabFilter.setIconColor("Critical");
    AfterIconTabFilter.setIconColor("Critical");
    SignatureIconTabFilter.setIconColor("Critical");
}

modelWorkOrderDetailPage.setData(order);

StopButton.setEnabled(false);
FinishButton.setEnabled(false);
if (order.MaintenanceProcessingPhase === "2") {
    StartButton.setEnabled(true);
} else {
    StartButton.setEnabled(false);
}

App.to(WorkOrderDetailPage);