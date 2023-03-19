const path = require("path");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const Client = require("pg").Client;
const Pool = require("pg").Pool;

dotenv.config();
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000);

const db = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

db.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});

// GET PRODUCTS // ============================================================================
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products LIMIT 10', (err, result) => {
    if (err) {
      console.log('error: ', err);
    } else {
      console.log(result);
      res.send(result.rows);
    }
  });
});


// GET PRODUCT ID // ============================================================================
app.get('/products/:product_id', (req, res) => {
  console.log('GET product', req.params.product_id)
  var queryString = `
      WITH x_product AS (
        SELECT *
        FROM products
        WHERE id = ${req.params.product_id}
      ),
      x_feature AS (
        SELECT JSON_BUILD_OBJECT('feature', feature, 'value', value) AS feature
        FROM features
        WHERE product_id = ${req.params.product_id}
      )
      SELECT
      a.id,
      a.name,
      a.slogan,
      a.description,
      a.category,
      a.default_price,
      ARRAY_AGG(b.feature) AS features

      FROM x_product a
      LEFT JOIN x_feature b ON 1=1
    GROUP BY 1,2,3,4,5,6
  `
  db.query(queryString, (err, result) => {
    if (err) {
      console.log('error: ', err);
    } else {
      console.log(result);
      res.send(result.rows);
    }
  });
});


// GET PRODUCT ID STYLES // ============================================================================
app.get('/products/:product_id/styles', (req, res) => {
  console.log('GET product styles', req.params.product_id)
  var queryString = `
    WITH
    x_styles AS (
      SELECT *
      FROM styles WHERE product_id = ${req.params.product_id}
    ),

    x_skus AS (
    SELECT
      style_id,
      JSON_OBJECT_AGG(id, JSON_BUILD_OBJECT('quantity', quantity, 'size', size)) AS skus
    FROM skus
    WHERE style_id IN (SELECT id FROM x_styles)
    GROUP BY 1
    ),

    x_photos AS (
      SELECT
        style_id,
        ARRAY_AGG(JSON_BUILD_OBJECT('thumbnail_url', thumbnail_url, 'url', url)) AS photos
      FROM photos
      WHERE style_id IN (SELECT id FROM x_styles)
      GROUP BY 1
    )

    SELECT
      a.product_id,
      ARRAY_AGG(JSON_BUILD_OBJECT('style_id', a.id,
                'name', a.name,
                'original_price', a.original_price,
              'sale_price', a.sale_price,
              'default', a.default,
              'photos', c.photos,
              'skus', b.skus)
            ) AS results
    FROM x_styles a
    LEFT JOIN x_skus b ON a.id = b.style_id
    LEFT JOIN x_photos c ON a.id = c.style_id
    GROUP BY 1
    `
  db.query(queryString, (err, result) => {
    if (err) {
      console.log('error ', err);
      res.status(500).send();
    } else {
      console.log(result);
      res.send(result.rows);
    }
  });
});


// GET PRODUCT ID RELATED // ============================================================================
app.get('/products/:product_id/related', (req, res) => {
  console.log('GET product related', req.params.product_id)
  var queryString = `
    SELECT ARRAY_AGG(related_product_id) AS related_ids
    FROM related
    WHERE current_product_id = ${req.params.product_id}
  `

  db.query(queryString, (err, result) => {
    if (err) {
      console.log('error ', err);
      res.status(500).send();
    } else {
      console.log(result);
      res.send(result.rows[0].related_ids);
    }
  });
});





// Code to drop and create tables
const dropAndCreateTables = async () => {
  var sql = fs.readFileSync('./database/queries/create-tables.sql').toString();
  try {
    console.log('this is the user:', process.env.PGUSER)
    console.log('this is the host:', process.env.PGHOST)
    console.log('this is the database:', process.env.PGDATABASE)
    console.log('this is the port:', process.env.PGPORT)

    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    })

    await pool.connect()
    const res = await pool.query(sql);
    console.log(res)
    console.log('completed query')
    await pool.end()
  } catch (error) {
    console.log(error)
  }
}

// commenting out as tables have been created
// dropAndCreateTables();



