modelWorkOrderDetailPage.setProperty("/MaintenanceProcessingPhase", "3");
modelWorkOrderDetailPage.setProperty("/MaintenanceProcessingPhaseDesc", "Technically completed");

modelWorkOrders.refresh();

setCacheWorkOrders();

App.to(WorkOrderListPage);