import nodemailer from "nodemailer";
import moment from "moment";

export default async (event, context) => {
  console.log("Mail Process Initialized....");
  try {
    const today = moment().format("DD/MM/YYYY");
    const bossOnLeave =
      process.env.NETLIFY_PLUGIN_USE_ENV_IN_RUNTIME_DEF === "1";

    console.log(
      "Environment Var :",
      process.env.NETLIFY_PLUGIN_USE_ENV_IN_RUNTIME_DEF
    );
    console.log(
      "Environment Var Type :",
      typeof process.env.NETLIFY_PLUGIN_USE_ENV_IN_RUNTIME_DEF
    );

    if (bossOnLeave) {
      console.log(`Mail Skipped today : ${today} - Office Leave`);
      return new Response(
        JSON.stringify({ message: `${today} is your leave , Mail Skipped` }),
        { statusCode: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "betamonks.com",
      port: 465,
      secure: true,
      auth: {
        user: "vigneswaran@betamonks.com",
        pass: "Pass123!@#",
      },
    });

    const mailOptions = {
      from: "vigneswaran@betamonks.com",
      to: "Ravi.Padmanaban@v-p-s.com",
      cc: "palani@betamonks.com",
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
    console.log("Mail Delivered Details:", info);
    return new Response(
      JSON.stringify({ message: "Mail Sent Successfully", info }),
      { statusCode: 200 }
    );
  } catch (e) {
    console.log("Error Ocurred :", e.message);
    return new Response(
      JSON.stringify({ error: "Mail Failed", message: e.message }),
      { statusCode: 500 }
    );
  }
};

export const config = {
  schedule: "30 13 * * 1-5",
};
