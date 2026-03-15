from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'student_tracker_secret_key'

DATABASE = 'results.db'

def get_db():
    """Get database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database and create tables."""
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            marks INTEGER NOT NULL,
            total INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def calculate_grade(marks, total):
    """Calculate grade and pass/fail based on marks."""
    percentage = (marks / total) * 100
    if percentage >= 90:
        grade = 'A+'
    elif percentage >= 80:
        grade = 'A'
    elif percentage >= 70:
        grade = 'B'
    elif percentage >= 60:
        grade = 'C'
    elif percentage >= 50:
        grade = 'D'
    else:
        grade = 'F'
    status = 'Pass' if percentage >= 50 else 'Fail'
    return grade, status, round(percentage, 2)

@app.route('/')
def index():
    """Home page - show all results."""
    conn = get_db()
    results = conn.execute(
        'SELECT * FROM results ORDER BY created_at DESC'
    ).fetchall()
    conn.close()

    # Add grade, status, percentage to each result
    processed = []
    for r in results:
        grade, status, percentage = calculate_grade(r['marks'], r['total'])
        processed.append({
            'id': r['id'],
            'student_id': r['student_id'],
            'name': r['name'],
            'subject': r['subject'],
            'marks': r['marks'],
            'total': r['total'],
            'percentage': percentage,
            'grade': grade,
            'status': status,
            'created_at': r['created_at']
        })

    return render_template('index.html', results=processed)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    """Add new student result."""
    if request.method == 'POST':
        student_id = request.form.get('student_id', '').strip()
        name = request.form.get('name', '').strip()
        subject = request.form.get('subject', '').strip()
        marks = request.form.get('marks', '').strip()
        total = request.form.get('total', '').strip()

        # Server-side validation
        errors = []
        if not student_id:
            errors.append('Student ID is required.')
        if not name:
            errors.append('Student name is required.')
        if not subject:
            errors.append('Subject is required.')
        if not marks or not marks.isdigit():
            errors.append('Marks must be a valid number.')
        if not total or not total.isdigit():
            errors.append('Total marks must be a valid number.')
        if marks.isdigit() and total.isdigit():
            if int(marks) > int(total):
                errors.append('Marks cannot be greater than total marks.')
            if int(total) <= 0:
                errors.append('Total marks must be greater than 0.')

        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template('submit.html',
                                   form_data=request.form)

        conn = get_db()
        conn.execute(
            'INSERT INTO results (student_id, name, subject, marks, total) VALUES (?, ?, ?, ?, ?)',
            (student_id, name, subject, int(marks), int(total))
        )
        conn.commit()
        conn.close()

        flash(f'Result for {name} added successfully!', 'success')
        return redirect(url_for('success', name=name, marks=marks, total=total))

    return render_template('submit.html', form_data={})

@app.route('/success')
def success():
    """Success confirmation page."""
    name = request.args.get('name', '')
    marks = request.args.get('marks', 0)
    total = request.args.get('total', 100)
    grade, status, percentage = calculate_grade(int(marks), int(total))
    return render_template('success.html',
                           name=name,
                           marks=marks,
                           total=total,
                           grade=grade,
                           status=status,
                           percentage=percentage)

@app.route('/search')
def search():
    """Search results by student name or ID."""
    query = request.args.get('q', '').strip()
    results = []

    if query:
        conn = get_db()
        rows = conn.execute(
            '''SELECT * FROM results
               WHERE name LIKE ? OR student_id LIKE ?
               ORDER BY created_at DESC''',
            (f'%{query}%', f'%{query}%')
        ).fetchall()
        conn.close()

        for r in rows:
            grade, status, percentage = calculate_grade(r['marks'], r['total'])
            results.append({
                'id': r['id'],
                'student_id': r['student_id'],
                'name': r['name'],
                'subject': r['subject'],
                'marks': r['marks'],
                'total': r['total'],
                'percentage': percentage,
                'grade': grade,
                'status': status,
            })

    return render_template('search.html', results=results, query=query)
@app.route('/delete/<int:id>', methods=['POST'])
def delete(id):
    conn = get_db()
    conn.execute('DELETE FROM results WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    flash('Result deleted successfully.', 'success')
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
