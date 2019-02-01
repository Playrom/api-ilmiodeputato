SELECT *  
FROM ( SELECT * FROM collegi WHERE comune17 = 'Villafranca Tirrena' ) as Citta
WHERE ST_Contains( geom , ST_GeometryFromText('POINT(15.449329 38.244722)', 4326) );


SELECT comune17 as Comune ,  ST_Y(ST_PointOnSurface(geom)) as latitudine , ST_X(ST_PointOnSurface(geom)) as longitudine FROM collegi where comune17 LIKE 'Messina';

SELECT comune17 as Comune ,  ST_Y(ST_PointOnSurface(ST_Transform(ST_SetSRID(geom,32632),4326))) as latitudine , ST_X(ST_PointOnSurface(ST_Transform(ST_SetSRID(geom,32632),4326))) as longitudine FROM collegi where comune17 LIKE 'Messina';