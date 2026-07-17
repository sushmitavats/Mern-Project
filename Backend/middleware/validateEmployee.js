const validateEmployee =
    (req, res, next) => {
        const data = req.body;
        let errors = [];
        if (!data.firstName) {
            errors.push(
                "First Name Required"
            );
        }
        if (!data.lastName) {
            errors.push("Last Name Required");
        }
        if (!data.mobile) {
            errors.push("Mobile Required");
        }
        if (data.personalEmail && !/^\S+@\S+\.\S+$/.test(data.personalEmail)) {
            errors.push("Invalid Email");
        }
        if (errors.length) {
            return res.status(400)
                .json({
                    success: false,
                    errors
                });
        }
        next();
    };

export default validateEmployee;