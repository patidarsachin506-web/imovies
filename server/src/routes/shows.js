import {Router} from 'express';import Show from '../models/Show.js';import {protect,adminOnly} from '../middleware/auth.js';
const router=Router();
router.get('/:id/seats',async(req,res,next)=>{try{const s=await Show.findOne({_id:req.params.id,isActive:true});if(!s)return res.status(404).json({message:'Show not found'});res.json({id:s._id,cinema:s.cinema,screen:s.screen,startsAt:s.startsAt,price:s.price,seats:s.seats.map(x=>({seatNo:x.seatNo,status:x.status}))});}catch(e){next(e)}});
router.post('/',protect,adminOnly,async(req,res,next)=>{try{const {movie,cinema,screen,city,startsAt,price,rows=5,seatsPerRow=8}=req.body;const seats=[];for(let r=0;r<rows;r++)for(let c=1;c<=seatsPerRow;c++)seats.push({seatNo:String.fromCharCode(65+r)+c,status:'available'});res.status(201).json(await Show.create({movie,cinema,screen,city,startsAt,price,seats}));}catch(e){next(e)}});
export default router;
