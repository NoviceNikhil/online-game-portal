function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var showPasswordCheckbox = document.getElementById("showPassword");
    if (showPasswordCheckbox.checked) {
      passwordInput.type = "text";
  } else {
      passwordInput.type = "password";
  }
  
  }
    function checkEnter(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        validateForm();
      }
    }
    function validateForm() {
      console.log(9999);
        var passwordInput = document.getElementById("password");
        var passwordMessage = document.getElementById("passwordMessage");
        var agemessage=document.getElementById("agemessage");
        var ageinput=document.getElementById("age");
        var password = passwordInput.value;
        var age=parseInt(ageinput.value);
        console.log(age);
       // Defining the regular expressions for each constraint on the 
      // minigames account password
        var hasUppercase = /[A-Z]/.test(password);
        var hasLowercase = /[a-z]/.test(password);
        var hasNumber = /\d/.test(password);
        var hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        // Check if all constraints are met
        if (hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter) {
          passwordMessage.textContent = "Password meets the requirements.";
        } 
        else{
          passwordMessage.textContent = "Password does not meet the requirements.";
        }
        if(age>=10 && age<100){
          console.log("Age is valid.");
        }
        else{
            agemessage.textContent="age limit is 10 years and above";
            return false;
        }
      }
