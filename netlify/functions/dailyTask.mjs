import nodemailer from "nodemailer";
import moment from "moment";

export default async (event, context) => {
  console.log("Mail Process Initialized....\n");
  const today = moment().format("DD/MM/YYYY");
  console.log("Date :\n", today);
  try {
    const isBossLeave = process.env.BOSS_ON_LEAVE;

    console.log("isBossLeave :\n", isBossLeave);

    if (isBossLeave === "1") {
      console.log(`Mail Skipped today : ${today} - Office Leave`);
      return new Response(
        JSON.stringify({ message: `${today} is your leave , Mail Skipped` }),
        { statusCode: 200 },
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

    const mailForTeam = {
      from: "vigneswaran@betamonks.com",
      to: "palani@betamonks.com",
      cc: "sangeetha@betamonks.com",
      subject: `TimeSheet - Vigneshwaran - ${today}`,
      text: `
Hi   sir,

Kindly find my work status today,

Thanks and regards,

Vigneshwaran. S

Please follow the link :

https://docs.google.com/spreadsheets/d/1U-MnTJjA8vzB4haTjmKfKZS4c6IT5m8nWwChqiziF4o/edit?usp=sharing`,
    };

    const mailForTeamInfo = await transporter.sendMail(mailForTeam);
    console.log("Team Mail Delivered Details :\n", mailForTeamInfo);

    return new Response(
      JSON.stringify({
        message: "Mail Sent Successfully",
        mailForTeamInfo,
      }),
      { statusCode: 200 },
    );
  } catch (e) {
    console.log("Error Ocurred :", e.message);
    return new Response(
      JSON.stringify({ error: "Mail Failed", message: e.message }),
      { statusCode: 500 },
    );
  }
};

export const config = {
  schedule: "30 13 * * 1-5",
};
