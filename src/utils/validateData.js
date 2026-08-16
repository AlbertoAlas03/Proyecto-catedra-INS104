const validateData = () => {

    const validateEmail = (email) => {

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        const testEmail = regexEmail.test(email)

        return testEmail
    }


    const validatePhone = (phone) => {

        const regexTelefono = /^(2|6|7)\d{7}$|^(2|6|7)\d{3}-\d{4}$/

        const testPhone = regexTelefono.test(phone)

        return testPhone
    }

    return { validateEmail, validatePhone }
}

export default validateData