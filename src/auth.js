const jwt = require("jsonwebtoken")

const SECRET_KEY = "only Jesus saves"

const expiresIn = "1h"

const sign = payload => jwt.sign(payload, SECRET_KEY, { expiresIn })

const verify = token => jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)

const Authenticate = ({ email, password }, inUsers) => inUsers.findIndex(({ email: e, password: p }) => e === email && p === password) !== -1

const Login = jsonServerRouter => (req, res) => {
    const { users } = jsonServerRouter.db.getState() || []
    let status = 401; message = "Authorization was refused for these credentials"
    const { email, password } = req.body || { email: "", password: "" }
    const payload = { email, password }

    if (Authenticate(payload, users) === false) {
        res.status(status).json({ status, message })
        return
    }
    const token = sign(payload)
    status = 201;
    message = "Authorization has been approved for provided credentials"
    res.status(status).json({ status, message, token })
}

const AuthMiddleware = (req, res, next) => {
    let status = 401; message = "Bearer not found on header"
    const { authorization } = req.headers
    if (authorization === undefined) {
        res.status(status).json({ status, message })
        return
    }
    const [bearar, token] = authorization.split(' ')
    if (bearar.toLowerCase() !== "bearer" || token === undefined) {
        res.status(status).json({ status, message })
        return
    }
    try {
        verify(token)
        next()
    } catch (error) {
        message = "Access denied! The token has been revoked."
        res.status(status).json({ status, message, error })
    }
}

module.exports = {
    Login,
    AuthMiddleware
}