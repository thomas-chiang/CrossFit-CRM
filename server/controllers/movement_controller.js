const Movement = require('../models/movement_model')

const createMovement = async (req, res) => {
  const movement = req.body
  if (!movement.name) return res.status(400).json({error:'Movement name cannot be empty'})

  let link = movement.demo_link
  if (link && link.slice(0,24) !== 'https://www.youtube.com/' && link.slice(0,17) !== 'https://youtu.be/') 
    res.status(400).json({error:"you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"})

  let user = req.user
  movement.creator_id = user.id
  let result = await Movement.createMovement(movement)
  res.json(result);
};

const updateMovement = async (req, res) => {
  const movement = req.body
  if (!movement.name) return res.status(400).json({error:'Movement name cannot be empty'})

  let link = movement.demo_link
  if (link && link.slice(0,24) !== 'https://www.youtube.com/' && link.slice(0,17) !== 'https://youtu.be/') 
    res.status(400).json({error:"you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"})
  // let embedLink = 'https://www.youtube.com/embed/'
  // if (originalLink.includes('https://www.youtube.com/')) embedLink += originalLink.slice(24)
  // if (originalLink.includes('https://youtu.be/')) embedLink += originalLink.slice(17)
  // movement.demo_link = embedLink

  let user = req.user
  movement.creator_id = user.id
  let result = await Movement.updateMovement(movement)
  res.json(result);
};

const getMovements = async (req, res) => {
  let result = await Movement.getMovements()

  for (let item of result) {

    let originalLink = item.demo_link
    let embedLink = 'https://www.youtube.com/embed/'
    if (originalLink !== null) {
      if (originalLink.includes('https://www.youtube.com/')) embedLink += originalLink.slice(originalLink.indexOf('watch?v=')+8, originalLink.indexOf('&'))
      if (originalLink.includes('https://youtu.be/')) embedLink += originalLink.slice(17)
      item.embed_link = embedLink
    }
    
    item.value = item.id
    item.label = item.name
  }
  res.json(result)
}

const deleteMovement = async (req, res) => {
  id = req.params.id
  let result = await Movement.deleteMovement(id)
  res.json(result)
}


module.exports = {
  createMovement,
  getMovements,
  updateMovement,
  deleteMovement
}