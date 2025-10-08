const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    email:{type: string, required: true, unique: true },
    password: {type: string, required: true}
});

//Hash password before Save

UserSchema.pre("save", function(next){
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model("User", UserSchema);