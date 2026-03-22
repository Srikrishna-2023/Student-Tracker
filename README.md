# ResultTrack — Student Result Tracker

A web application to track and manage student results built with Flask, Bootstrap, jQuery and SQLite.

## Features
- Add student results with marks and subject
- View all results with grade and pass/fail status
- Search results by student name or ID
- Live percentage and grade preview while entering marks
- Client-side form validation with jQuery
- Server-side validation with Flask

## Technologies Used
- **Backend:** Python, Flask, SQLite
- **Frontend:** HTML5, Bootstrap 5, CSS3, JavaScript, jQuery
- **Templating:** Jinja2

## Project Structure
```
student-tracker/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── submit.html
│   ├── success.html
│   └── search.html
├── app.py
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd student-tracker
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Open in browser:**
   ```
   http://localhost:5000
   ```

## Grading System
| Percentage | Grade |
|------------|-------|
| 90 - 100   | A+    |
| 80 - 89    | A     |
| 70 - 79    | B     |
| 60 - 69    | C     |
| 50 - 59    | D     |
| Below 50   | F     |

Pass mark: 50%
