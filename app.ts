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
