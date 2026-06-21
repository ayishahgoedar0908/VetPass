const express = require('express');
const db = require('../config/db');

const auth = require('../middlewares/auth');
const {
  validateRequest,
  requiredInteger,
  optionalInteger,
  requiredString,
  optionalString,
  optionalDate,
  optionalEnumValue,
} = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth);

const idParamSchema = {
  params: {
    id: requiredInteger('id', { min: 1 }),
  },
};

const createPetSchema = {
  body: {
    owner_id: optionalInteger('owner_id', { min: 1 }),
    name: requiredString('name', { min: 2, max: 100 }),
    species: requiredString('species', { min: 2, max: 60 }),
    breed: optionalString('breed', { max: 100 }),
    birthdate: optionalDate('birthdate'),
    birth_date: optionalDate('birth_date'),
    gender: optionalEnumValue('gender', ['male', 'female', 'unknown']),
    microchip_number: optionalString('microchip_number', { min: 5, max: 64 }),
    notes: optionalString('notes', { max: 5000 }),
  },
};

const updatePetSchema = {
  params: idParamSchema.params,
  body: {
    name: optionalString('name', { min: 2, max: 100 }),
    species: optionalString('species', { min: 2, max: 60 }),
    breed: optionalString('breed', { max: 100 }),
    birthdate: optionalDate('birthdate'),
    birth_date: optionalDate('birth_date'),
    gender: optionalEnumValue('gender', ['male', 'female', 'unknown']),
    microchip_number: optionalString('microchip_number', { min: 5, max: 64 }),
    notes: optionalString('notes', { max: 5000 }),
  },
};

router.get('/', async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? 'SELECT * FROM pets ORDER BY created_at DESC'
      : 'SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC';
    const params = isAdmin ? [] : [req.user.id];

    const [rows] = await db.execute(query, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

router.post('/', validateRequest(createPetSchema), async (req, res) => {
  const {
    owner_id,
    name,
    species,
    breed,
    birthdate,
    birth_date,
    gender,
    microchip_number,
    notes,
  } = req.body;

  try {
    const userId = req.user.role === 'admin' && owner_id ? owner_id : req.user.id;
    const [result] = await db.execute(
      `INSERT INTO pets (user_id, name, species, breed, gender, birth_date, microchip_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        species,
        breed || null,
        gender || 'unknown',
        birth_date || birthdate || null,
        microchip_number || null,
        notes || null,
      ]
    );

    return res.status(201).json({
      message: 'Pet added successfully',
      petId: result.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Microchip number already exists' });
    }

    return res.status(500).json({ error: 'Failed to create pet' });
  }
});

router.get('/:id', validateRequest(idParamSchema), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pets WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const pet = rows[0];
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && pet.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed to view this pet' });
    }

    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pet' });
  }
});

router.put('/:id', validateRequest(updatePetSchema), async (req, res) => {
  const {
    name,
    species,
    breed,
    gender,
    birthdate,
    birth_date,
    microchip_number,
    notes,
  } = req.body;

  try {
    const [existingRows] = await db.execute('SELECT * FROM pets WHERE id = ?', [req.params.id]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const pet = existingRows[0];
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && pet.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed to update this pet' });
    }

    await db.execute(
      `UPDATE pets
       SET name = ?, species = ?, breed = ?, gender = ?, birth_date = ?, microchip_number = ?, notes = ?
       WHERE id = ?`,
      [
        name ?? pet.name,
        species ?? pet.species,
        breed ?? pet.breed,
        gender ?? pet.gender,
        birth_date ?? birthdate ?? pet.birth_date,
        microchip_number ?? pet.microchip_number,
        notes ?? pet.notes,
        req.params.id,
      ]
    );

    return res.json({ message: 'Pet updated' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Microchip number already exists' });
    }

    return res.status(500).json({ error: 'Failed to update pet' });
  }
});

router.delete('/:id', validateRequest(idParamSchema), async (req, res) => {
  try {
    const [existingRows] = await db.execute('SELECT * FROM pets WHERE id = ?', [req.params.id]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const pet = existingRows[0];
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && pet.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed to delete this pet' });
    }

    await db.execute('DELETE FROM pets WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Pet deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete pet' });
  }
});

module.exports = router;
