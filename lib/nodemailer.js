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


const mail = async (res, user) => {
  try {
    console.log(user);
    let transporter;
    console.log("TEST");
    console.log(fredCredentials.email);
    console.log(fredCredentials.password);

    if (user === "fred") {
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

    } else {
       transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: barbiCredentials.email,
          pass: barbiCredentials.password
        }
      });

    }


    const mailData = {
      from: "fedde.leg@gmail.com",  // sender address
      to: "fedde.leg@gmail.com",   // list of receivers
      subject: "Récupération de mot de passe",
      text: `Bonjour  ! \n
    Pour recéer ton mot de passe, click ici :  \n
    enculé :D`
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
