import mongoose from 'mongoose';
const movieSchema = new mongoose.Schema({title:{type:String,required:true},description:String,genre:[String],language:{type:String,default:'Hindi'},duration:Number,certificate:{type:String,default:'UA'},poster:String,backdrop:String,releaseDate:Date,rating:{type:Number,default:0},isActive:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Movie',movieSchema);
