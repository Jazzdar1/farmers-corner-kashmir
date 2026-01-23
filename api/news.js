module.exports = function (req, res) {
  res.status(200).json({
    ok: true,
    message: "News API working (CommonJS)"
  });
};
