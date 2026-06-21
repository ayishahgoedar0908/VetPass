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

const createVaccinationSchema = {
  body: {
    pet_id: requiredInteger('pet_id', { min: 1 }),
    vaccine_name: requiredString('vaccine_name', { min: 2, max: 120 }),
    date: requiredDate('date'),
    notes: optionalString('notes', { max: 5000 }),
  },
};

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Vaccination listing not implemented yet' });
});

router.post('/', validateRequest(createVaccinationSchema), (req, res) => {
  return res.status(201).json({
    message: 'Vaccination validation passed (not saved yet)'
  });
});

router.get('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Vaccination detail not implemented yet' });
});

router.put('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Vaccination update not implemented yet' });
});

router.delete('/:id', validateRequest(idParamSchema), (req, res) => {
  res.status(501).json({ error: 'Vaccination deletion not implemented yet' });
});

module.exports = router;
