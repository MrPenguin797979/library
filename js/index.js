import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

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
const auth = getAuth(app);

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

function Register() {
  const form = $(".form.form-register");
  if (!form) return;

  flatpickr(`#form-birthday`, {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = [...this.querySelectorAll("input")];
    const username = form.querySelector("#form-name").value;
    const email = form.querySelector("#form-email").value;
    const birthday = form.querySelector("#form-birthday").value;
    const password = form.querySelector("#form-password").value;
    const dateCreate = `${day}/${month}/${year}`;
    const link = form.querySelector(".form-description").querySelector("a");

    const usernameRegex = /^[a-zA-Z0-9]+$/.test(username);
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    const passwordRegex = /^.{6,30}$/.test(password);

    if (!usernameRegex) {
      Toast({
        message: "Tên nhập sai!",
        type: "error",
      });

      return;
    } else if (!emailRegex) {
      Toast({
        message: "Email nhập sai!",
        type: "error",
      });

      return;
    } else if (!passwordRegex) {
      Toast({
        message: "Mật khẩu nhập sai! Từ 6 đến 30 chữ số!",
        type: "error",
      });

      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: username,
        });

        set(ref(db, `Người dùng/${user.uid}`), {
          ID: user.uid,
          Tên: username,
          Email: email,
          "Ngày sinh": birthday,
          "Ngày tạo": dateCreate,
        })
          .then(() => {
            inputs.forEach((input) => (input.value = ""));
            Toast({
              message: "Đăng ký thành công",
              type: "success",
            });
            link.click();
          })
          .catch((error) => {
            Toast({
              message: "Đăng ký thất bại",
              type: "success",
            });
            alert(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function Login() {
  const form = $(".form.form-login");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const inputs = [...this.querySelectorAll("input")];
    const email = form.querySelector("#form-email").value;
    const password = form.querySelector("#form-password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        Toast({
          message: "Đăng nhập thành công",
          type: "success",
        });

        if (email === "leminhquan08112010@gmail.com") {
          localStorage.setItem(
            "user_info",
            JSON.stringify({
              id: user.uid,
              name: user.displayName,
              isLogin: true,
              isAdmin: true,
            })
          );
          window.location.href = "/html/admin/cards.html";
        } else {
          localStorage.setItem(
            "user_info",
            JSON.stringify({
              id: user.uid,
              name: user.displayName,
              isLogin: true,
              isAdmin: false,
            })
          );
          window.location.href = "/html/books.html";
        }

        inputs.forEach((input) => (input.value = ""));
      })
      .catch((error) => {
        Toast({
          message: "Đăng nhập thất bại",
          type: "error",
        });
      });
  });
}

Register();
Login();

$(".avatar")?.addEventListener("click", () => {
  localStorage.removeItem("user_info");
  window.location.href = "/html/login.html";
});

