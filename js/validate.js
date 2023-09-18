const username = $("#form-name");
const email = $("#form-email");
const password = $("#form-password");

const usernameRegex =
  /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username);
