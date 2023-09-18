import create from "/js/index.js";

create({
  page: "Quản lí",
  tableName: "Phiếu mượn",
  headings: ["ID", "Người mượn", "Sách", "Ngày mượn", "Ngày trả"],
  englishHeadings: ["name", "book", "date", "datee"],
  disabled: ["date"],
  datee: ["date", "datee"],
  required: ["name", "book", "date", "datee"],
});
