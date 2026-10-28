import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next){try{const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({message:'Please log in'});const token=h.slice(7);const payload=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(payload.id);if(!req.user)return res.status(401).json({message:'User no longer exists'});next();}catch{return res.status(401).json({message:'Invalid or expired token'});}}
export function adminOnly(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required'});next();}
