CREATE TABLE "related" (
  "id" int PRIMARY KEY,
  "current_product_id" int,
  "related_product_id" int
);


COPY related FROM '/Users/pattylong/Desktop/hackreactor/sdc/productOverview/sourceData/related.csv' CSV HEADER;