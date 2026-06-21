const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Vaccination listing not implemented yet' });
});

router.post('/', (req, res) => {
  const { pet_id, vaccine_name, date, notes } = req.body;

  if (!pet_id) {
    return res.status(400).json({ error: 'pet_id is required' });
  }

  if (!vaccine_name || vaccine_name.length < 2) {
    return res.status(400).json({ error: 'vaccine name is invalid' });
  }

  if (!date) {
    return res.status(400).json({ error: 'date is required' });
  }

  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'invalid date' });
  }

  return res.status(201).json({
    message: 'Vaccination validation passed (not saved yet)'
  });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Vaccination detail not implemented yet' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ error: 'Vaccination update not implemented yet' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ error: 'Vaccination deletion not implemented yet' });
});

module.exports = router;