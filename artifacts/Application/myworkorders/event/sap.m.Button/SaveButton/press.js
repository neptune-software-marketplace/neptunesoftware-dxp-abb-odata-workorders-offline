if (signaturePad.isEmpty()) {
    sap.m.MessageToast.show("Please sign");
} else {
    modelWorkOrderDetailPage.setProperty("/Documents/Signature", signaturePad.toDataURL());

    setCacheWorkOrders();
    SignatureIconTabFilter.setIconColor("Positive");
    SignatureDialog.close();
}