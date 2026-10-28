import mongoose from 'mongoose';
const showSchema = new mongoose.Schema({movie:{type:mongoose.Schema.Types.ObjectId,ref:'Movie',required:true},cinema:{type:String,required:true},screen:{type:String,default:'Screen 1'},city:{type:String,default:'Indore'},startsAt:{type:Date,required:true},price:{type:Number,required:true,min:1},seats:[{seatNo:String,status:{type:String,enum:['available','booked'],default:'available'},bookingId:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',default:null}}],isActive:{type:Boolean,default:true}},{timestamps:true});
showSchema.index({movie:1,startsAt:1});
export default mongoose.model('Show',showSchema);
