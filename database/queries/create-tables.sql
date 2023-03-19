-- DROP TABLE IF EXISTS "photos";
-- DROP TABLE IF EXISTS "skus";
-- DROP TABLE IF EXISTS "styles";
-- DROP TABLE IF EXISTS "features";
-- DROP TABLE IF EXISTS "products";

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "slogan" varchar,
  "description" varchar,
  "category" varchar,
  "default_price" varchar
);

CREATE TABLE "features" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "feature" varchar,
  "value" varchar
);

CREATE TABLE "styles" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "name" varchar,
  "original_price" int,
  "sale_price" int,
  "default" boolean
);

CREATE TABLE "skus" (
  "id" int PRIMARY KEY,
  "style_id" int,
  "size" varchar,
  "quantity" int
);

CREATE TABLE "photos" (
  "id" int PRIMARY KEY,
  "style_id" int,
  "thumbnail_url" varchar,
  "url" varchar
);

CREATE TABLE "photos" (
  "id" int PRIMARY KEY,
  "style_id" int,
  "thumbnail_url" varchar,
  "url" varchar
);

CREATE TABLE "related" (
  "id" int PRIMARY KEY,
  "current_product_id" int,
  "related_product_id" int
);

ALTER TABLE "features" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "styles" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "skus" ADD FOREIGN KEY ("style_id") REFERENCES "styles" ("id");
ALTER TABLE "photos" ADD FOREIGN KEY ("style_id") REFERENCES "styles" ("id");


COPY products FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/product.csv' WITH (FORMAT csv, HEADER);
COPY styles FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/styles.csv'  WITH (FORMAT csv, HEADER, NULL('null'), FORCE_NULL(original_price));
COPY features FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/features.csv' CSV HEADER;
COPY skus FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/skus.csv' CSV HEADER;
COPY photos FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/photos.csv' CSV HEADER;
COPY related FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/photos.csv' CSV HEADER;

CREATE INDEX product_id ON features(product_id);
CREATE INDEX style_id ON photos(style_id);
CREATE INDEX current_product_id ON related(current_product_id);