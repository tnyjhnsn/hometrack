const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(err.status).json({
      error: 'Could not decode request: JSON parsing failed'
    })
  }
  return next(err)
})

app.post('/', (req, res) => {

  const properties = req.body.payload.filter(property => {
    return property.type === 'htv' && property.workflow === 'completed'
  })

  const report = properties.map(property => {
    const {
      unitNumber,
      buildingNumber,
      street,
      suburb,
      state,
      postcode
    } = property.address

    const concatnumber = `${unitNumber || ''} ${buildingNumber}`.trim()
    const concataddress = `${concatnumber} ${street} ${suburb} ${state} ${postcode}`

    return {
      concataddress,
      type: property.type,
      workflow: property.workflow
    }
  })
  
  res.status(200).json({
    response: report
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Hometrack listening on port ${PORT} ...`)
})
