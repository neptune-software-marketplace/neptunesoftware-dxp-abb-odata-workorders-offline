const context = oEvent.getSource().getBindingContext();
const data = context.getObject();

modelDetailPage.setData(data);

App.to(DetailPage);