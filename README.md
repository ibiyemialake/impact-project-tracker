# Impact Project Tracker
A full-stack application for tracking impact projects with JSON-LD support.

## Technology Stack
**Backend:** Python with FastAPI framework  
**Frontend:** HTML, CSS, Vanilla JavaScript  
**Storage:** In-memory (no database)

## Project Structure
impact-project-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes
│   │   ├── models.py            # Data models
│   │   └── validators.py        # JSON-LD validation
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── README.md
```

## Setup & Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # macOS/Linux
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install fastapi==0.104.1 "uvicorn[standard]==0.24.0" pydantic==2.5.0
   ```

4. **Run the server:**
   ```bash
   python3 run.py
   ```
   Server runs at `http://127.0.0.1:8000`

### Frontend Setup

**Open `frontend/index.html` in your browser:**
- Double-click the file, or
- Use VS Code Live Server extension, or
- Run `python -m http.server 3000` in frontend directory

## API Endpoints

### POST /projects
Submit a new project with JSON-LD format:
```json
{
  "@context": {
    "ex": "http://example.org/impact/",
    "projectName": "ex:projectName",
    "status": "ex:status"
  },
  "@type": "ex:ImpactProject",
  "projectName": "Community Health Initiative",
  "status": "Ongoing"
}
```

**Valid statuses:** `"Planned"`, `"Ongoing"`, `"Completed"`

### GET /projects
Retrieve all projects:
```json
[
  {"projectName": "Community Health Initiative", "status": "Ongoing"},
  {"projectName": "Youth Program", "status": "Planned"}
]
```

## Testing

**Quick Test:**
```bash
# Test project creation
curl -X POST http://127.0.0.1:8000/projects \
  -H "Content-Type: application/json" \
  -d '{"@context":{"ex":"http://example.org/impact/","projectName":"ex:projectName","status":"ex:status"},"@type":"ex:ImpactProject","projectName":"Test Project","status":"Ongoing"}'

# Get all projects
curl http://127.0.0.1:8000/projects
```

**Interactive Documentation:** Visit `http://127.0.0.1:8000/docs`

## JSON-LD Implementation

**Parsing Approach:**
- Uses built-in JSON parsing with direct property access
- Validates required JSON-LD fields (`@context`, `@type`)
- Extracts `projectName` and `status` for business logic validation
- Accepts any valid namespace URI but expects specific property names

**Processing Flow:**
```
JSON-LD Input → Structure Validation → Data Extraction → Business Validation → Storage
```

## Assumptions & Limitations

### Assumptions
- Local development environment
- Modern browser
- Single user, trusted input
- Simple JSON-LD structure (no complex semantic processing)

### Limitations
- **Data Loss:** In-memory storage only - data lost on server restart
- **No Authentication:** No user login or access control
- **Basic JSON-LD:** Direct property access, not full JSON-LD processing
- **No Persistence:** No database or file storage
- **Development CORS:** Allows all origins (not production-ready)

## Troubleshooting

**"ModuleNotFoundError":** Ensure virtual environment is activated  
**Frontend not loading:** Check backend is running on port 8000  
**CORS errors:** Verify API URL is `http://127.0.0.1:8000`

**Verify Setup:**
```bash
# Check virtual environment
which python  # Should show venv path

# Test server
curl http://127.0.0.1:8000/
```
