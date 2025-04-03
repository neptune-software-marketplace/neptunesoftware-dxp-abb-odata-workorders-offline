const body = req.body;

const pdfBase64 = await p9.pdf.generatePdf({
    pdfName: "workorder_pdf",
    objectKey: body.MaintenanceOrder,
    body: body,
});

const entity = {
    OrderID: body.MaintenanceOrder,
    BeforeImage: body.Documents.BeforeImage,
    AfterImage: body.Documents.AfterImage,
    Signature: body.Documents.Signature,
    PDF: pdfBase64,
    Comments: body.Comments
};

const existing = await entities.workorders.findOne({ OrderID: body.MaintenanceOrder });

log.info(existing);

if (existing) {
    entity.id = existing.id;
}  

// Save in Open Edition Tables, will Update if exists otherwise Create
await entities.workorders.save(entity);

// Uplaod Attachment to SAP
var buffer = Buffer.from(pdfBase64, "base64");

const linkedSAPObjectKey = body.MaintenanceOrder.padStart(12, '0'); // Add leading zeros
const businessObjectTypeName = "BUS2007"; // Workorder Business Object

const opts = {
    //parameters: {},
    headers: {
        Slug: "workorder.pdf",
        "Content-Type": "application/pdf",
        BusinessObjectTypeName: businessObjectTypeName,
        LinkedSAPObjectKey: linkedSAPObjectKey,
        "X-REQUESTED-WITH": "X"
    },
    body: buffer,
};

log.info(JSON.stringify(opts));

try {
    // Send api request.
    const response = await apis.uploadAttachment(opts);
    // Log response data
    log.info(response.status);

    complete();
} catch (error) {
    log.error("Error in request: ", error);
    return fail();
}