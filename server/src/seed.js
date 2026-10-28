import 'dotenv/config';import mongoose from 'mongoose';import bcrypt from 'bcryptjs';import connectDB from './config/db.js';import Movie from './models/Movie.js';import User from './models/User.js';import Show from './models/Show.js';
await connectDB();
const movies=[
{title:'The Last Horizon',description:'A thrilling journey across a world on the edge of change.',genre:['Adventure','Sci-Fi'],language:'English',duration:128,certificate:'UA',poster:'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',rating:8.1},
{title:'Midnight Run',description:'Two strangers discover that one night can change everything.',genre:['Thriller','Drama'],language:'Hindi',duration:116,certificate:'UA',poster:'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',rating:7.6},
{title:'Love in Monsoon',description:'A warm romantic story set during the monsoon season.',genre:['Romance','Drama'],language:'Hindi',duration:122,certificate:'U',poster:'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',rating:7.9},
{title:'Shadow Protocol',description:'An intelligence officer races to prevent a global threat.',genre:['Action','Thriller'],language:'English',duration:134,certificate:'UA',poster:'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',rating:8.0}
];
for(const m of movies){if(!await Movie.findOne({title:m.title}))await Movie.create(m)}
let admin=await User.findOne({email:'admin@imovies.local'});if(!admin)admin=await User.create({name:'IMovies Admin',email:'admin@imovies.local',password:await bcrypt.hash('ChangeThisAdmin123!',12),role:'admin'});
const all=await Movie.find();for(const movie of all){const exists=await Show.findOne({movie:movie._id,startsAt:{$gt:new Date()}});if(!exists){for(let i=1;i<=3;i++){const startsAt=new Date(Date.now()+i*24*60*60*1000);startsAt.setHours([12,16,20][i-1],0,0,0);const seats=[];for(let r=0;r<5;r++)for(let c=1;c<=8;c++)seats.push({seatNo:String.fromCharCode(65+r)+c,status:'available'});await Show.create({movie:movie._id,cinema:'IMovies Cinema',screen:'Screen 1',city:'Indore',startsAt,price:180,seats});}}}
console.log('Seed complete. Demo admin: admin@imovies.local / ChangeThisAdmin123! Change this password for any real deployment.');await mongoose.disconnect();
