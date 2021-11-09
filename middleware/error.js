exports.errorMiddleWare = (err, req, res, next) => {
  console.log(JSON.stringify(err, null, 2));
  let code;
  let message;
  res.status(code || 500).json({ message: message || err.message });
};
