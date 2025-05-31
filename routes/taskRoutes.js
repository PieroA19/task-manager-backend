const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');

// Middleware de validación
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

// Crear tarea
router.post('/', validateTask, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la tarea.' });
  }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
});

// Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea.' });
  }
});

// Actualizar tarea
router.put('/:id', validateTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la tarea.' });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea.' });
  }
});

module.exports = router;
