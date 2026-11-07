Schemas
categories
id: integer, primary key, auto-increment
name: string, unique
created_at: timestamp
updated_at: timestamp

    products
        id: integer, primary key, auto-increment
        name: string
        description: text
        purchase_price: decimal(10, 2)
        selling_price: decimal(10, 2)
        quantity: integer
        minimum_stock: integer      // this will tell if the product is low in stock
        category_id: integer, foreign key (references categories.id)
        created_at: timestamp
        updated_at: timestamp

    users
        id: integer, primary key, auto-increment
        name: string
        email: string, unique
        password: string
        role: enum('admin', 'staff')  // this will determine the user's access level
        created_at: timestamp
        updated_at: timestamp

## Pages and data to be needed in fronted

    Dashboard
        - Total Products: (total_products)
        - Total Categories: (total_categories)
        - Total Stock: (total_stock)
        - Low Stock ( no of low stock products): (low_stock_count)
        - Inventory Value (total value of all products in stock): (inventory_value)
        - category_status{
            name: string
            total_stocks: integer
        } -> it is an array of objects, 
                         -> eg:: "category_status": [
                                {
                                    "name": "Electronics",
                                    "total_stocks": 120
                                },
                                {
                                    "name": "Furniture",
                                    "total_stocks": 45
                                },....
                            ]

    ## Profile Page
