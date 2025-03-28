# Offline Work Order applications using SAP OData services

This repository contains the instructions to develop Clean-Core Side-by-side extensions with Neptune DXP. 

The following topics are covered in this README.

1. Installation of Neptune DXP - Open Edition SAP BTP
2. Neptune Application using S/4 HANA Public Cloud OData Service (Online)
3. Neptune Work Order applications with offline capabilities using standard OData services
4. Integration of SAP BTP Translation Hub Service



## 1. Install Neptune DXP - Open Edition on SAP BTP Trial (optional)

Install Neptune Open Edition on SAP BTP. 
https://docs.neptune-software.com/neptune-dxp-open-edition/24/installation-guide/install-neptune-dxp-open-edition-on-btp-with-postgreSQL.html

TODO: Use text/screenshots from documentation. Enhance if needed.

## 2. Neptune Application using S/4 HANA Public Cloud OData Service

The first application we are developing with the Neptune Open Edition App Designer will use the SAP S/4HANA Cloud Public Edition Maintenance Order OData v2 service from [api.sap.com](https://api.sap.com/package/SAPS4HANACloud/odata)

> [!NOTE]  
> This service from the Business Accelerato Hub is read-only

### Neptune cockpit

Login to the [DSAG 25 environment](https://dsag-25.neptune-software.cloud/cockpit.html) with your user and password.

## Proxy Authentication

The Sandbox API uses an API key. Open the `Proxy Authentication` tool and press the `Create` button to configure a Proxy Authentication we will use for the OData service.

<img src="./images/proxy-authentication.png" alt="image" width="400px" height="auto">

In the next screen go to the `Headers` tab and add a new Header with the `+ Add` button.

Copy the value of the APIKey from the Business Accelerator Hub and add as header.

![APIKey](./images/proxy-auth-apikey.png)


Press `Save` to store the values.

### OData Source

From the Neptune DXP cockpit open the `OData Source` tool and click the `Create` button

![OData Source](./images/odata-source.png)

Give the OData Source the name: `MaintenanceOrderOdata` and use the endpoint: `https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_MAINTENANCEORDER;v=0002/`

<img src="./images/odata-source-endpoint.png" alt="image" width="400px" height="auto">

Press `Create`.

In the next screen enable the checkboxes for `Enable Proxy` and `Use in App Designer` and press `Save` on top of the screen.

![OData Source Settings](./images/odata-source-settings.png).

In the Authentication tab. Press Add and Select the `S4/HANA Cloud Sandbox API` Proxy Authentication.
![alt text](image.png)

Press Save to store the ODataSource

### App Designer

We can now create a Neptune Application using the above OData service. Open the `App Designer` from the cockpit.

Press the `Create` button to create a new application.

<img src="./images/app-designer-create.png" alt="image" width="800px" height="auto">


Enter a name for your application eg. `workorders` and press `Create`

<img src="./images/app-designer-create2.png" alt="image" width="800px" height="auto">

> [!NOTE]  
> It's a good practice to store every artefact in a Package so you can easily transport it and have version control via Git.

We now created an empty application in the `App Designer`

<img src="./images/app-designer-application.png" alt="image" width="800px" height="auto">



From the Control Library, search and drag the `App` control to the `HTML5 Document`

<img src="./images/app-designer-app.png" alt="image" width="400px" height="auto">



Continue and add the following controls to the App structure.
- DynamicPage under App
- Table under Dynamic Page
- ODataSource under Resources

<img src="./images/app-designer-controls.png" alt="image" width="400px" height="auto">



Select the `DynamicPage` and set the `title` attribute to `Work Orders`

<img src="./images/app-designer-title.png" alt="image" width="800px" height="auto">


Select `ODataSource` on the left and select the previously configure OData Source `MaintenanceOrderOData` on the right

<img src="./images/app-designer-odatasource.png" alt="image" width="800px" height="auto">



Select the `Table` control and press the `Model Source`

<img src="./images/app-designer-modelsource.png" alt="image" width="800px" height="auto">

In the Binding Dialog select the EntitySet `MaintenanceOrders`

<img src="./images/app-designer-binding.png" alt="image" width="800px" height="auto">

Select the `Table` again and right-click to open the context menu. Select `Wizard > Insert Fields (Display)`

<img src="./images/app-designer-table-wizard.png" alt="image" width="500px" height="auto">

Select the fields you want to be displayed as Columns in the Table and press `Create`

<img src="./images/app-designer-table-columns.png" alt="image" width="800px" height="auto">


This will create the Columns and the Binding for the Table control.

<img src="./images/app-designer-table.png" alt="image" width="400px" height="auto">

Activate and Run the application

<img src="./images/app-designer-activate-run.png" alt="image" width="800px" height="auto">

The Application will show the Table and the configured columns, but no data is shown, because the OData Service is not called yet. 

<img src="./images/app-designer-initial-run.png" alt="image" width="800px" height="auto">


Add `Javascript` to the `Resources`

<img src="./images/app-designer-javascript.png" alt="image" width="400px" height="auto">


Select `Javascript` and insert the following code snippet

```js
sap.ui.getCore().attachInit(function (startParams) {
    // Initialise the OData Model
    createODataSource();

    // Trigger OData read
    getODataTable();
});
```

<img src="./images/app-designer-attachinit.png" alt="image" width="800px" height="auto">

Activate and Run the application

<img src="./images/app-designer-activate-run.png" alt="image" width="800px" height="auto">

The Complete list of Maintenance Orders is now loaded and visible.

<img src="./images/app-designer-second-run.png" alt="image" width="800px" height="auto">


Let's update the date format first so it's more user friendly.

In the App Designer select the `txtTableMaintenanceOrdBasicStartDateTime` and select `date:BrowserSetting` as `text`.
Do the same for the other Date Field `txtTableMaintenanceOrdBasicEndDateTime`.

<img src="./images/app-designer-date-formatter.png" alt="image" width="800px" height="auto">

Activate and Run the application again, and now the Date's are formatter according to the Browser Settings locale.

<img src="./images/app-designer-date-formatter-result.png" alt="image" width="800px" height="auto">

### Order Detail Page

Add a new `Page` under the `App` control. Rename it to `DetailPage`

>! Note
> Until now we did rename our intial DynamicPage and all other controls, but it's best practice to give all control a good name, so you can easily find it back while searching the controls or related code.

Also add a `SimpleForm` to the `DetailPage`

<img src="./images/app-designer-detailpage.png" alt="image" width="400px" height="auto">

Select the `SimpleForm` and change the `Model Source` to `ODataSource>MaintenanceOrderType` by selecting the `MaintenanceOrderType` from the EntityType folder.

<img src="./images/app-designer-simpleform-modelsource.png" alt="image" width="400px" height="auto">

Right-click on the `SimpleForm` and select the `Wizard > Insert Fields (Edit)`. Select all Properties and press `Create`

<img src="./images/app-designer-simpleform-binding.png" alt="image" width="800px" height="auto">


Select the `colItemTable` from the `DynamicPage` and change the attribute `type` to `Active`. Now the `press` event can be used to navigate to the DetailPage.

<img src="./images/app-designer-colItemTable.png" alt="image" width="800px" height="auto">

Select `Events` and add click on the button next to the `press` Event. Select `JavaScript`.

<img src="./images/app-designer-press-event.png" alt="image" width="800px" height="auto">

Add the following code snippet behind the `colItemTable-press` event.

```js
const context = oEvent.getSource().getBindingContext();
const data = context.getObject();

modelSimpleForm.setData(data);

App.to(DetailPage);
```
<img src="./images/app-designer-colItemTable-code.png" alt="image" width="800px" height="auto">

On the `DetailPage` select the `navButtonPress` event and add the following code:

```
App.back();
```

<img src="./images/app-designer-back-button.png" alt="image" width="800px" height="auto">

Activate and Run the application to see the result.

<img src="./images/app-designer-application-final.png" alt="image" width="800px" height="auto">

We now have our first Neptune Application using a standard OData service. We can navigate between the List and the Detail Page.

## 3. Neptune Work Order applications with offline capabilities


ODataMaintenanceOrder


colItemTable-press
```js
const context = oEvent.getSource().getBindingContext("WorkOrders");
const order = context.getObject();

modelWorkOrderDetailPage.setData(order);

App.to(WorkOrderDetailPage);
```

StartButton-press
```js
modelWorkOrderDetailPage.setProperty("/StartTime", new Date());
StartButton.setEnabled(false);
StopButton.setEnabled(true);

setCacheWorkOrders();
```

StopButton-press
```js
modelWorkOrderDetailPage.setProperty("/StopTime", new Date());
setCacheWorkOrders();

StopButton.setEnabled(false);
FinishButton.setEnabled(true);
```


FinishButton-press
```js
modelWorkOrderDetailPage.setProperty("/MaintenanceProcessingPhase", "3");
modelWorkOrderDetailPage.setProperty("/MaintenanceProcessingPhaseDesc", "Technically completed");

modelWorkOrders.refresh();

setCacheWorkOrders();

App.to(WorkOrderListPage);
```

SyncButton
```js
sync();
```

RefreshButton
```js
jQuery.sap.require("sap.m.MessageBox");




sap.m.MessageBox.warning("Refresh the data from SAP?", {
    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
    emphasizedAction: sap.m.MessageBox.Action.OK,
    onClose: function (action) {
        if (action === "OK") {
            refresh();
        }
    },
});
```

Init
```js
function cacheInitLoadFinished() {
    const orders = modelWorkOrders.getProperty("/orders") || [];

    const filter1 = new sap.ui.model.Filter("MaintOrdPersonResponsible", "EQ", "57");
    const filters = [filter1];

    createODataMaintenanceOrder({});
    ODataMaintenanceOrder.read("/C_ObjPgMaintOrder", {
        filters: filters,
        urlParameters: "$expand=to_MaintOrderOperation",
        success: function (oData) {
            modelWorkOrders.setProperty("/orders", oData.results);
            setCacheWorkOrders();
        },
    });
}

function refresh() {
    // TODO
    ODataMaintenanceOrder.read("/C_ObjPgMaintOrder", {
        filters: filters,
        urlParameters: "$expand=to_MaintOrderOperation",
        success: function (oData) {
            modelWorkOrders.setProperty("/orders", oData.results);
            setCacheWorkOrders();
        },
    });
}

async function sync() {
    const orders = modelWorkOrders.getProperty("/orders");
    const completed = orders.filter((order) => order.MaintenanceProcessingPhase === "3");

    for (const order of completed) {
        //const contents = await fs.readFile(file, "utf8");
        console.log(order);

        var options = {
            data: order,
        };

        order.to_MaintOrderOperation?.results?.forEach(x=>{
            const urlParameters = {
                MaintenanceOrder: x.MaintenanceOrder,
                MaintenanceOrderOperation: x.MaintenanceOrderOperation,
                MaintenanceOrderSubOperation: x.MaintenanceOrderSubOperation,
                Actualworkquantity: 1,
                Actualworkquantityunit: "HR",
                Isfinalconfirmation: false,
                Personnelnumber: 57,
                Postingdate: new Date()
            };
            saveActualWork(urlParameters);
        })
    }
}

function saveActualWork(urlParameters) {

    ODataMaintenanceOrder.callFunction("/C_MaintOrderOpForActionCreatetimeconf", {
        method: "POST", 
        urlParameters: urlParameters,
        success: function (oData) {
            debugger;
            console.log("Success:", oData);
        },
        error: function (oError) {
            debugger;
            console.error("Error:", oError);
        },
    });
}
```

<div style="height: 1200px;">

</div>
asdfashdjkfhaskjdf











