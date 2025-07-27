import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

filename = r"d:\Python\Python_Projects\Expense_Tracker\Main.sql"

def read_sql_file(filename):
    with open(filename, "r") as file:
        return file.read()
   
      
        

def create_database():
    # Connect to Expense_data.db
    conn = sqlite3.connect("Expense_data.db")
    # Read SQL from Main.sql
    sql_content = read_sql_file(r"d:\Python\Python_Projects\Expense_Tracker\Main.sql")
    # Execute the CREATE TABLE
    conn.executescript(sql_content)
    # Save and close
    conn.commit()
    conn.close()
    
@app.route('/api/expenses', methods=['POST'])
def add_expense():
    try:
    # Get data from the request
        data = request.get_json()
        
        # Validation 1: Check that all required fields are provided
        required_fields = ['item', 'price', 'date', 'location', 'category']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Extract the expense data
        item = data['item'].strip()
        price = float(data['price'])
        date = data['date'].strip()
        location = data['location'].strip()
        category = data['category'].strip()
        
        # Validation 2: Check that category is one of the 7 allowed categories
        allowed_categories = ['Housing', 'Utilities', 'Subscriptions', 'Food', 'Car', 'Miscellaneous', 'Kids']
        if category not in allowed_categories:
            return jsonify({"error": f"Invalid category. Must be one of: {', '.join(allowed_categories)}"}), 400
        
        # Validation 3: Check that price is a positive number
        if price <= 0:
            return jsonify({"error": "Price must be a positive number"}), 400
        
        # Connect to database and insert the expense
        conn = sqlite3.connect("Expense_data.db")
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO Expenses (item, price, date, location, category)
            VALUES (?, ?, ?, ?, ?)
        """, (item, price, date, location, category))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Expense added successfully!"}), 201
        
    except ValueError as e:
        return jsonify({"error": "Invalid price format. Must be a number."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        # Connect to database
        conn = sqlite3.connect("Expense_data.db")
        cursor = conn.cursor()
        
        # Get all expenses sorted by date (newest first)
        cursor.execute("""
            SELECT id, item, price, date, location, category 
            FROM Expenses 
            ORDER BY date DESC
        """)
        
        # Fetch all results
        expenses = cursor.fetchall()
        
        # Convert to list of dictionaries for JSON response
        expense_list = []
        for expense in expenses:
            expense_dict = {
                'id': expense[0],
                'item': expense[1],
                'price': expense[2],
                'date': expense[3],
                'location': expense[4],
                'category': expense[5]
            }
            expense_list.append(expense_dict)
        
        conn.close()
        
        return jsonify(expense_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Test the database creation
if __name__ == "__main__":
    create_database()
    print("Database and table created successfully!")
    app.run(debug=True, port=5000)  
    
    
    
