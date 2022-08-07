const Movement = require("../models/movement_model");
const ObjPropertyUtils = require("../../utils/obj_property_util");

const createMovement = async (req, res) => {
  const movement = req.body;
  if (!movement.name) return res.status(400).json({ error: "Movement name cannot be empty" });
  if (movement.name.length > 20)
    return res.status(400).json({ error: "Movement name including spaces cannot be more than 20 characters" });

  const link = movement.demo_link;
  if (link && link.slice(0, 24) !== "https://www.youtube.com/" && link.slice(0, 17) !== "https://youtu.be/")
    return res.status(400).json({
      error: "you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"
    });

  const user = req.user;
  movement.creator_id = user.id;
  const result = await Movement.createMovement(movement);
  res.json(result);
};

const updateMovement = async (req, res) => {
  const movement = req.body;
  if (!movement.name) return res.status(400).json({ error: "Movement name cannot be empty" });
  if (movement.name.length > 20)
    return res.status(400).json({ error: "Movement name including spaces cannot be more than 20 characters" });

  const link = movement.demo_link;
  if (link && link.slice(0, 24) !== "https://www.youtube.com/" && link.slice(0, 17) !== "https://youtu.be/")
    return res.status(400).json({
      error:
        "if you are providing link, you must provide youtube link, ex:'https://www.youtube.com/...' or 'https://youtu.be/...'"
    });

  const user = req.user;
  movement.creator_id = user.id;
  const result = await Movement.updateMovement(movement);
  res.json(result);
};

const getMovements = async (req, res) => {
  const results = await Movement.getMovements();

  ObjPropertyUtils.addYoutubeIdProperty(results);
  ObjPropertyUtils.addYoutubeEmbedLinkProperty(results);
  ObjPropertyUtils.addReactSelectProperties(results, "id", "name");

  res.json(results);
};

const deleteMovement = async (req, res) => {
  id = req.params.id;
  const result = await Movement.deleteMovement(id);
  res.json(result);
};

module.exports = {
  createMovement,
  getMovements,
  updateMovement,
  deleteMovement
};
