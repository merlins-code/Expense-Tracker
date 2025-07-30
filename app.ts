// Define the structure of an expense
interface Expense {
    item: string;
    price: number;
    date: string;
    location: string;
    category: string;
}

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get form elements
const expenseForm = document.getElementById('expense-form') as HTMLFormElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

// Function to show messages to the user
function showMessage(message: string, isError: boolean = false): void {
    messageDiv.textContent = message;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Function to add an expense
async function addExpense(expense: Expense): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, false);
            expenseForm.reset(); // Clear the form
        } else {
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage('Error connecting to server. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Handle form submission
expenseForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(expenseForm);
    
    const expense: Expense = {
        item: formData.get('item') as string,
        price: parseFloat(formData.get('price') as string),
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        category: formData.get('category') as string
    };

    // Add the expense
    await addExpense(expense);
});

// Set today's date as default
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// Get the load expenses button and expenses list container
const loadExpensesBtn = document.getElementById('load-expenses-btn') as HTMLButtonElement;
const expensesList = document.getElementById('expenses-list') as HTMLDivElement;

// Get the month filter element
const monthFilter = document.getElementById('month-filter') as HTMLSelectElement;
const totalDisplay = document.getElementById('total-display') as HTMLDivElement;
const totalAmount = document.getElementById('total-amount') as HTMLSpanElement;
const expenseCount = document.getElementById('expense-count') as HTMLParagraphElement;

// Function to load and display expenses with optional month filter
async function loadExpenses(): Promise<void> {
    try {
        const selectedMonth = monthFilter.value;
        let url = `${API_BASE_URL}/expenses`;
        
        // Add month filter to URL if selected
        if (selectedMonth) {
            url += `?month=${selectedMonth}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const expenses = await response.json();

        if (response.ok) {
            displayExpenses(expenses);
            calculateAndShowTotal(expenses);
            showMessage(`Loaded ${expenses.length} expenses${selectedMonth ? ` for ${getMonthName(selectedMonth)}` : ''}`, false);
        } else {
            showMessage(expenses.error, true);
        }
    } catch (error) {
        showMessage('Error loading expenses. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Function to calculate and display total
function calculateAndShowTotal(expenses: any[]): void {
    const total = expenses.reduce((sum, expense) => sum + expense.price, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
    expenseCount.textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
    totalDisplay.style.display = 'block';
}

// Function to get month name from YYYY-MM format
function getMonthName(monthValue: string): string {
    const [year, month] = monthValue.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

// Function to display expenses in the list with delete buttons
function displayExpenses(expenses: any[]): void {
    // Clear existing expenses
    expensesList.innerHTML = '';

    if (expenses.length === 0) {
        expensesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No expenses found. Add some expenses first!</p>';
        totalDisplay.style.display = 'none';
        return;
    }

    // Add header
    const header = document.createElement('div');
    header.className = 'expense-item expense-header';
    header.innerHTML = `
        <div><strong>Item</strong></div>
        <div><strong>Price</strong></div>
        <div><strong>Date</strong></div>
        <div><strong>Location</strong></div>
        <div><strong>Category</strong></div>
        <div><strong>Actions</strong></div>
    `;
    expensesList.appendChild(header);

    // Add each expense
    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        
        expenseItem.innerHTML = `
            <div class="expense-field">${expense.item}</div>
            <div class="expense-field expense-price">$${expense.price.toFixed(2)}</div>
            <div class="expense-field">${expense.date}</div>
            <div class="expense-field">${expense.location}</div>
            <div class="expense-category">${expense.category}</div>
            <div class="expense-actions">
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
        
        expensesList.appendChild(expenseItem);
    });
}

// Function to delete an expense
async function deleteExpense(expenseId: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, false);
            loadExpenses(); // Reload the expenses list
        } else {
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage('Error deleting expense. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Make deleteExpense available globally for onclick handlers
(window as any).deleteExpense = deleteExpense;

// Add event listener for month filter changes
monthFilter.addEventListener('change', loadExpenses);
