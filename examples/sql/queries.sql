-- Sample queries for the Verdula theme
CREATE TABLE plants (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    species_id  INTEGER REFERENCES species (id),
    height_cm   NUMERIC(6, 2) DEFAULT 0,
    planted_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO plants (name, species_id, height_cm)
VALUES ('Sword fern', 1, 32.5),
       ('Swiss cheese plant', 2, 80);

SELECT s.name           AS species,
       COUNT(p.id)      AS total,
       AVG(p.height_cm) AS average_height
FROM plants p
         JOIN species s ON s.id = p.species_id
WHERE p.planted_at >= NOW() - INTERVAL '30 days'
  AND p.name LIKE 'S%'
GROUP BY s.name
HAVING COUNT(p.id) > 1
ORDER BY average_height DESC
LIMIT 10;
