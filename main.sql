create table IF NOT EXISTS Expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    price REAL NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL Check (category in ('Housing', 'Utilities', 'Subscriptions', 'Food', 'Car', 'Miscellaneous', 'Kids'))
);
