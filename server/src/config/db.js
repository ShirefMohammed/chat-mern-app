const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const connect = await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // });
    const connect = await mongoose.connect("mongodb+srv://ShirefMohammed:9xsbY1qSt4vOjnig@cluster0.odqhrqh.mongodb.net/chat_mern_app?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;