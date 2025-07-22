import validator from "validator"

export const validateSignupData = function (req) {
  const { firstName, lastName, emailId, password } = req.body

  if(firstName.length > 20 || firstName.length < 4){
    throw new Error("firstname can be only between 4 - 20 characters !")
  }
  if(lastName.length > 20 || lastName.length < 4){
    throw new Error("lastName can be only between 4 - 20 characters !")
  }
  if(!validator.isEmail(emailId)){
    throw new Error("Please enter a valid email !")
  }
  if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password !")
  }

}
