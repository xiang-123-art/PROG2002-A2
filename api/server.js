// =====================================================
// server.js - RESTful API for the Charity Events Website
// PROG2002 Assessment 2 - City Hope Foundation
// Stack: Node.js + Express + MySQL
//
// Endpoints (all GET - POST/PUT/DELETE come in A3):
//   GET /api/events            -> current & upcoming active events (Home page)
//   GET /api/categories        -> all event categories (Search page dropdown)
//   GET /api/events/search     -> filter events by date/location/category
//   GET /api/events/:id        -> full details of one event (Detail page)
//   GET /api/health            -> simple health check
// =====================================================

const express = require('express');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// Serve the client-side website as static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Allow the client pages to call this API from other origins/ports if needed
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// -----------------------------------------------------
// GET /api/health - health check
// -----------------------------------------------------
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Database unreachable' });
    }
});

// -----------------------------------------------------
// GET /api/events - Home page data
// Returns all ACTIVE events whose date is today or later
// (suspended and past events are excluded).
// -----------------------------------------------------
app.get('/api/events', async (req, res) => {
    try {
        const sql = `
            SELECT e.event_id, e.event_name, e.event_date, e.location,
                   e.ticket_price, e.goal_amount, e.raised_amount,
                   c.category_name
            FROM events e
            JOIN categories c ON e.category_id = c.category_id
            WHERE e.status = 'active'
              AND e.event_date >= CURDATE()
            ORDER BY e.event_date ASC`;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve events' });
    }
});

// -----------------------------------------------------
// GET /api/categories - list of event categories
// Used to build the category dropdown on the Search page
// -----------------------------------------------------
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT category_id, category_name FROM categories ORDER BY category_name'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve categories' });
    }
});

// -----------------------------------------------------
// GET /api/events/search?date=&location=&category_id=
// Search page data. All criteria are optional and can be
// combined (AND logic). Only active events are returned.
//   date        - exact date (YYYY-MM-DD) or ISO month (YYYY-MM)
//   location    - free text, partial match (LIKE %...%)
//   category_id - numeric category id
// -----------------------------------------------------
app.get('/api/events/search', async (req, res) => {
    try {
        const { date, location, category_id } = req.query;

        const conditions = ["e.status = 'active'"];
        const params = [];

        if (date) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                conditions.push('e.event_date = ?');
                params.push(date);
            } else if (/^\d{4}-\d{2}$/.test(date)) {
                // Allow "YYYY-MM" to match the whole month
                conditions.push("DATE_FORMAT(e.event_date, '%Y-%m') = ?");
                params.push(date);
            } else {
                return res.status(400).json({
                    message: 'Invalid date format. Use YYYY-MM-DD or YYYY-MM.'
                });
            }
        }
        if (location && location.trim() !== '') {
            conditions.push('e.location LIKE ?');
            params.push(`%${location.trim()}%`);
        }
        if (category_id) {
            const catId = parseInt(category_id, 10);
            if (isNaN(catId)) {
                return res.status(400).json({ message: 'Invalid category id.' });
            }
            conditions.push('e.category_id = ?');
            params.push(catId);
        }

        const sql = `
            SELECT e.event_id, e.event_name, e.event_date, e.location,
                   e.ticket_price, e.goal_amount, e.raised_amount,
                   e.purpose, e.image_url, c.category_name
            FROM events e
            JOIN categories c ON e.category_id = c.category_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY e.event_date ASC`;

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Search failed' });
    }
});

// -----------------------------------------------------
// GET /api/events/:id - Event detail page data
// Returns full information for one event (active only).
// -----------------------------------------------------
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        if (isNaN(eventId)) {
            return res.status(400).json({ message: 'Invalid event id.' });
        }

        const sql = `
            SELECT e.*, c.category_name, o.org_name,
                   o.contact_email, o.contact_phone
            FROM events e
            JOIN categories c ON e.category_id = c.category_id
            JOIN organisations o ON e.org_id = o.org_id
            WHERE e.event_id = ? AND e.status = 'active'`;

        const [rows] = await db.query(sql, [eventId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve event details' });
    }
});

// 404 for unknown API routes
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Charity Events API running at http://localhost:${PORT}`);
    console.log(`Client website served from http://localhost:${PORT}/home.html`);
});
