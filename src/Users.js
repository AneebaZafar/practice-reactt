const { MongoClient, ObjectId } = require("mongodb");

// Replace with your MongoDB Atlas Connection String
const uri = "mongodb+srv://aminashahzadkhan:amina2004@cluster0.evdyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoDB Client
const client = new MongoClient(uri);

//Database and Collection Names
const dbName = "virtual_telescope";
const collectionName = "Users";

//Connect to MongoDB Atlas
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
        return client.db(dbName);
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        throw error;
    }
}

//inserts record
async function insertUser(user) {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(user);
        console.log(`✅ User inserted with ID: ${result.insertedId}`);
    } catch (error) {
        if (error.code === 11000) {
            console.error("❌ Error: User exists already!");
        } else {
            console.error("❌ Insert Error:", error);
        }
    }
}

// prints all records
async function getUsers() {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName);
        const users = await collection.find({}).toArray();
        console.log("📌 Users:", users);
    } catch (error) {
        console.error("❌ Fetch Users Error:", error);
    }
}

// updates user info 
async function updateUsers(email, password, newData) {
    try {
        const db = await connectDB();
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(
            { email: email, password: password }, 
            { $set: newData }
        );

        if (result.matchedCount === 0) {
            console.log(`⚠️ Invalid email or password. No document updated.`);
        } else {
            console.log(`✅ Modified ${result.modifiedCount} document(s)`);
        }
    } catch (error) {
        console.error("❌ Update Error:", error);
    }
}

// delete user
async function deleteUser(email) {
    try {
        const db = await connectDB(); // Get the database connection
        const collection = db.collection(collectionName);
        
        const result = await collection.deleteOne({ email });

        if (result.deletedCount === 0) {
            console.log(`⚠️ No user found with email: ${email}`);
        } else {
            console.log(`❌ Deleted user with email: ${email}`);
        }
    } catch (error) {
        console.error("❌ Delete Error:", error);
    }
}


// Export functions properly
module.exports = {
    connectDB, // ✅ Export connectDB properly
    insertUser,
    getUsers,
    updateUsers,
    deleteUser,
    ObjectId,
};

