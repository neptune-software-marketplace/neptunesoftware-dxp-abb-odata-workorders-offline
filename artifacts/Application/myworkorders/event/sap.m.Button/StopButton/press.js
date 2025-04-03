const startTime = modelWorkOrderDetailPage.getProperty("/StartTime");
const current = new Date();
const actualHours = Math.ceil((current - startTime)/1000/60/60);

modelWorkOrderDetailPage.setProperty("/StopTime", current);

// Store the actual value on the first item of the Operations
modelWorkOrderDetailPage.setProperty("/to_MaintOrderOperation/results/0/Actual", actualHours);

setCacheWorkOrders();

StopButton.setEnabled(false);
FinishButton.setEnabled(true);