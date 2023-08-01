// Its exception will handle all aync & await functions only.
module.exports = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  