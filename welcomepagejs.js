function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var showPasswordCheckbox = document.getElementById("showPassword");
  if (showPasswordCheckbox.checked) {
    passwordInput.type = "text";
} else {
    passwordInput.type = "password";
}
}
