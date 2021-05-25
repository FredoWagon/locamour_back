const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config({ path: '.env' });

//credentials du compte smtp ethereal

const fredCredentials = {
  name: "Scotty Gleichner",
  email: process.env.FRED_MAIL,
  password: process.env.FRED_MAIL_MDP
};


const barbiCredentials = {
  name: "Scotty Gleichner",
  email: process.env.BARB_MAIL,
  password: process.env.BARB_MAIL_MDP
};





//configuration du serveur smtp

// const smtpConfig = {
//   host: 'smtp.sendgrid.net',
//   port: 465
// };

// Initialisation de nodemailer.



// const transporter = nodemailer.createTransport({
//   host: smtpConfig.host,
//   port: smtpConfig.port,
//   auth: {
//     user: sendGridCredentials.username,
//     pass: sendGridCredentials.password
//   }
// });


const mail = async (res, object) => {
  try {
    console.log('lobjet dans le mail')
    console.log(object)
    const data = object.data.annonce

    console.log(data);
    let transporter;
      console.log("dans le if");
      transporter = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: fredCredentials.email,
          pass: fredCredentials.password
        }
      }));


    const mailData = {
      from: "fedde.leg@gmail.com",  // sender address
      to: "fedde.leg@gmail.com",   // list of receivers
      subject: `${object.data.mailObject}`,
      text: `${object.data.emailText} \n
Nous avons créé un site internet pour notre recherche d'appartement
afin de nous présenter et vous permettre de consulter notre dossier. \n
Voici le lien http://localhost:3500/?page=${object.data.annonce._id} \n
 En attendant d'avoir de vos nouvelles,
 nous vous souhaitons une belle journée ! \n
 Fred & Barbara`
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);

    });





  } catch (error) {
    console.log(error)

  }


}



// const sendPasswordRecoveryEmail = catchAsync(async (user, next) => {
//   let link = "http://localhost:3000/auth/reset/" + user.accountToken;
//   const mailData = {
//     from: "fedde.leg@gmail.com",  // sender address
//     to: user.email,   // list of receivers
//     subject: "Récupération de mot de passe",
//     text: `Bonjour ${user.name} ! \n
//     Pour recéer ton mot de passe, click ici : ${link} \n
//     enculé :D`
//   };

//   transporter.sendMail(mailData, function (err, info) {
//     if (err)
//       console.log(err)
//     else
//       console.log(info);
//     res.status(201).json({ message: "c'est arrivé !", log: info });
//   });

// });








module.exports = { mail };
