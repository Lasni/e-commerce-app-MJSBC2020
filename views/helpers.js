module.exports = {
  // prop === 'email' || 'password' || 'passwordConfirmation'
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  },
};
