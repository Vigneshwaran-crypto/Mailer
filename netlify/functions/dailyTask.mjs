import nodemailer from "nodemailer";
import moment from "moment";

export default async (event, context) => {
  console.log("Mail Process Initialized....");
  try {
    const today = moment().format("DD/MM/YYYY");
    const bossOnLeave = false;

    const leaveDays = ["30/05/2025", "01/05/2025", "20/10/2025"];

    const mailSubject = process.env.Mail_Subject;
    const mailBody = process.env.Mail_Body?.replace(/\\n/g, "\n");
    const isBossLeave = process.env.BOSS_ON_LEAVE;

    console.log("env Val isBossLeave", isBossLeave);
    console.log("env Val mailSubject", mailSubject);
    console.log("env Val mailBody\n", mailBody);

    if (isBossLeave || leaveDays.includes(today)) {
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
      subject: mailSubject,
      text: mailBody,
    };

    const mailForTeamInfo = await transporter.sendMail(mailForTeam);
    const mailForCeoInfo = await transporter.sendMail(mailForCeo);

    console.log("Team Mail Delivered Details:", mailForTeamInfo);
    console.log("CEO Mail Delivered Details:", mailForCeoInfo);

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
