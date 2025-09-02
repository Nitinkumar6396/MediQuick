import {v2 as cloudinary} from 'cloudinary'

const cloudinaryConnect = async () => {
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        })
        console.log("Cloudinary connection successfully")
    }
    catch(err){
        console.log(err)
    }
}

export default cloudinaryConnect