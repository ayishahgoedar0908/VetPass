const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Vaccination listing not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Vaccination creation not implemented yet' });
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