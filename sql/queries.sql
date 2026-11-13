-- W3Schools Try-It editor (Northwind sample database).
-- The shipper is matched by name, not by a hard-coded ShipperID, so the query still reads correctly if ids change.

-- 1. Customers who used United Package: name, country, number of such orders and their total value
--    (quantity x product price), one row per customer, highest value first.
--    COUNT(DISTINCT ...) is required: joining OrderDetails produces one row per order line,
--    so a plain COUNT would count lines, not orders.
SELECT
    c.CustomerName,
    c.Country,
    COUNT(DISTINCT o.OrderID)          AS UnitedPackageOrders,
    ROUND(SUM(od.Quantity * p.Price), 2) AS TotalValue
FROM Customers AS c
JOIN Orders       AS o  ON o.CustomerID = c.CustomerID
JOIN Shippers     AS s  ON s.ShipperID  = o.ShipperID
JOIN OrderDetails AS od ON od.OrderID   = o.OrderID
JOIN Products     AS p  ON p.ProductID  = od.ProductID
WHERE s.ShipperName = 'United Package'
GROUP BY c.CustomerID, c.CustomerName, c.Country
ORDER BY TotalValue DESC, c.CustomerName ASC;


-- 2. Customers who placed at least one order but never used United Package.
--    "Never" is checked across all of the customer's orders (NOT EXISTS), not per order:
--    a filter like WHERE ShipperID <> 2 would wrongly include customers who used United Package
--    on some orders and another shipper on others.
SELECT
    c.CustomerName,
    c.Country
FROM Customers AS c
WHERE EXISTS (
        SELECT 1
        FROM Orders AS o
        WHERE o.CustomerID = c.CustomerID
    )
  AND NOT EXISTS (
        SELECT 1
        FROM Orders   AS o
        JOIN Shippers AS s ON s.ShipperID = o.ShipperID
        WHERE o.CustomerID = c.CustomerID
          AND s.ShipperName = 'United Package'
    )
ORDER BY c.CustomerName ASC;
