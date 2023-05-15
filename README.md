# meal-record-api

1. User Auth:
    * Users can sign up with a unique email and password.
    * Users can log in with their email and password.
    * Passwords are hashed and salted before storing them in the database.
    * After successful signup and login user receives a JSON web token (JWT) for authentication.

2. Meal Records:
    * Users can add new meal records with time, meal name, calories
    * Users can enter meal, and time without calories. In that case, we will use https://www.nutritionix.com/business/api
      to call this API and fetch calories via meal name. If calories are not found using this API, default calories can be taken as 250.
    * User can view see all meals.
    * Users can update meal records by id
    * Implemented pagination and other filters like limit, search to fetch meal records

3. Role Permissions:
    * There are 2 kinds of roles: users (given to everyone) and admins.
    * Users can CRUD only their records
    * Admins can CRUD everyone's records
    * Admins can make any user an admin and make any admin a normal user
    * Admins can check stats like total users, meals, admins
