const Movement = require("../models/movement_model");
const Utils = require("../../utils/util");

const createMovement = async (req, res) => {
  const movement = req.body;
  if (!movement.name) return res.status(400).json({ error: "Movement name cannot be empty" });
  if (movement.name.length > 20)
    return res.status(400).json({ error: "Movement name including spaces cannot be more than 20 characters" });

  const link = movement.demo_link;
  if (link && link.slice(0, 24) !== "https://www.youtube.com/" && link.slice(0, 17) !== "https://youtu.be/")
    res.status(400).json({
      error: "you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"
    });

  let user = req.user;
  movement.creator_id = user.id;
  let result = await Movement.createMovement(movement);
  res.json(result);
};

const updateMovement = async (req, res) => {
  const movement = req.body;
  if (!movement.name) return res.status(400).json({ error: "Movement name cannot be empty" });
  if (movement.name.length > 20)
    return res.status(400).json({ error: "Movement name including spaces cannot be more than 20 characters" });

  let link = movement.demo_link;
  if (link && link.slice(0, 24) !== "https://www.youtube.com/" && link.slice(0, 17) !== "https://youtu.be/")
    res.status(400).json({
      error:
        "if you are providing link, you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"
    });

  let user = req.user;
  movement.creator_id = user.id;
  let result = await Movement.updateMovement(movement);
  res.json(result);
};

const getMovements = async (req, res) => {
  let results = await Movement.getMovements();

  Utils.addYoutubeIdProperty(results);
  Utils.addYoutubeEmbedLinkProperty(results);
  Utils.addReactSelectProperties(results, "id", "name");

  res.json(results);
};

const deleteMovement = async (req, res) => {
  id = req.params.id;
  let result = await Movement.deleteMovement(id);
  res.json(result);
};

module.exports = {
  createMovement,
  getMovements,
  updateMovement,
  deleteMovement
};
