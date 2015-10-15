module.exports={
  sendEmail : function(mailObj,nodemailer,mailOptions){
    //Send out email using nodemailer.
    console.log("SENDING EMAIL OUT");
    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'kaushal@deck.in',
        pass: 'deckrocks'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols


// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
  }
}
