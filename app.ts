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
            await calculateAndShowFinancialSummary(expenses);
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

// Get paycheck form elements
const paycheckForm = document.getElementById('paycheck-form') as HTMLFormElement;
const financialSummary = document.getElementById('financial-summary') as HTMLDivElement;
const totalIncome = document.getElementById('total-income') as HTMLSpanElement;
const totalExpensesSpan = document.getElementById('total-expenses') as HTMLSpanElement;
const remainingBalance = document.getElementById('remaining-balance') as HTMLSpanElement;

// Function to add a paycheck
async function addPaycheck(paycheck: any): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/paychecks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paycheck)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, false);
            paycheckForm.reset(); // Clear the form
            loadExpenses(); // Refresh the financial summary
        } else {
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage('Error connecting to server. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Handle paycheck form submission
paycheckForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(paycheckForm);
    
    const paycheck = {
        amount: parseFloat(formData.get('amount') as string),
        date: formData.get('date') as string,
        description: formData.get('description') as string
    };

    // Add the paycheck
    await addPaycheck(paycheck);
});

// Function to load paychecks for the selected month
async function loadPaychecks(selectedMonth?: string): Promise<number> {
    try {
        let url = `${API_BASE_URL}/paychecks`;
        
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

        const paychecks = await response.json();

        if (response.ok) {
            // Calculate total income
            const totalIncomeAmount = paychecks.reduce((sum: number, paycheck: any) => sum + paycheck.amount, 0);
            return totalIncomeAmount;
        } else {
            showMessage(paychecks.error, true);
            return 0;
        }
    } catch (error) {
        console.error('Error loading paychecks:', error);
        return 0;
    }
}

// Updated function to calculate and show financial summary
async function calculateAndShowFinancialSummary(expenses: any[]): Promise<void> {
    const selectedMonth = monthFilter.value;
    
    // Calculate total expenses
    const totalExpensesAmount = expenses.reduce((sum, expense) => sum + expense.price, 0);
    
    // Load paychecks for the same period
    const totalIncomeAmount = await loadPaychecks(selectedMonth);
    
    // Calculate remaining balance
    const balance = totalIncomeAmount - totalExpensesAmount;
    
    // Update display
    totalIncome.textContent = `$${totalIncomeAmount.toFixed(2)}`;
    totalExpensesSpan.textContent = `$${totalExpensesAmount.toFixed(2)}`;
    remainingBalance.textContent = `$${balance.toFixed(2)}`;
    
    // Change color based on balance
    const balanceItem = remainingBalance.closest('.summary-item');
    if (balance < 0) {
        balanceItem?.classList.add('negative');
    } else {
        balanceItem?.classList.remove('negative');
    }
    
    expenseCount.textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
    financialSummary.style.display = 'block';
}

// Set today's date as default for paycheck form
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date') as HTMLInputElement;
    const paycheckDateInput = document.getElementById('paycheck-date') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    paycheckDateInput.value = today;
});

// Make deleteExpense available globally for onclick handlers
(window as any).deleteExpense = deleteExpense;

// Add event listener for month filter changes
monthFilter.addEventListener('change', loadExpenses);

// Get paycheck viewing elements
const togglePaychecksBtn = document.getElementById('toggle-paychecks-btn') as HTMLButtonElement;
const loadPaychecksBtn = document.getElementById('load-paychecks-btn') as HTMLButtonElement;
const paychecksContainer = document.getElementById('paychecks-container') as HTMLDivElement;
const paychecksList = document.getElementById('paychecks-list') as HTMLDivElement;

// Variable to track if paychecks are currently visible
let paychecksVisible = false;

// Function to toggle paycheck visibility
function togglePaychecksView(): void {
    paychecksVisible = !paychecksVisible;
    
    if (paychecksVisible) {
        paychecksContainer.style.display = 'block';
        loadPaychecksBtn.style.display = 'inline-block';
        togglePaychecksBtn.textContent = 'Hide Paychecks';
        loadAndDisplayPaychecks(); // Load paychecks when showing
    } else {
        paychecksContainer.style.display = 'none';
        loadPaychecksBtn.style.display = 'none';
        togglePaychecksBtn.textContent = 'Show Paychecks';
    }
}

// Function to load and display paychecks
async function loadAndDisplayPaychecks(): Promise<void> {
    try {
        const selectedMonth = monthFilter.value;
        let url = `${API_BASE_URL}/paychecks`;
        
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

        const paychecks = await response.json();

        if (response.ok) {
            displayPaychecks(paychecks);
            showMessage(`Loaded ${paychecks.length} paycheck${paychecks.length !== 1 ? 's' : ''}${selectedMonth ? ` for ${getMonthName(selectedMonth)}` : ''}`, false);
        } else {
            showMessage(paychecks.error, true);
        }
    } catch (error) {
        showMessage('Error loading paychecks. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Function to display paychecks in the list
function displayPaychecks(paychecks: any[]): void {
    // Clear existing paychecks
    paychecksList.innerHTML = '';

    if (paychecks.length === 0) {
        paychecksList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No paychecks found for this period.</p>';
        return;
    }

    // Add header
    const header = document.createElement('div');
    header.className = 'paycheck-item paycheck-header';
    header.innerHTML = `
        <div><strong>Description</strong></div>
        <div><strong>Amount</strong></div>
        <div><strong>Date</strong></div>
        <div><strong>Actions</strong></div>
    `;
    paychecksList.appendChild(header);

    // Add each paycheck
    paychecks.forEach(paycheck => {
        const paycheckItem = document.createElement('div');
        paycheckItem.className = 'paycheck-item';
        
        const description = paycheck.description || 'No description';
        
        paycheckItem.innerHTML = `
            <div class="paycheck-field paycheck-description">${description}</div>
            <div class="paycheck-field paycheck-amount">$${paycheck.amount.toFixed(2)}</div>
            <div class="paycheck-field">${paycheck.date}</div>
            <div class="expense-actions">
                <button class="delete-btn" onclick="deletePaycheck(${paycheck.id})">Delete</button>
            </div>
        `;
        
        paychecksList.appendChild(paycheckItem);
    });
}

// Function to delete a paycheck
async function deletePaycheck(paycheckId: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this paycheck?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/paychecks/${paycheckId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, false);
            loadAndDisplayPaychecks(); // Reload the paychecks list
            loadExpenses(); // Refresh the financial summary
        } else {
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage('Error deleting paycheck. Make sure your Flask API is running.', true);
        console.error('Error:', error);
    }
}

// Make deletePaycheck available globally for onclick handlers
(window as any).deletePaycheck = deletePaycheck;

// Add event listeners
togglePaychecksBtn.addEventListener('click', togglePaychecksView);
loadPaychecksBtn.addEventListener('click', loadAndDisplayPaychecks);

// Update the month filter change listener to also refresh paychecks if visible
monthFilter.addEventListener('change', () => {
    loadExpenses();
    if (paychecksVisible) {
        loadAndDisplayPaychecks();
    }
});
