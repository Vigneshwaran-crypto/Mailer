import nodemailer from "nodemailer";
import moment from "moment";

export default async (event, context) => {
  console.log("Your scheduled task is running!");
  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      // auth: {
      //   user: "Vickytata619@gmail.com",
      //   pass: "blcn wmnt xtxz smcg",
      // },
      host: "betamonks.com",
      port: 465, // Usually 587 for TLS or 465 for SSL
      secure: true, // true for 465, false for other ports
      auth: {
        user: "vigneswaran@betamonks.com",
        pass: "Pass123!@#",
      },
    });

    const today = moment().format("DD/MM/YYYY");
    const mailOptions = {
      from: "vigneswaran@betamonks.com",
      to: "23msccs06@thiruthangalnadarcollege.edu.in",
      cc: "vickytata619@gmail.com",
      subject: `TimeSheet - Vigneshwaran - ${today}`,
      text: `
Hi   sir,

Kindly find my work status today,

Thanks and regards,

Vigneshwaran. S

Please follow the link :
https://docs.google.com/spreadsheets/d/1U-MnTJjA8vzB4haTjmKfKZS4c6IT5m8nWwChqiziF4o/edit?usp=drivesdk
    `,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Mail Sent Successfully", info }),
      { statusCode: 200 }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Mail Sent Successfully", info }),
    };
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Mail Failed", message: e.message }),
      { statusCode: 500 }
    );

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Mail Failed", message: e.message }),
    };
  }
};
