const fieldsAdapter = req => {
    const { id, image, created_at, updated_at, ...body } = req.body || { id: 0, image: [], created_at: null, updated_at: null }
    req.body = { id: +id, image, ...body, image, created_at, updated_at }
    if (req.method === 'POST') req.body.createdAt = Date.now()
    if (req.method === 'PUT') req.body.updatedAt = Date.now()
}

const adapter = (req, res, next) => {
    if (req.originalUrl = "/users") fieldsAdapter(req)
    else
    if (req.originalUrl = "/books") fieldsAdapter(req)
    next()
}

module.exports = adapter