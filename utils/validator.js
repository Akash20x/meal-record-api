const validateEmail = (email) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    const passwordRegex = new RegExp(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
    );
    return passwordRegex.test(password);
  };
  
module.exports = {
    validateEmail,
    validatePassword,
  };