export default function create({
  page = "",
  tableName = "",
  headings = [],
  englishHeadings = [],
  disabled = [],
  select = {},
  required = [],
  datee = [],
}) {
  const USER_INFO = JSON.parse(localStorage.getItem("user_info"));
  const username = USER_INFO?.name;
  const isLogin = USER_INFO?.isLogin;
  const isAdmin = USER_INFO?.isAdmin;

  if (!isLogin) window.location.href = "/html/login.html";
  if (!isAdmin) window.location.href = "/html/books.html";

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="wrapper" style="display: flex">
      <div class="sidebar">
        <div
          class="container"
          style="display: flex; flex-direction: column; padding: 20px"
        >
          <div class="sidebar-header">
            <span>Thư viện</span>
          </div>
          <span class="cross"></span>
          <ul class="sidebar-body">
            <li class="sidebar-item ${page === "Thẻ" ? "active" : ""}">
              <a href="/html/admin/cards.html" class="sidebar-link">
                <i class="fa-solid fa-id-card sidebar-icon"></i>
                Thẻ
              </a>
            </li>
            <li class="sidebar-item ${page === "Sách" ? "active" : ""}">
              <a href="/html/admin/books.html" class="sidebar-link">
                <i class="fa-solid fa-book sidebar-icon"></i>
                Sách
              </a>
            </li>
            <li class="sidebar-item ${page === "Quản lí" ? "active" : ""}">
              <a href="/html/admin/dashboard.html" class="sidebar-link">
                <i class="fa-solid fa-folder sidebar-icon"></i>
                Phiếu ghi mượn
              </a>
            </li>
          </ul>
          <span class="cross"></span>
          <div class="sidebar-footer">
            <img
              src="https://hoidap247.com/static/img/avatar.png"
              alt="avatar"
              class="avatar"
            />
            <span class="user" style="margin-left: 10px; font-weight: bold">${username}</span>
          </div>
        </div>
      </div>

      <div class="container" style="margin: 0; flex-grow: 1">
        <div style="display: flex; margin-bottom: 25px">
          <div>
            <button class="btn btn-danger btn-delete-all">Xoá tất cả</button>
            <button class="btn btn-primary btn-add">Tạo</button>
          </div>

          <form class="form-search">
            <input class="input-search" type="search" placeholder="Tìm kiếm" />
            <button
              class="btn btn-primary btn-search"
              type="submit"
              style="margin-left: 10px"
            >
              Tìm
            </button>
          </form>
        </div>

        <table></table>
      </div>
    </div>

    <div class="modal modal-add">
      <div class="modal-container">
        <div class="modal-action">
          <i class="fa fa-times"></i>
        </div>
        <div class="modal-header">
          <h2 class="modal-title">Tạo</h2>
        </div>
        <div class="modal-body">
          <form autocomplete="off" class="form">
          </form>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>

    <div class="modal modal-edit">
      <div class="modal-container">
        <div class="modal-action">
          <i class="fa fa-times"></i>
        </div>
        <div class="modal-header">
          <h2 class="modal-title">Sửa</h2>
        </div>
        <div class="modal-body">
          <form autocomplete="off" class="form">
          </form>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>

    <div class="modal modal-delete">
      <div class="modal-container">
        <div class="modal-action">
          <i class="fa fa-times"></i>
        </div>
        <div class="modal-header">
          <h2 class="modal-title">Xoá</h2>
        </div>
        <div class="modal-body">Hành động này sẽ xoá vĩnh viễn, bạn có muốn xoá không?</div>
        <div class="modal-footer" style="margin-top: 20px">
          <button type="submit" class="btn btn-danger btn-delete-submit">Xoá</button>
          <button class="btn btn-secondary btn-cancel">Huỷ</button>
        </div>
      </div>
    </div>

    <div class="modal modal-info">
      <div class="modal-container">
        <div class="modal-action">
          <i class="fa fa-times"></i>
        </div>
        <div class="modal-header">
          <h2 class="modal-title">Thông tin</h2>
        </div>
        <div class="modal-body"></div>
      </div>
    </div>
  `
  );

  $(".avatar").addEventListener("click", () => {
    localStorage.removeItem("user_info");
    window.location.href = "/html/login.html";
  });

  const modalAdd = $(".modal.modal-add");
  const modalEdit = $(".modal.modal-edit");
  const modalDelete = $(".modal.modal-delete");
  const formAdd = modalAdd.querySelector(".form");
  const formEdit = modalEdit.querySelector(".form");
  const formInput = [],
    formEditInput = [];

  for (let index = 0; index < headings.length - 1; ++index) {
    const formGroup = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const list = document.createElement("select");
    const values = select[englishHeadings[index]];

    formGroup.classList.add("form-group");

    label.setAttribute("for", `form-${englishHeadings[index]}`);
    label.classList.add("form-label");
    label.textContent = headings[index + 1];

    input.setAttribute("type", "text");
    input.classList.add("form-input");
    input.setAttribute("id", `form-${englishHeadings[index]}`);
    input.setAttribute("name", englishHeadings[index]);

    if (required.includes(englishHeadings[index])) {
      input.setAttribute("required", "required");
      list.setAttribute("required", "required");
    }

    list.classList.add("form-select");
    list.setAttribute("id", `form-${englishHeadings[index]}`);

    values?.forEach((val) => {
      const option = document.createElement("option");
      option.setAttribute("value", val);
      option.textContent = val;
      list.appendChild(option);
    });

    disabled.includes(englishHeadings[index])
      ? input.setAttribute("disabled", "")
      : "";

    if (Object.keys(select).includes(englishHeadings[index])) {
      formGroup.appendChild(label);
      formGroup.appendChild(list);
      formAdd.appendChild(formGroup);
      continue;
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    formAdd.appendChild(formGroup);
  }

  const inputID = document.createElement("span");
  inputID.style.display = "none";
  inputID.classList.add("formEdit-input-id");
  formEdit.appendChild(inputID);

  for (let index = 0; index < headings.length - 1; ++index) {
    const formGroup = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const list = document.createElement("select");
    const values = select[englishHeadings[index]];

    formGroup.classList.add("form-group");

    label.setAttribute("for", `form-${englishHeadings[index]}`);
    label.classList.add("form-label");
    label.textContent = headings[index + 1];

    input.setAttribute("type", "text");
    input.classList.add("form-input");
    input.setAttribute("id", `form-${englishHeadings[index]}`);
    input.setAttribute("name", englishHeadings[index]);

    if (required.includes(englishHeadings[index])) {
      input.setAttribute("required", "required");
      list.setAttribute("required", "required");
    }

    list.classList.add("form-select");
    list.setAttribute("id", `form-${englishHeadings[index]}`);

    values?.forEach((val) => {
      const option = document.createElement("option");
      option.setAttribute("value", val);
      option.textContent = val;
      list.appendChild(option);
    });

    disabled.includes(englishHeadings[index])
      ? input.setAttribute("disabled", "")
      : "";

    if (Object.keys(select).includes(englishHeadings[index])) {
      formGroup.appendChild(label);
      formGroup.appendChild(list);
      formEdit.appendChild(formGroup);
      continue;
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    formEdit.appendChild(formGroup);
  }

  formAdd.innerHTML = `
    ${formAdd.innerHTML}
    <button type="submit" class="btn btn-primary form-submit">Tạo</button>
  `;

  formEdit.innerHTML = `
    ${formEdit.innerHTML}
    <button type="submit" class="btn btn-primary form-submit">Sửa</button>
  `;

  datee.forEach((item) => {
    flatpickr(`#form-${item}`, {
      dateFormat: "d/m/Y",
      allowInput: true,
    });
  });

  englishHeadings.forEach((heading) => {
    const element = $(`#form-${heading}`);
    formInput.push(element);
    formEditInput.push(element);
  });

  const modalAction = $$(".modal-action");
  const cancelBtns = $$(".btn-cancel");

  [...modalAction, ...cancelBtns].forEach((btn) =>
    btn.addEventListener("click", function () {
      if (btn.classList.contains("btn-cancel"))
        this.parentNode.parentNode.parentNode.classList.remove("show");
      else if (btn.classList.contains("modal-action"))
        this.parentNode.parentNode.classList.remove("show");
    })
  );

  const add = $(".btn-add");
  const deleteAll = $(".btn-delete-all");
  const find = $(".form-search");
  const table = $("table");

  let id = Date.now();

  ResetData();

  function createHeading() {
    const trHeading = document.createElement("tr");
    headings.push("Hành động");

    headings.forEach((heading) => {
      const th = document.createElement("th");
      th.textContent = heading;
      trHeading.appendChild(th);
    });

    table.appendChild(trHeading);
    headings.pop();
  }

  function createTable(datas) {
    // Tạo bảng
    table.innerHTML = "";
    createHeading();

    datas.forEach((data) => {
      const tr = document.createElement("tr");
      const action = document.createElement("td");

      action.innerHTML = `
        <button class="btn btn-primary btn-edit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mx-auto">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
        </button>
        <button class="btn btn-danger btn-delete">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mx-auto">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
          </svg>
        </button>
      `;

      headings.forEach((heading, index) => {
        const td = document.createElement("td");
        index > 0 ? td.classList.add(`td-${englishHeadings[index - 1]}`) : "";
        td.textContent = data[heading];

        if (page === "Quản lí") {
          if (heading === "ID") td.textContent = data["IDD"];
          if (heading === "Người mượn") td.dataset.id = data["ID"];
        }

        tr.appendChild(td);
      });

      tr.appendChild(action);
      table.appendChild(tr);
    });

    RemoveData();
    EditData();
    Dashboard();
  }

  function ResetData() {
    const elements = [...formInput, ...formEditInput];
    elements.forEach((element) => (element.value = ""));

    disabled.forEach((item) => {
      const element = formAdd.querySelector(`#form-${item}`);

      if (item === "year") element.value = `${year} - ${year + 1}`;
      if (item === "date") element.value = `${day}/${month}/${year}`;
      if (item === "state") element.value = "Chưa được mượn";
    });

    id = Date.now();
  }

  function GetData() {
    const dbRef = ref(db);

    get(child(dbRef, tableName)).then((snapshot) => {
      if (!snapshot.exists()) {
        table.innerHTML = "";
        return;
      }
      createTable(Object.values(snapshot.val()));
    });
  }

  function InsertData(e) {
    e.preventDefault();

    const obj = {};
    obj["ID"] = id;

    for (let i = 0; i < headings.length - 1; ++i) {
      const element = formAdd.querySelector(`#form-${englishHeadings[i]}`);
      obj[headings[i + 1]] = element.value;
    }

    set(ref(db, `${tableName}/${id}`), obj)
      .then(() => {
        ResetData();
        GetData();
        modalAdd.classList.remove("show");
      })
      .catch((error) => {
        alert(error);
      });
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

      createTable(res);
    });
  }

  function RemoveData() {
    const deleteBtns = $$(".btn-delete");

    deleteBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        modalDelete.classList.add("show");

        const parent = e.target.parentNode.parentNode.children;
        const _id = parent[0].textContent;
        const deletee = modalDelete.querySelector(".btn-delete-submit");

        let book = "";
        let user = "";

        if (page === "Quản lí") book = parent[2].textContent;
        if (page === "Thẻ") user = parent[1].textContent;

        deletee.addEventListener("click", () => {
          if (page === "Quản lí") {
            get(child(ref(db), "Sách")).then((snapshot) => {
              if (!snapshot.exists()) return;

              const datas = Object.values(snapshot.val());
              const bookID = datas.filter((data) => data["Tên"] === book)[0][
                "ID"
              ];

              update(ref(db, `Sách/${bookID}`), {
                "Tình trạng": "Chưa được mượn",
              }).catch((error) => alert(error));
            });
          }

          // if (page === "Sách") {
          //   book = parent[1].textContent;

          //   get(child(ref(db), "Phiếu mượn")).then((snapshot) => {
          //     if (!snapshot.exists()) return;

          //     const datas = Object.values(snapshot.val());
          //     const res = datas.filter((data) => data["Sách"] === book);

          //     res.forEach((item) => {
          //       remove(ref(db, `Phiếu mượn/${item["IDD"]}`)).catch((error) =>
          //         alert(error)
          //       );
          //     });
          //   });
          // }

          if (page === "Thẻ") {
            get(child(ref(db), "Phiếu mượn")).then((snapshot) => {
              if (!snapshot.exists()) return;

              const datas = Object.values(snapshot.val());
              const res = datas.filter((data) => data["Người mượn"] === user);

              res.forEach((item) => {
                const { IDD: id, Sách: book } = item;

                get(child(ref(db), "Sách"))
                  .then((snapshot) => {
                    if (!snapshot.exists()) return;

                    const datas = Object.values(snapshot.val());
                    const bookID = datas.find((data) => data["Tên"] === book)[
                      "ID"
                    ];

                    update(ref(db, `Sách/${bookID}`), {
                      "Tình trạng": "Chưa được mượn",
                    })
                      .then(() => {
                        remove(ref(db, `Phiếu mượn/${id}`)).catch((error) =>
                          alert(error)
                        );
                      })
                      .catch((error) => alert(error));
                  })
                  .catch((error) => alert(error));
              });
            });
          }

          remove(ref(db, `${tableName}/${_id}`))
            .then(() => {
              GetData();
              FindData($(".input-search").value);
              modalDelete.classList.remove("show");
              Toast({
                message: "Xoá thành công",
                type: "success",
              });
            })
            .catch((error) => alert(error));
        });
      })
    );
  }

  function RemoveAllData() {
    if (page === "Quản lí") {
      get(child(ref(db), "Sách")).then((snapshot) => {
        if (!snapshot.exists()) return;

        const datas = Object.values(snapshot.val());
        const books = [...table.querySelectorAll("tr > td:nth-child(4)")].map(
          (e) => e.textContent
        );

        datas.forEach((data) => {
          if (books.includes(data["Tên"])) {
            update(ref(db, `Sách/${data["ID"]}`), {
              "Tình trạng": "Chưa được mượn",
            }).catch((error) => alert(error));
          }
        });
      });
    }

    modalDelete.classList.add("show");
    const btnSubmit = $(".btn-delete-submit");

    btnSubmit.addEventListener("click", () => {
      modalDelete.classList.remove("show");

      remove(ref(db, tableName))
        .then(() => {
          GetData();
          $(".input-search").value = "";
          Toast({
            message: "Xoá thành công",
            type: "success",
          });
        })
        .catch((error) => {
          Toast({
            message: "Xoá thất bại",
            type: "error",
          });
          console.log(error);
        });
    });
  }

  function EditData() {
    const editBtns = $$(".btn-edit");
    const obj = {};

    editBtns.forEach((btn) =>
      btn.addEventListener("click", function (e) {
        modalEdit.classList.add("show");

        let datas = [...e.target.parentNode.parentNode.children];
        datas.pop();
        datas = datas.map((data) => data.textContent);

        const inputID = formEdit.querySelector(".formEdit-input-id");
        inputID.textContent = datas[0];

        for (let i = 1; i < datas.length; ++i) {
          const input = formEdit.querySelector(
            `#form-${englishHeadings[i - 1]}`
          );
          input.value = "";
          input.value = datas[i];
        }

        formEdit.addEventListener("submit", (e) => {
          e.preventDefault();

          for (let i = 1; i < datas.length; ++i) {
            const input = formEdit.querySelector(
              `#form-${englishHeadings[i - 1]}`
            );
            datas[i] = input.value;
            obj[headings[i]] = datas[i];
          }

          update(ref(db, `${tableName}/${inputID.textContent}`), obj)
            .then(() => {
              GetData();
              modalEdit.classList.remove("show");
            })
            .catch((error) => alert(error));
        });
      })
    );
  }

  function convertDate(dateString) {
    const dateParts = dateString.split("/");
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject;
  }

  function Dashboard() {
    if (page !== "Quản lí") return;

    const tdName = $$(".td-name");
    const tdBook = $$(".td-book");
    const tdDatee = $$(".td-datee");
    const modalInfo = $(".modal.modal-info");
    const modalBodyInfo = modalInfo.querySelector(".modal-body");

    modalBodyInfo.style.display = "block";

    tdName.forEach((td) => td.addEventListener("click", showStudentInfo));
    tdBook.forEach((td) => td.addEventListener("click", showBookInfo));
    tdDatee.forEach((date) => {
      if (new Date().getTime() >= convertDate(date.textContent).getTime())
        date.parentNode.classList.add("invalid");
    });

    function showStudentInfo(e) {
      const dbRef = ref(db);
      const ID = e.target.dataset.id;

      modalInfo.classList.add("show");

      get(child(dbRef, "Người dùng")).then((snapshot) => {
        if (!snapshot.exists()) return;

        const datas = Object.values(snapshot.val());
        const newHeadings = ["ID", "Tên", "Ngày sinh", "Ngày tạo"];
        let check = false;

        for (let i = 0; i < datas.length; ++i) {
          const data = datas[i];

          if (check) break;
          else modalBodyInfo.innerHTML = "";

          if (data["ID"] === ID) check = true;
          if (!check) {
            modalBodyInfo.innerHTML = `<span>Không tìm thấy!</span>`;
            continue;
          }

          for (let i = 0; i < newHeadings.length; ++i) {
            const span = document.createElement("span");
            const br = document.createElement("br");

            span.textContent = `${newHeadings[i]}: ${data[newHeadings[i]]}`;
            modalBodyInfo.appendChild(span);
            modalBodyInfo.appendChild(br);
          }
        }
      });
    }

    function showBookInfo(e) {
      const dbRef = ref(db);
      const book = e.target.textContent;

      modalInfo.classList.add("show");

      get(child(dbRef, "Sách")).then((snapshot) => {
        if (!snapshot.exists()) return;

        const datas = Object.values(snapshot.val());
        const newHeadings = ["ID", "Tên", "Thể loại", "Tác giả", "Tình trạng"];
        let check = false;

        for (let i = 0; i < datas.length; ++i) {
          const data = datas[i];

          if (check) break;
          else modalBodyInfo.innerHTML = "";

          if (data["Tên"].toLowerCase() === book.toLowerCase()) check = true;

          if (!check) {
            modalBodyInfo.innerHTML = `<span>Không tìm thấy!</span>`;
            continue;
          }

          for (let i = 0; i < newHeadings.length; ++i) {
            const span = document.createElement("span");
            const br = document.createElement("br");

            span.textContent = `${newHeadings[i]}: ${data[newHeadings[i]]}`;
            modalBodyInfo.appendChild(span);
            modalBodyInfo.appendChild(br);
          }
        }
      });
    }
  }

  if (page !== "Thẻ" && page !== "Quản lí")
    add.addEventListener("click", () => {
      modalAdd.classList.add("show");
      formAdd.addEventListener("submit", InsertData);
    });

  deleteAll.addEventListener("click", RemoveAllData);

  find.addEventListener("submit", (e) => {
    e.preventDefault();
    FindData($(".input-search").value.toLowerCase());
  });

  GetData();
}
