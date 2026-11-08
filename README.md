Schemas
    categories
        id: integer, primary key, auto-increment
        name: string, unique
        description: text
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

    ## Product/Index page
        - List of products with pagination (20 per page)
        - Each product should display:
            - Id (id) integer
            - Name (name) string
            - Description (description) string
            - Purchase Price (purchase_price) decimal(10, 2)
            - Selling Price (selling_price) decimal(10, 2)
            - Quantity (quantity) integer
            - Minimum Stock (minimum_stock) integer
            - category ( id:integer, name:string)

                example data:
                {
                    "id": 1,
                    "name": "Mouse",
                    "description": "...",
                    "purchase_price": "500.00",
                    "selling_price": "700.00",
                    "quantity": 20,
                    "status": "low_stock", "in stock", "out_of_stock"
                    "category": {
                        "id": 2,
                        "name": "Electronics"
                    }
                }


    ## Category/Index page
        - List of categories with pagination (20 per page)
        - Each category should display:
            - Id (id) integer
            - Name (name) string
            - Description (description) string
            - Total Products (products_count) integer


    ## Staff/Index page
        - List of staff members with pagination (20 per page)
        - Each staff member should display:
            - Id (id) integer
            - Name (name) string
            - Email (email) string
            - Role (role) enum('admin', 'staff')


    ## Pages You need to create in frontend
        - Dashboard
        - Product/Index
        - Product/Create -> it gets props 'categories' from backend categories( for dropdown select):
                                                                    - id: integer
                                                                    - name: string

                then you will send data to backend by post request to store product:
                    - name: string
                    - description: string
                    - purchase_price: decimal(10, 2)
                    - selling_price: decimal(10, 2)
                    - quantity: integer
                    - minimum_stock: integer
                    - category_id: integer (selected from dropdown)

        - Product/Edit -> it gets props 'product' and 'categories'(for dropdown select) from backend:
                                                                    - id: integer
                                                                    - name: string
                                                                    - description: string
                                                                    - purchase_price: decimal(10, 2)
                                                                    - selling_price: decimal(10, 2)
                                                                    - quantity: integer
                                                                    - minimum_stock: integer
                                                                    - category: object (id: integer, name: string)
        - Category/Index
        - Category/Create
        - Category/Edit -> it gets props 'category' from backend category:
                                                                    - id: integer
                                                                    - name: string
                                                                    - description: string
        - Staff/Index
