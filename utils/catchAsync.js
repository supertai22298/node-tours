// Nhận vào 1 function và trả về 1 function dành cho express call
module.exports = (asyncFunc) => (req, res, next) => {
  asyncFunc(req, res, next).catch(next)
}
