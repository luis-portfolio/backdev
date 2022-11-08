const interceptor = require("express-interceptor")

const defaultRequest = body => true
const defaultResponse = body => body

const globalObserver = ({
    request = defaultRequest,
    response = defaultResponse
}) => interceptor((req, res) => {
    return {
        isInterceptable: () => request(req.oldBody),
        intercept: (body, send) => {
            const oBody = JSON.parse(body)
            const result = response(oBody)
            if (result === false) { return res.sendStatus(403) }
            const newbody = JSON.stringify(result)
            send(newbody)
        }
    }
})

const Observer = globalObserver({
    request: (body) => {
        console.log("request", body)
        return true
    },
    response: (body) => {
        console.log("response", body)
        // body = false
        // body.id = `${body.id}`
        return body
    }
})

const ObserverBody = (req, res, next) => {
    req.oldBody = JSON.parse(JSON.stringify(req.body || {}))
    next()
}

const fieldsAdapter = req => {
    if (req.body === undefined) return

    const { id, image, created_at, updated_at, ...body } = req.body || { id: 0, image: [], created_at: null, updated_at: null }
    req.body = { id: +id, ...body, image, created_at, updated_at }
    if (req.method === 'POST') req.body.created_at = (new Date()).toISOString()
    if (req.method === 'PUT') req.body.updated_at = (new Date()).toISOString()
}

const AdapterBody = (req, res, next) => {
    if (req.originalUrl = "/users") fieldsAdapter(req)
    else if (req.originalUrl = "/books") fieldsAdapter(req)
    next()
}

module.exports = {
    ObserverBody,
    Observer,
    AdapterBody
}