// централизованная обработка ошибок
// обработчик принимает на себя все ошибки, которые были переданы с помощью next(err)
module.exports = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  // console.log(`Status: ${statusCode}, Err: ${message}`);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
