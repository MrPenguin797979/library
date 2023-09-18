import create from "/js/index.js";

create({
  page: "Sách",
  tableName: "Sách",
  headings: ["ID", "Tên", "Thể loại", "Tác giả", "Tình trạng"],
  englishHeadings: ["name", "type", "author", "state"],
  required: ["name", "type", "author", "state"],
  disabled: ["state"],
});
