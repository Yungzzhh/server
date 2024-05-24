DROP TABLE IF EXISTS Menu_Lib;

DROP TABLE IF EXISTS Plan;

DROP TABLE IF EXISTS Tag;

DROP TABLE IF EXISTS Plan_Lunch_Menu;

DROP TABLE IF EXISTS Plan_Dinner_Menu;

CREATE TABLE IF NOT EXISTS Menu_Lib (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dishName TEXT,
    material TEXT,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS Plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day DATE
);

CREATE TABLE Plan_Lunch_Menu (
    plan_id INT,
    menu_id INT,
    FOREIGN KEY (plan_id) REFERENCES plan(id),
    FOREIGN KEY (menu_id) REFERENCES menulib(id) ON DELETE CASCADE
);

CREATE TABLE Plan_Dinner_Menu (
    plan_id INT,
    menu_id INT,
    FOREIGN KEY (plan_id) REFERENCES plan(id),
    FOREIGN KEY (menu_id) REFERENCES menulib(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tag (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

INSERT INTO
    Tag (name)
VALUES
    ("烧烤类"),
    ("炖煮类"),
    ("蒸制类"),
    ("炸制类"),
    ("炒制类"),
    ("烘焙类"),
    ("凉拌类"),
    ("腌制类"),
    ("汤类"),
    ("火锅类"),
    ("冷盘类"),
    ("煎制类"),
    ("烤制类"),
    ("煮制类"),
    ("蒸烤类"),
    ("砂锅类"),
    ("铁板类");