import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";

// Helper to resolve nested keys
const getNestedValue = (obj, path) => {
  return path.split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => (o || {})[k], obj);
};

const formatDateToBD = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const exportCSV = (data, filename = "sales_data.csv") => {
  if (!data || data.length === 0) return;

  const headersMap = {
    orderId: "Order ID",
    "customer.name": "Customer Name",
    "customer.number": "Phone Number",
    "customer.address": "Address",
    "products[0].product.name": "Product Name",
    "products[0].price": "Unit Price",
    "products[0].qty": "Quantity",
    "products[0].total": "Product Total",
    deliveryCharge: "Delivery Charge",
    subTotal: "Subtotal",
    grandTotal: "Grand Total",
    paidAmount: "Paid Amount",
    due: "Due",
    note: "Note",
    parcelId: "Parcel ID",
    deliveryType: "Delivery Type",
    status: "Order Status",
    createdAt: "Order Date",
  };

  const keys = Object.keys(headersMap);
  const headers = Object.values(headersMap);

  const csvRows = [];
  csvRows.push(headers.join(",")); // Header row

  for (const row of data) {
    const values = keys.map((key) => {
      let value = getNestedValue(row, key) ?? "";
      if (key === "createdAt" && value) {
        value = formatDateToBD(value);
      }
      const escapedValue = String(value).replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(","));
  }

  // 👉 Add BOM at the beginning to support Unicode
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};



export const exportExcel = (data, filename = "sales_data.xlsx") => {
  if (!data || data.length === 0) return;

  const headersMap = {
    orderId: "Order ID",
    "customer.name": "Customer Name",
    "customer.number": "Phone Number",
    "customer.address": "Address",
    "products[0].product.name": "Product Name",
    "products[0].price": "Unit Price",
    "products[0].qty": "Quantity",
    "products[0].total": "Product Total",
    deliveryCharge: "Delivery Charge",
    subTotal: "Subtotal",
    grandTotal: "Grand Total",
    paidAmount: "Paid Amount",
    due: "Due",
    note: "Note",
    parcelId: "Parcel ID",
    deliveryType: "Delivery Type",
    status: "Order Status",
    createdAt: "Order Date",
  };

  const keys = Object.keys(headersMap);
  const headers = Object.values(headersMap);

  const rows = data.map((item) => {
    const row = {};
    keys.forEach((key) => {
      let value = getNestedValue(item, key) ?? "";
      if (key === "createdAt" && value) {
        value = formatDateToBD(value);
      }
      row[headersMap[key]] = value;
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

  XLSX.writeFile(workbook, filename);
};

// export const exportPDF = (data, filename = "sales_data.pdf") => {
//   const doc = new jsPDF();
//   const headers = Object.keys(data[0]);
//   const rows = data.map(item => headers.map(h => item[h]));

//   doc.autoTable({
//     head: [headers],
//     body: rows,
//   });

//   doc.save(filename);
// };
