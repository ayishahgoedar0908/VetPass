const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Medical record listing not implemented yet' });
});

router.post('/', (req, res) => {
  const { pet_id, name, dosage, notes, date } = req.body;

  if (!pet_id) {
    return res.status(400).json({ error: 'pet_id is required' });
  }

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'name is invalid' });
  }

  if (!dosage) {
    return res.status(400).json({ error: 'dosage is required' });
  }

  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'invalid date' });
  }

  return res.status(201).json({
    message: 'Medical record validation passed (not saved yet)'
  });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Medical record detail not implemented yet' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ error: 'Medical record update not implemented yet' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ error: 'Medical record deletion not implemented yet' });
});

module.exports = router;