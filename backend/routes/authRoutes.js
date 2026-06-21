const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');
const auth = require('../middlewares/auth');
const {
    validateRequest,
    requiredEmail,
    requiredPassword,
    requiredString,
    optionalEnumValue,
} = require('../middlewares/validateRequest');

const router = express.Router();

const registerSchema = {
    body: {
        name: requiredString('name', { min: 2, max: 100 }),
        email: requiredEmail,
        password: requiredPassword,
        role: optionalEnumValue('role', ['user', 'admin']),
    },
};

const loginSchema = {
    body: {
        email: requiredEmail,
        password: requiredString('password', { min: 1, max: 255 }),
    },
};

router.post('/register', validateRequest(registerSchema), async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'user']
        );

        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email is al in gebruik' });
        }

        return res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/login', validateRequest(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'JWT_SECRET ontbreekt in configuratie' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to login' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ user: rows[0] });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

module.exports = router;
