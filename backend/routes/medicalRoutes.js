const express = require('express');

const auth = require('../middlewares/auth');
const {
  validateRequest,
  requiredInteger,
  requiredString,
  optionalString,
  requiredDate,
} = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth);

const idParamSchema = {
  params: {
    id: requiredInteger('id', { min: 1 }),
  },
};

const createMedicalRecordSchema = {
  body: {
    pet_id: requiredInteger('pet_id', { min: 1 }),
    name: requiredString('name', { min: 2, max: 150 }),
    dosage: requiredString('dosage', { min: 1, max: 120 }),
    notes: optionalString('notes', { max: 5000 }),
    date: requiredDate('date'),
  },
};

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Medical record listing not implemented yet' });
});

router.post('/', validateRequest(createMedicalRecordSchema), (req, res) => {
  return res.status(201).json({
    message: 'Medical record validation passed (not saved yet)'
  });
});

router.get('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Medical record detail not implemented yet' });
});

router.put('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Medical record update not implemented yet' });
});

router.delete('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Medical record deletion not implemented yet' });
});

module.exports = router;
