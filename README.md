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

From the Neptune Cockpit open the `App Designer` and press `Create from File`.

<img src="./images/app-designer-create-from-file.png" alt="image" width="600px" height="auto">

Select the `MyWorkOrdersOffline-start.planet9` file and give the Application a Name like `myworkorders`.

The newly created application contains all the UI5 elements for the `My Work Orders` application. It has a `WorkOrderListPage` with a Table and a `WorkOrderDetailPage`. You can Activate and Run the application already but no OData Service is connected yet. 

<img src="./images/app-designer-myworkorders-start.png" alt="image" width="400px" height="auto">

### ODataSource

Drag the `ODataSource` control to the `Resources` and rename it to `ODataMaintenanceOrder`

<img src="./images/app-designer-odatasource2.png" alt="image" width="800px" height="auto">

### MultiModel

In the application a `MultiModel` is already available with the name `WorkOrders`. This Multimodel is setup for offline usage by using the following attributes.
- cacheInitLoadFinished: Event triggered after the Cache is loaded on startup of the application
- setCacheType: We will use IndexedDB for offline storage
- setEnableCache: Enable the caching
- setInitLoad: Loads Model Data from offline storage

<img src="./images/app-designer-multimodel.png" alt="image" width="800px" height="auto">

### OData read

In the `Javascript` add the following code:

```js
function getSAPWorkOrders() {
    // Initialise ODataMaintenanceOrder
    if (!ODataMaintenanceOrder) {
        createODataMaintenanceOrder({});
    }

    // Filter on Responsible Person 
    // (Hardcoded for now, in final application we will use another OData Service 
    // to retrieve the Person Number for current SAP User)
    const filter = new sap.ui.model.Filter("MaintOrdPersonResponsible", "EQ", "57");
    const filters = [filter];

    // Read Work Orders
    ODataMaintenanceOrder.read("/C_ObjPgMaintOrder", {
        filters: filters,
        urlParameters: "$expand=to_MaintOrderOperation",
        success: function (data) {
            modelWorkOrders.setProperty("/orders", data.results);
            setCacheWorkOrders();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
```

This is a function which retrieves the SAP Work Orders with an ODataModel read call, you can $filters, $expands and $select parameters if needed. In this case we will use the $expand `to_MaintOrderOperation` to not only retrieve Work Order Header data but also the related operations. As filter we use the hardcode value of `57` for now.

### cacheInitLoadFinished

In the `cacheInitLoadFinished` we will add some logic to retrieve the SAP Work Orders when we are in online mode.

```js
function cacheInitLoadFinished() {
    
    // When online retrieve SAP Data
    if (navigator.onLine) {
        getSAPWorkOrders();
    }
}
```

Activate and Run the App to see the Work Orders.

<img src="./images/app-designer-myworkorders-run.png" alt="image" width="800px" height="auto">

If we navigate to the Detail page we see the binding is not working yet.

### Detail Page binding

Go to the `press` event of the `colItemTable` and add the following code:

```js
const context = oEvent.getSource().getBindingContext("WorkOrders");
const order = context.getObject();

modelWorkOrderDetailPage.setData(order);

App.to(WorkOrderDetailPage);
```

This code will retrieve the binding from the selected tab row and put the data in the model attached to the `WorkOrderDetailPage`. The binding of the fields was already done beforehand.

<img src="./images/app-designer-colItemTable-press.png" alt="image" width="800px" height="auto">

Activate and Run the application to see the DetailPage.

<img src="./images/app-designer-myworkorders-detailpage.png" alt="image" width="800px" height="auto">

### Action Buttons

Behind the `Start`, `Stop` and `Finish` buttons there is already some JavaScript code.

The `Start` button will disable the `Start` button and enable the `Stop` button. You can locate the code behind the `Events` in the Control Tree.

<img src="./images/app-designer-actionbuttons.png" alt="image" width="800px" height="auto">


The Actual Start Time and End Time will be stored in the local cache model. We can calculate the `Actual` time with these values and then store them later in SAP on the Maintenance Order. Let's update the code of the `Stop` button to calculate the hours.


```js
const startTime = modelWorkOrderDetailPage.getProperty("/StartTime");
const current = new Date();
const actualHours = Math.ceil((current - startTime)/1000/60/60);

modelWorkOrderDetailPage.setProperty("/StopTime", current);

// Store the actual value on the first item of the Operations
modelWorkOrderDetailPage.setProperty("/to_MaintOrderOperation/results/0/Actual", actualHours);

setCacheWorkOrders();

StopButton.setEnabled(false);
FinishButton.setEnabled(true);
```

> !NOTE In this code we cheat a little bit but storing the Actual value only on the first operation. In the final application we can do this calculation for each operation separately. In this demo we only have Order with a Single Operation so it's fine for this example only.

You can test this logic and see it online by Activation and running the application again.

### Offline test

By using the MultiModel and caching functionalities we can run this application in offline mode. Let's test that with the Chrome Browser.

> !NOTE In this example I am using the Chrome Browser, but Firefox, Edge, Brave, Safari should have similar functionalities to test offline modes.

Run the application and open the Developer Tools (Command + Option + I). Go to the `Network` tab and select `Offline` from the dropdown

<img src="./images/application-offline.png" alt="image" width="150px" height="auto">


![alt text](image.png)

Test if you can still use the Application.

> !NOTE Reloading the complete application in the browser will not work, for that we need to run the application inside of the Launchpad or a Mobile Client to use the comple offline capabilities of Neptune. We will check this later in the final solution.

### Sync to SAP when online again

Go back to the App Designer and add the following code in the `Javascript`

```js
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
                Actualworkquantity: x.Actual,
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

    // TODO make a promise so I can catch success/errors outside of this and attach MessageToast
    ODataMaintenanceOrder.callFunction("/C_MaintOrderOpForActionCreatetimeconf", {
        method: "POST", 
        urlParameters: urlParameters,
        success: function (oData) {
            console.log("Success:", oData);
        },
        error: function (oError) {
            console.error("Error:", oError);
        },
    });
}
```

This code will be triggered when press the `Sync` button. It will find the Orders which are completed and call the OData Function Import `C_MaintOrderOpForActionCreatetimeconf` for each one.


> !NOTE For this demo we will first implement this manual trigger. Later we can add logic to detect the online/offline state and trigger the sync automatically.

<img src="./images/app-designer-sync.png" alt="image" width="800px" height="auto">

Test and Run the application again and check that the Function Import is executed when pressing the `Sync` button.

### Refresh Button

TODO add Refresh button



RefreshButton code
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

Javascript code
```js
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
```

## 4. Integration of SAP BTP Translation Hub Service

TODO SAP BTP Translation Hub Integration













