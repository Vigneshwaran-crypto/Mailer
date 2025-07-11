import nodemailer from "nodemailer";
import moment from "moment";

export default async (event, context) => {
  console.log("Mail Process Initialized....\n");
  const today = moment().format("DD/MM/YYYY");
  console.log("Date :\n", today);
  try {
    const mailSubject = process.env.Mail_Subject;
    const mailBody = process.env.Mail_Body?.replace(/\\n/g, "\n");
    const isBossLeave = process.env.BOSS_ON_LEAVE;

    console.log("isBossLeave :\n", isBossLeave);
    console.log("Mail Subject :\n", mailSubject);
    console.log("Mail Body :\n", mailBody);

    if (isBossLeave) {
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

    const mailForTeam = {
      from: "vigneswaran@betamonks.com",
      to: "jayanthi@betamonks.com",
      cc: "palani@betamonks.com",
      subject: `TimeSheet - Vigneshwaran - ${today}`,
      text: `
Hi   sir,

Kindly find my work status today,

Thanks and regards,

Vigneshwaran. S

Please follow the link :

https://docs.google.com/spreadsheets/d/1U-MnTJjA8vzB4haTjmKfKZS4c6IT5m8nWwChqiziF4o/edit?usp=sharing`,
    };

    const mailForCeo = {
      from: "vigneswaran@betamonks.com",
      to: "gokul@betamonks.com",
      cc: "vigneshdev8055@gmail.com",
      subject: `TimeSheet - Vigneshwaran - ${today}`,
      text: mailBody,
    };

    const mailForTeamInfo = await transporter.sendMail(mailForTeam);
    const mailForCeoInfo = await transporter.sendMail(mailForCeo);

    console.log("Team Mail Delivered Details :\n", mailForTeamInfo);
    console.log("CEO Mail Delivered Details :\n", mailForCeoInfo);

    return new Response(
      JSON.stringify({
        message: "Mail Sent Successfully",
        mailForTeamInfo,
        mailForCeoInfo,
      }),
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
