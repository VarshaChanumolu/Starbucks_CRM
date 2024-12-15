# Starbucks_CRM
For this project, we worked on the customer relationship management database, specifically the Starbucks Customer Dataset. The project focuses on customer segmentation and analysing their behavioural patterns. It is a pre-existing raw dataset provided by Starbucks to understand their customers and transactions and check whether there are better approaches for sending and tracking customer-specific promotional deals. Our first step was to understand the requirements and data; it consisted of 3 datasets: portfolio, profile, and transcripts. The portfolio datasets contain information about possible promotional offers, including promotion type, promotion duration, reward, and distribution. Then, the profile dataset includes information on every customer, age, salary, and gender. Lastly, the transcripts dataset reflects different steps of promotional offers that a customer received. There are three main stages of receiving a promotional offer: receiving, viewing, and completing. Also, one can view different transactions made by a person since they became a customer and, lastly, the day they interacted with Starbucks and the amount spent. 
As mentioned earlier, in project part 2, we created a Starbucks CRM database using Workbench and used CRUD operations to create various tables such as customers, stores, promotions, and transactions, and insert values into them. Secondly, in the python file, we are worked with portfolio, profile, and transcript datasets. These datasets are loaded into the SQLite database, and we begin by exploring each dataset. For example, check for uniqueness, null values, data types, count of each category on various parameters etc. Then, we explored some questions such as number of members who joined by each year, checking for duplicates in the dataset, maximum income for each gender, frequently used channels, types of promotional events, average income of people where the offer is completed, and scatter plot of active members by age group. We were able to gain some insights into the datasets and planned to incorporate the same in webpage. 
For final part 3, we would provide an overview of how the component of the Starbucks offers website are connected, including the front-end, back-end, and database. The Starbucks offers website is a dynamic web application that allows users to view, and claim offers, create, edit, and fetch user details, access a gallery of promotional images, and interact with an SQLite database via API endpoints. The website is hosted on Render, ensuring accessibility from any location. 
1)	Front-end components:
Framework: The front-end is built using vanilla HTML, CSS, and JavaScript, with responsive layouts and interactive components.
The key features in this framework are:
Dynamic Views: Views are toggled dynamically using JavaScript to ensure a seamless user experience. Example views are home view, user detail’s view, offers view, claim offer view, and create user view.
Gallery Section: Displays promotional images in a grid layout with captions and implements a responsive design with two images per row.
2)	JavaScript Functions: Dynamic view switching ensures smooth navigation between views using the showView function. 
API calls: 
•	fetchUserDetails: Fetches user details from the server.
•	fetchOffers: Fetches available offers from the server.
•	createUser: Creates a new user.
•	claimOffer: Allows a user to claim an offer.
Now, moving on to the back-end components.
3)	Back-end components: The backend is implemented using Node.js with the express framework to handle routing and middleware.
API endpoints:
User Management: 
•	   GET/users/:id: Fetch user details by ID.
•	   POST /users: Create a new user.
•	   PUT /users/:id: Update user details by ID.
Offers Management:
•	GET/offers: Fetch all available offers.
•	POST/claims: Allow a user to claim an offer by providing their userID and offerID.
Dynamic Database Access:
•	GET/database/table: Fetch all records from a specified table (example Users, Offers).
Now, we would discuss the database and tables created.
4)	Database (Type): SQLite is the database used for this application. It is lightweight, file-based, and supports all relational database operations.
Tables:
•	Users Tables: Stores user details such as userID, name, age, salary, and date_of_joining.
•	Offers Tables: Stores offer details such as offerID, offer name, description, and validity time.
•	Claims Tables: Tracks which users have claimed specific offers.
Moving-on to the deployment phase,

5)	Deployment: 
Hosting on Render:
•	Continuous deployment: Any changes pushed to the repository are automatically built and deployed by Render.
•	Environment Configuration: The SQLite database is included in the project directory. Static files (e.g., images) are served from the public directory using JavaScript
app.use (express.static(path.join(__dirname, 'public')));
•	Build Commands: 
o	Build Command: npm install
o	Start Command: node server.js
Discussing about the user interaction flows,
6)	User Interaction Flow:
•	Home View: Users can enter their ID to fetch details, view offers or create a new account. A gallery displays promotional images.
•	Offers View: Lists all available offers. Users can claim offers by entering their userID.
•	Claim Offer flow: Prompts the user for their userID when claiming an offer. Submits the data to the /claims API.
•	Create User Flow: Collects user information (name, age, salary, joining date). Submits the data to the /users API.
Lastly, we will discuss about the security and validation
7)	Security and Validation:
•	Input validation: Front-end forms ensure required fields are filled. Back-end routes validate table names and input parameters to prevent SQL injection.
•	Error Handling: Informative error messages are displayed for invalid requests or database errors.
