const { creditCard } = require('../../models')
const responseUtil = require('../../utils/resposeUtil')

const authDriverCard = async (req, res) => {
  let data = ''

  if (req.headers['content-type'] !== 'application/json') throw new Error('Server supports only JSON.')

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', async () => {
    try {
      const { creditCardId } = JSON.parse(data)
      const card = await creditCard.findOne({ where: { id: creditCard } })
      if (card !== null && card.cardValidDate <= new Date().toJSON().slice(0, 10)) {
        const card = await creditCard.update({ isAuthorized: true }, { where: { id: creditCardId } })
        if (card[0] !== 0) {
          responseUtil(res, 200, 'The card now is authorized.')
        }
      } else {
        responseUtil(res, 404, 'The card was not found or card was expired.', true)
      }
    } catch (error) {
      const msg = error.errors ? error.errors[0].message : error.message
      responseUtil(res, 400, msg, true)
    }
  })
  req.on('error', (error) => {
    responseUtil(res, 500, error.message, true)
  })
}

module.exports = authDriverCard
