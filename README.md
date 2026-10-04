# PROG2002 A2 - City Hope Foundation (Charity Events Website)

## Project Structure
```
PROG2002-A2/
├── api/                        <- A2-api (server side)
│   ├── server.js               # Express RESTful API
│   ├── event_db.js             # MySQL connection module (required name)
│   ├── package.json
│   ├── database/
│   │   └── charityevents_db.sql  # Database script for markers
│   └── public/                 <- A2-clientside (client side)
│       ├── home.html           # Home page
│       ├── search.html         # Search events page
│       ├── event.html          # Event detail page
│       ├── css/style.css
│       └── js/common.js
└── PROG2002 A2 Report - Filled.docx
```

## How to Run

### 1. Start MySQL (XAMPP)
Open XAMPP Control Panel, click **Start** next to MySQL.

### 2. Create the database (first time only)
```bash
cd api/database
C:/xampp/mysql/bin/mysql.exe -u root -e "source charityevents_db.sql"
```
Or use MySQL Workbench: open `charityevents_db.sql` and run it.

### 3. Start the API server
```bash
cd api
npm install        # first time only
npm start
```

### 4. Open the website
Browser: http://localhost:3000/home.html

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/events | Active upcoming events (Home page) |
| GET | /api/categories | All categories (Search dropdown) |
| GET | /api/events/search?date=&location=&category_id= | Filter events |
| GET | /api/events/:id | Full event details |
| GET | /api/health | Health check |
