const authorizeToken = async (req, res) => {
  return res.status(200).json('Authorized');
};

module.exports = {
  authorizeToken
};