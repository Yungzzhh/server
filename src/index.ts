import { Context, Hono } from "hono";
import { cors } from "hono/cors";

const beginTransaction = "BEGIN TRANSACTION";
const commitTransaction = "COMMIT";
const rollbackTransaction = "ROLLBACK";

export interface Env {
  DB: D1Database;
}
const app = new Hono();
app.use(cors({ origin: "*" }));
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const timeToSql: any = {
  lunch: "Plan_Lunch_Menu",
  dinner: "Plan_Dinner_Menu",
};

/**
 * menu
 */
app.get("/menu", async (c: Context) => {
  const recipes = await c.env.DB.prepare("SELECT * FROM Menu_Lib").all();
  console.log(recipes.results, "recipes");

  return c.json(recipes.results);
});

app.post("/menu", async (c: Context) => {
  const body = await c.req.json();
  const { dishName, material, tags } = body;
  const stringTags = tags.join(",");
  console.log(dishName, material, stringTags);

  const sql =
    "INSERT INTO Menu_Lib (dishName, material, tags) VALUES (?, ?, ?)";
  const { success } = await c.env.DB.prepare(sql)
    .bind(dishName, material, stringTags)
    .run();
  if (success) {
    c.status(201);
    return c.json({
      success,
    });
  } else {
    c.status(500);
    return c.text("Something went wrong");
  }
});

// ------------------------------------------------

/**
 * plan
 *
 * param array [from,to], string day
 */
app.get("/plan", async (c: Context) => {
  const { day } = await c.req.query();
  const [from, to] = day.split(",");
  const sqlQuery = `SELECT * FROM Plan WHERE day BETWEEN ? AND ?`;
  const { results: planList, success } = await c.env.DB.prepare(sqlQuery)
    .bind(from, to)
    .all();

  if (success) {
    console.log(planList);
    // const

    return c.json(planList);
  } else {
    console.log("Query failed");
  }
});

app.post("/plan", async (c: Context) => {
  const { day, mealTime, mealId: meal_id } = await c.req.json();
  console.log(day, mealTime, meal_id);

  const mealTimeTable = timeToSql[mealTime];

  const insertPlanSql = `INSERT INTO Plan (day) VALUES (?);`;
  const insertMealTimeSql = `INSERT INTO ${mealTimeTable} (plan_id, menu_id) VALUES (LAST_INSERT_ROWID(), ?);`;

  try {
    // await c.env.DB.transaction(async (txn: DurableObjectTransaction) => {
    //   // 执行你的SQL语句
    //   await txn.put(insertPlanSql, [day]);
    //   await txn.put(insertMealTimeSql, [meal_id]);
    // });
    await c.env.DB.prepare(insertPlanSql).run(day);
    await c.env.DB.prepare(insertMealTimeSql).run(meal_id);
  } catch (error) {
    await c.env.DB.prepare(rollbackTransaction).run();
    console.log("Transaction failed", error);
    return c;
  }

  return c.text("ok");
});

// ------------------------------------------------

/**
 * tag
 */
app.get("/tags", async (c: any) => {
  const tags = await c.env.DB.prepare("SELECT * FROM tag").all();
  return c.json(tags.results);
});

export default app;
