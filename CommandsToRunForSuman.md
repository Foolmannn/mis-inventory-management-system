# Run the following commands after pulling the latest changes from the repository:

```git pull```
```php artisan migrate```
```npm install```
```npm run dev```

# Run the following command also if there are any change in UserFactory.php, ProductFactory.php, CategoryFactory.php, or any other factory files:
```php artisan migrate:fresh --seed```  -> this will drop all tables and re-run all migrations and seeders, so be careful (this will delete all data).

if you want to keep the existing data, then run the following command instead:
```php artisan db:seed```  -> this will only run the seeders and will not delete any existing data.