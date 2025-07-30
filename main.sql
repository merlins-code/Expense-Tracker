create table IF NOT EXISTS Expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    price REAL NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL Check (category in ('Housing', 'Utilities', 'Subscriptions', 'Food', 'Car', 'Miscellaneous', 'Kids'))
);

create table if not exists Paychecks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
