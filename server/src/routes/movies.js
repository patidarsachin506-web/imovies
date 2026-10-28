import {Router} from 'express';import Movie from '../models/Movie.js';import Show from '../models/Show.js';import {protect,adminOnly} from '../middleware/auth.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const q={isActive:true};if(req.query.search)q.title={$regex:req.query.search,$options:'i'};if(req.query.language)q.language=req.query.language;res.json(await Movie.find(q).sort({createdAt:-1}));}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const m=await Movie.findOne({_id:req.params.id,isActive:true});if(!m)return res.status(404).json({message:'Movie not found'});res.json(m);}catch(e){next(e)}});
router.post('/',protect,adminOnly,async(req,res,next)=>{try{res.status(201).json(await Movie.create(req.body));}catch(e){next(e)}});
router.put('/:id',protect,adminOnly,async(req,res,next)=>{try{res.json(await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}));}catch(e){next(e)}});
router.delete('/:id',protect,adminOnly,async(req,res,next)=>{try{await Movie.findByIdAndUpdate(req.params.id,{isActive:false});res.json({message:'Movie deactivated'});}catch(e){next(e)}});
router.get('/:id/shows',async(req,res,next)=>{try{const shows=await Show.find({movie:req.params.id,isActive:true,startsAt:{$gte:new Date()}}).sort({startsAt:1}).populate('movie','title poster');res.json(shows.map(s=>({id:s._id,movie:s.movie,cinema:s.cinema,screen:s.screen,city:s.city,startsAt:s.startsAt,price:s.price,availableSeats:s.seats.filter(x=>x.status==='available').length})));}catch(e){next(e)}});
export default router;
