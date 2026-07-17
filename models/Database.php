<?php
class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if(self::$connection === null)
        {
            self::$connection = new PDO(
                "mysql:host=localhost;dbname=my_magmabase;charset=utf8mb4",
                "magmabase",
                ""
            );

            self::$connection->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );
        }

        return self::$connection;
    }
}
?>