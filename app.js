var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// API base URL
var API_BASE_URL = 'http://localhost:5000/api';
// Get form elements
var expenseForm = document.getElementById('expense-form');
var messageDiv = document.getElementById('message');
// Function to show messages to the user
function showMessage(message, isError) {
    if (isError === void 0) { isError = false; }
    messageDiv.textContent = message;
    messageDiv.className = "message ".concat(isError ? 'error' : 'success');
    messageDiv.style.display = 'block';
    // Hide message after 5 seconds
    setTimeout(function () {
        messageDiv.style.display = 'none';
    }, 5000);
}
// Function to add an expense
function addExpense(expense) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/expenses"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(expense)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (response.ok) {
                        showMessage(data.message, false);
                        expenseForm.reset(); // Clear the form
                    }
                    else {
                        showMessage(data.error, true);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    showMessage('Error connecting to server. Make sure your Flask API is running.', true);
                    console.error('Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Handle form submission
expenseForm.addEventListener('submit', function (event) { return __awaiter(_this, void 0, void 0, function () {
    var formData, expense;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                formData = new FormData(expenseForm);
                expense = {
                    item: formData.get('item'),
                    price: parseFloat(formData.get('price')),
                    date: formData.get('date'),
                    location: formData.get('location'),
                    category: formData.get('category')
                };
                // Add the expense
                return [4 /*yield*/, addExpense(expense)];
            case 1:
                // Add the expense
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Set today's date as default
document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('date');
    var today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});
// Get the load expenses button and expenses list container
var loadExpensesBtn = document.getElementById('load-expenses-btn');
var expensesList = document.getElementById('expenses-list');
// Get the month filter element
var monthFilter = document.getElementById('month-filter');
var totalDisplay = document.getElementById('total-display');
var totalAmount = document.getElementById('total-amount');
var expenseCount = document.getElementById('expense-count');
// Function to load and display expenses with optional month filter
function loadExpenses() {
    return __awaiter(this, void 0, void 0, function () {
        var selectedMonth, url, response, expenses, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    selectedMonth = monthFilter.value;
                    url = "".concat(API_BASE_URL, "/expenses");
                    // Add month filter to URL if selected
                    if (selectedMonth) {
                        url += "?month=".concat(selectedMonth);
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    expenses = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    displayExpenses(expenses);
                    return [4 /*yield*/, calculateAndShowFinancialSummary(expenses)];
                case 3:
                    _a.sent();
                    showMessage("Loaded ".concat(expenses.length, " expenses").concat(selectedMonth ? " for ".concat(getMonthName(selectedMonth)) : ''), false);
                    return [3 /*break*/, 5];
                case 4:
                    showMessage(expenses.error, true);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    showMessage('Error loading expenses. Make sure your Flask API is running.', true);
                    console.error('Error:', error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Function to calculate and display total
function calculateAndShowTotal(expenses) {
    var total = expenses.reduce(function (sum, expense) { return sum + expense.price; }, 0);
    totalAmount.textContent = "$".concat(total.toFixed(2));
    expenseCount.textContent = "".concat(expenses.length, " expense").concat(expenses.length !== 1 ? 's' : '');
    totalDisplay.style.display = 'block';
}
// Function to get month name from YYYY-MM format
function getMonthName(monthValue) {
    var _a = monthValue.split('-'), year = _a[0], month = _a[1];
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return "".concat(monthNames[parseInt(month) - 1], " ").concat(year);
}
// Function to display expenses in the list with delete buttons
function displayExpenses(expenses) {
    // Clear existing expenses
    expensesList.innerHTML = '';
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No expenses found. Add some expenses first!</p>';
        totalDisplay.style.display = 'none';
        return;
    }
    // Add header
    var header = document.createElement('div');
    header.className = 'expense-item expense-header';
    header.innerHTML = "\n        <div><strong>Item</strong></div>\n        <div><strong>Price</strong></div>\n        <div><strong>Date</strong></div>\n        <div><strong>Location</strong></div>\n        <div><strong>Category</strong></div>\n        <div><strong>Actions</strong></div>\n    ";
    expensesList.appendChild(header);
    // Add each expense
    expenses.forEach(function (expense) {
        var expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = "\n            <div class=\"expense-field\">".concat(expense.item, "</div>\n            <div class=\"expense-field expense-price\">$").concat(expense.price.toFixed(2), "</div>\n            <div class=\"expense-field\">").concat(expense.date, "</div>\n            <div class=\"expense-field\">").concat(expense.location, "</div>\n            <div class=\"expense-category\">").concat(expense.category, "</div>\n            <div class=\"expense-actions\">\n                <button class=\"delete-btn\" onclick=\"deleteExpense(").concat(expense.id, ")\">Delete</button>\n            </div>\n        ");
        expensesList.appendChild(expenseItem);
    });
}
// Function to delete an expense
function deleteExpense(expenseId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this expense?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/expenses/").concat(expenseId), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        showMessage(data.message, false);
                        loadExpenses(); // Reload the expenses list
                    }
                    else {
                        showMessage(data.error, true);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    showMessage('Error deleting expense. Make sure your Flask API is running.', true);
                    console.error('Error:', error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Get paycheck form elements
var paycheckForm = document.getElementById('paycheck-form');
var financialSummary = document.getElementById('financial-summary');
var totalIncome = document.getElementById('total-income');
var totalExpensesSpan = document.getElementById('total-expenses');
var remainingBalance = document.getElementById('remaining-balance');
// Function to add a paycheck
function addPaycheck(paycheck) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/paychecks"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(paycheck)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (response.ok) {
                        showMessage(data.message, false);
                        paycheckForm.reset(); // Clear the form
                        loadExpenses(); // Refresh the financial summary
                    }
                    else {
                        showMessage(data.error, true);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    showMessage('Error connecting to server. Make sure your Flask API is running.', true);
                    console.error('Error:', error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Handle paycheck form submission
paycheckForm.addEventListener('submit', function (event) { return __awaiter(_this, void 0, void 0, function () {
    var formData, paycheck;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                formData = new FormData(paycheckForm);
                paycheck = {
                    amount: parseFloat(formData.get('amount')),
                    date: formData.get('date'),
                    description: formData.get('description')
                };
                // Add the paycheck
                return [4 /*yield*/, addPaycheck(paycheck)];
            case 1:
                // Add the paycheck
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Function to load paychecks for the selected month
function loadPaychecks(selectedMonth) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, paychecks, totalIncomeAmount, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "".concat(API_BASE_URL, "/paychecks");
                    // Add month filter to URL if selected
                    if (selectedMonth) {
                        url += "?month=".concat(selectedMonth);
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    paychecks = _a.sent();
                    if (response.ok) {
                        totalIncomeAmount = paychecks.reduce(function (sum, paycheck) { return sum + paycheck.amount; }, 0);
                        return [2 /*return*/, totalIncomeAmount];
                    }
                    else {
                        showMessage(paychecks.error, true);
                        return [2 /*return*/, 0];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error loading paychecks:', error_5);
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Updated function to calculate and show financial summary
function calculateAndShowFinancialSummary(expenses) {
    return __awaiter(this, void 0, void 0, function () {
        var selectedMonth, totalExpensesAmount, totalIncomeAmount, balance, balanceItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedMonth = monthFilter.value;
                    totalExpensesAmount = expenses.reduce(function (sum, expense) { return sum + expense.price; }, 0);
                    return [4 /*yield*/, loadPaychecks(selectedMonth)];
                case 1:
                    totalIncomeAmount = _a.sent();
                    balance = totalIncomeAmount - totalExpensesAmount;
                    // Update display
                    totalIncome.textContent = "$".concat(totalIncomeAmount.toFixed(2));
                    totalExpensesSpan.textContent = "$".concat(totalExpensesAmount.toFixed(2));
                    remainingBalance.textContent = "$".concat(balance.toFixed(2));
                    balanceItem = remainingBalance.closest('.summary-item');
                    if (balance < 0) {
                        balanceItem === null || balanceItem === void 0 ? void 0 : balanceItem.classList.add('negative');
                    }
                    else {
                        balanceItem === null || balanceItem === void 0 ? void 0 : balanceItem.classList.remove('negative');
                    }
                    expenseCount.textContent = "".concat(expenses.length, " expense").concat(expenses.length !== 1 ? 's' : '');
                    financialSummary.style.display = 'block';
                    return [2 /*return*/];
            }
        });
    });
}
// Set today's date as default for paycheck form
document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('date');
    var paycheckDateInput = document.getElementById('paycheck-date');
    var today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    paycheckDateInput.value = today;
});
// Make deleteExpense available globally for onclick handlers
window.deleteExpense = deleteExpense;
// Add event listener for month filter changes
monthFilter.addEventListener('change', loadExpenses);
// Get paycheck viewing elements
var togglePaychecksBtn = document.getElementById('toggle-paychecks-btn');
var loadPaychecksBtn = document.getElementById('load-paychecks-btn');
var paychecksContainer = document.getElementById('paychecks-container');
var paychecksList = document.getElementById('paychecks-list');
// Variable to track if paychecks are currently visible
var paychecksVisible = false;
// Function to toggle paycheck visibility
function togglePaychecksView() {
    paychecksVisible = !paychecksVisible;
    if (paychecksVisible) {
        paychecksContainer.style.display = 'block';
        loadPaychecksBtn.style.display = 'inline-block';
        togglePaychecksBtn.textContent = 'Hide Paychecks';
        loadAndDisplayPaychecks(); // Load paychecks when showing
    }
    else {
        paychecksContainer.style.display = 'none';
        loadPaychecksBtn.style.display = 'none';
        togglePaychecksBtn.textContent = 'Show Paychecks';
    }
}
// Function to load and display paychecks
function loadAndDisplayPaychecks() {
    return __awaiter(this, void 0, void 0, function () {
        var selectedMonth, url, response, paychecks, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    selectedMonth = monthFilter.value;
                    url = "".concat(API_BASE_URL, "/paychecks");
                    // Add month filter to URL if selected
                    if (selectedMonth) {
                        url += "?month=".concat(selectedMonth);
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    paychecks = _a.sent();
                    if (response.ok) {
                        displayPaychecks(paychecks);
                        showMessage("Loaded ".concat(paychecks.length, " paycheck").concat(paychecks.length !== 1 ? 's' : '').concat(selectedMonth ? " for ".concat(getMonthName(selectedMonth)) : ''), false);
                    }
                    else {
                        showMessage(paychecks.error, true);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    showMessage('Error loading paychecks. Make sure your Flask API is running.', true);
                    console.error('Error:', error_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to display paychecks in the list
function displayPaychecks(paychecks) {
    // Clear existing paychecks
    paychecksList.innerHTML = '';
    if (paychecks.length === 0) {
        paychecksList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No paychecks found for this period.</p>';
        return;
    }
    // Add header
    var header = document.createElement('div');
    header.className = 'paycheck-item paycheck-header';
    header.innerHTML = "\n        <div><strong>Description</strong></div>\n        <div><strong>Amount</strong></div>\n        <div><strong>Date</strong></div>\n        <div><strong>Actions</strong></div>\n    ";
    paychecksList.appendChild(header);
    // Add each paycheck
    paychecks.forEach(function (paycheck) {
        var paycheckItem = document.createElement('div');
        paycheckItem.className = 'paycheck-item';
        var description = paycheck.description || 'No description';
        paycheckItem.innerHTML = "\n            <div class=\"paycheck-field paycheck-description\">".concat(description, "</div>\n            <div class=\"paycheck-field paycheck-amount\">$").concat(paycheck.amount.toFixed(2), "</div>\n            <div class=\"paycheck-field\">").concat(paycheck.date, "</div>\n            <div class=\"expense-actions\">\n                <button class=\"delete-btn\" onclick=\"deletePaycheck(").concat(paycheck.id, ")\">Delete</button>\n            </div>\n        ");
        paychecksList.appendChild(paycheckItem);
    });
}
// Function to delete a paycheck
function deletePaycheck(paycheckId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Are you sure you want to delete this paycheck?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/paychecks/").concat(paycheckId), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        showMessage(data.message, false);
                        loadAndDisplayPaychecks(); // Reload the paychecks list
                        loadExpenses(); // Refresh the financial summary
                    }
                    else {
                        showMessage(data.error, true);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _a.sent();
                    showMessage('Error deleting paycheck. Make sure your Flask API is running.', true);
                    console.error('Error:', error_7);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Make deletePaycheck available globally for onclick handlers
window.deletePaycheck = deletePaycheck;
// Add event listeners
togglePaychecksBtn.addEventListener('click', togglePaychecksView);
loadPaychecksBtn.addEventListener('click', loadAndDisplayPaychecks);
// Update the month filter change listener to also refresh paychecks if visible
monthFilter.addEventListener('change', function () {
    loadExpenses();
    if (paychecksVisible) {
        loadAndDisplayPaychecks();
    }
});
