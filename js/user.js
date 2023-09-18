import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDixPO-wuNmiiCgWBg0x9OWn7wki623wg",
  authDomain: "library-731a3.firebaseapp.com",
  databaseURL: "https://library-731a3-default-rtdb.firebaseio.com",
  projectId: "library-731a3",
  storageBucket: "library-731a3.appspot.com",
  messagingSenderId: "1063655092368",
  appId: "1:1063655092368:web:9fabf1d9b3d17b793be815",
};

const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const db = getDatabase();
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const toastWrapper = document.createElement("div");

toastWrapper.classList.add("toast-wrapper");
document.body.appendChild(toastWrapper);

function Toast({ message, type }) {
  const toastTemplate = `
    <div class="toast">
      <i class="fa fa-${
        type === "success" ? "check" : "times"
      } toast-icon toast-${type}"></i>
      <p class="toast-text">${message}</p>
    </div>
  `;
  toastWrapper.insertAdjacentHTML("beforeend", toastTemplate);

  setTimeout(() => {
    const toast = $(".toast");
    toast?.remove();
  }, 1500);
}

$(".avatar")?.addEventListener("click", () => {
  localStorage.removeItem("user_info");
  window.location.href = "/html/login.html";
});

export default function create({ tableName = "", headings = [] }) {
  const USER_INFO = JSON.parse(localStorage.getItem("user_info"));
  const userID = USER_INFO?.id;
  const username = USER_INFO?.name;
  const isLogin = USER_INFO?.isLogin;
  const isAdmin = USER_INFO?.isAdmin;

  if (!isLogin) window.location.href = "/html/login.html";
  if (isAdmin) window.location.href = "/html/admin/cards.html";

  const dbRef = ref(db);
  const books = $(".books");
  const modalAction = $$(".modal-action");
  const cancelBtns = $$(".btn-cancel");
  const table = $("table");

  [...modalAction, ...cancelBtns].forEach((btn) =>
    btn.addEventListener("click", function () {
      if (btn.classList.contains("btn-cancel"))
        this.parentNode.parentNode.parentNode.classList.remove("show");
      else if (btn.classList.contains("modal-action"))
        this.parentNode.parentNode.classList.remove("show");
    })
  );

  function createList(datas) {
    books.innerHTML = "";

    datas.forEach((data) => {
      const item = document.createElement("div");

      item.classList.add("list-item");
      item.dataset.id = data["ID"];
      item.innerHTML = `
        <div class="list-image">
          <img src="https://cdn.dribbble.com/users/2400293/screenshots/14407736/media/f68467192eaaeff13a6a70c2442e0bef.jpg" />
        </div>

        <div class="list-content">
          <div class="list-header">
            <p class="list-title">${data["Tên"]}</p>
          </div>

          <div class="list-footer">
            <button class="btn btn-primary btn-show-more">Xem thêm</button>
            <button class="btn btn-danger btn-borrow-book">Mượn sách</button>
          </div>
        </div>
      `;
      books.appendChild(item);
    });

    showInfo();
  }

  function createHeading(headings) {
    const trHeading = document.createElement("tr");

    headings.forEach((heading) => {
      const th = document.createElement("th");
      th.textContent = heading;
      trHeading.appendChild(th);
    });

    table.appendChild(trHeading);
  }

  function createTable(datas) {
    // Tạo bảng
    table.innerHTML = "";
    createHeading(headings);

    datas.forEach((data) => {
      const tr = document.createElement("tr");

      headings.forEach((heading) => {
        const td = document.createElement("td");
        td.textContent = data[heading];
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  }

  function showInfo() {
    const showMoreBtns = $$(".btn-show-more");
    const borrowBookBtns = $$(".btn-borrow-book");
    const modalInfo = $(".modal.modal-info");
    const modalBody = modalInfo.querySelector(".modal-body");

    showMoreBtns.forEach((btn) =>
      btn.addEventListener("click", function () {
        const listItem = this.parentNode.parentNode.parentNode;
        const id = listItem.dataset.id;
        const imgSrc = listItem.querySelector(".list-image img").src;

        modalBody.innerHTML = "";
        modalBody.style.display = "grid";

        get(child(dbRef, `Sách/${id}`)).then((snapshot) => {
          if (!snapshot.exists()) return;

          const datas = snapshot.val();
          const keys = ["Tên", "Thể loại", "Tác giả", "Tình trạng"];
          const parentImg = document.createElement("div");
          const img = document.createElement("img");
          const content = document.createElement("div");

          parentImg.classList.add("modal-image");
          img.setAttribute("src", imgSrc);
          parentImg.appendChild(img);
          modalBody.appendChild(parentImg);

          content.classList.add("modal-content");

          modalInfo.classList.add("show");
          keys.forEach((key) => {
            const p = document.createElement("p");
            p.textContent = `${key}: ${datas[key]}`;
            content.appendChild(p);
          });

          modalBody.appendChild(content);
        });
      })
    );

    borrowBookBtns.forEach((btn) =>
      btn.addEventListener("click", function () {
        const id = this.parentNode.parentNode.parentNode.dataset.id;

        get(child(dbRef, `Sách/${id}`))
          .then((snapshot) => {
            if (!snapshot.exists()) return;

            const data = snapshot.val();
            const state = data["Tình trạng"];

            if (state === "Đang được mượn") {
              Toast({
                message: "Cuốn sách này đang được mượn",
                type: "error",
              });
              return;
            }

            modalInfo.classList.add("show");
            modalBody.style.display = "block";
            modalBody.innerHTML = `
              <form autocomplete="off" class="form" style="margin: 0 auto">
                <div class="form-group">
                  <label for="form-date" class="form-label">Ngày trả</label>
                  <input type="text" class="form-input" id="form-date" name="date" required />
                </div>
                <button type="submit" class="btn btn-primary form-submit">Mượn</button>
              </form>
            `;

            flatpickr("#form-date", {
              dateFormat: "d/m/Y",
              allowInput: true,
              minDate: "today",
            });

            const form = modalBody.querySelector(".form");

            form.addEventListener("submit", (e) => {
              e.preventDefault();
              const datee = form.querySelector("#form-date").value;

              set(ref(db, `Phiếu mượn/${Date.now()}`), {
                ID: userID,
                IDD: Date.now(),
                "Người mượn": username,
                Sách: data["Tên"],
                "Ngày mượn": `${day}/${month}/${year}`,
                "Ngày trả": datee,
              })
                .then(() => {
                  Toast({
                    message: "Mượn thành công",
                    type: "success",
                  });

                  modalInfo.classList.remove("show");

                  update(ref(db, `Sách/${id}`), {
                    "Tình trạng": "Đang được mượn",
                  });
                })
                .catch((error) => {
                  alert(error);
                });
            });
          })
          .catch((error) => {
            alert(error);
          });
      })
    );
  }

  function FindData(search) {
    const dbRef = ref(db);

    get(child(dbRef, tableName)).then((snapshot) => {
      if (!snapshot.exists()) return;

      const datas = Object.values(snapshot.val());
      const res = datas.filter((data) => {
        const values = Object.values(data).map((val) =>
          String(val).toLowerCase()
        );
        return values.some((val) => val.includes(search)) ? values : 0;
      });

      createList(res);
    });
  }

  function convertTime(dateString) {
    const dateParts = dateString.split("/");
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject.getTime();
  }

  get(child(dbRef, tableName)).then((snapshot) => {
    if (!snapshot.exists()) {
      books ? (books.innerHTML = "") : "";
      return;
    }

    const datas = Object.values(snapshot.val());

    switch (tableName) {
      case "Sách":
        createList(datas);
        break;

      case "Phiếu mượn":
        const ids = datas.filter((data) => data["Người mượn"] === username);

        createTable(ids, headings);
        const tdDatee = $$("tr > td:last-child");

        tdDatee.forEach((date) => {
          if (new Date().getTime() >= convertTime(date.textContent))
            date.parentNode.classList.add("invalid");
        });

        break;

      default:
        break;
    }
  });

  $(".form-search").addEventListener("submit", (e) => {
    e.preventDefault();
    FindData($(".input-search").value.toLowerCase());
  });
}
