import mongoose from "mongoose"

export const dbconnect = async () => {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Database connection successfully"))
    .catch((err) =>{
        console.log("DB connnection failed")
        console.error(err)
        process.exit(1)
    })
}