// middlewares/validateTask.js
const { body, validationResult } = require('express-validator');

const validateTask = [
  body('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
  
  body('completed')
    .optional()
    .isBoolean().withMessage('El estado debe ser booleano (true o false)'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = validateTask;
