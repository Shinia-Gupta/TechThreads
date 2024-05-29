// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({
//     username:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     email:{
//         type:String,
//     required:true,
//     unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     profilePicture:{
//         type:String,
//         default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
//     }
// },{timestamps: true})

// const User=mongoose.model("User",userSchema);
// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [7, "Username must be at least 7 characters"],
    maxlength: [20, "Username must be at most 20 characters"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]+$/.test(v) && v === v.toLowerCase() && !v.includes(' ');
      },
      message: "Username must be lowercase, cannot contain spaces, and can only contain letters and numbers"
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"]
  },
  profilePicture: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
