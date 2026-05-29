const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.signup=async(req,res)=>{
    try {
        const {name,email,password,role}=req.body;
        if(!name || !email || !password){
            return res.redirect('/signup?error=All+fields+are+required');
        }

        const existingUser=await User.findOne({email});
        if (existingUser){
            return res.redirect('/signup?error=Email+already+in+use');
        }

        const hashedPassword=await bcrypt.hash(password,10);

        await new User ({
            name,
            email, 
            password: hashedPassword,
            role: role || 'employee'
        }).save();

        res.redirect('/login?message=Account+created+successfully');

    } catch (err) {
        res.redirect('/signup?error=Server+error+during+signup');
    }
};

exports.login =  async (req,res) => {
    try{
        const {email , password} = req.body;
        if (!email || !password){
            return res.redirect('/login?error=Emailandpasswordarebothrequired');
        }
        const user = await User.findOne({email});
        if (!user){
            return res.redirect('/login?error=Invalidcredentials');
        }

        const passwordMatches=await bcrypt.compare(password,user.password)
        if (!passwordMatches){
            return res.redirect('/login?error=Invalidcredentials');
       }

        const token=jwt.sign(
            {userId: user.id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
       res.cookie('token', token, {
            httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production', // HTTPS only on Vercel
          sameSite: 'lax'
        });

        
        res.redirect(user.role === 'manager' ? '/manager' : '/employee');
    } catch(err){
                console.error(err);
                res.redirect('/login?error=Servererrorduringlogin');
        }           
 };
