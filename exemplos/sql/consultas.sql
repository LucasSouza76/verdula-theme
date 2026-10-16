-- Consultas de exemplo para o tema Verdula
CREATE TABLE plantas (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    especie_id  INTEGER REFERENCES especies (id),
    altura_cm   NUMERIC(6, 2) DEFAULT 0,
    plantada_em TIMESTAMP DEFAULT NOW()
);

INSERT INTO plantas (nome, especie_id, altura_cm)
VALUES ('Samambaia', 1, 32.5),
       ('Costela-de-adão', 2, 80);

SELECT e.nome           AS especie,
       COUNT(p.id)      AS total,
       AVG(p.altura_cm) AS altura_media
FROM plantas p
         JOIN especies e ON e.id = p.especie_id
WHERE p.plantada_em >= NOW() - INTERVAL '30 days'
  AND p.nome LIKE 'S%'
GROUP BY e.nome
HAVING COUNT(p.id) > 1
ORDER BY altura_media DESC
LIMIT 10;
