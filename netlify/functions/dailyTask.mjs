import nodemailer from "nodemailer";
import moment from "moment";
import { holidays } from "./holidays.mjs";

export default async (event, context) => {
  const today = moment().format("DD/MM/YYYY");
  const thisDay = new Date().toISOString().split("T")[0];

  if(holidays.includes(thisDay))
  return new Response(
    JSON.stringify({
      message: `Mail Skipped : ${today} - is Holiday `,
    }),
  );

  console.log("Mail Process Initialized....\n");
  console.log("Today Date :\n", today);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "vigneswaran.saravanan@alpharithm.com",
        pass: "Vigneswaran@2026",
      },
    });

    const taskMailConfig = {
      from: "vigneswaran.saravanan@alpharithm.com",
      to: "prem@alpharithm.com",
      cc: "geetha.k@ant.works",
      // cc: "kalaivani17546@gmail.com",
      subject: `Daily Project Progress Report - Vigneshwaran - ${today}`,
      text: `
Hi sir,

Good Evening,

Please find my daily project progress report at the link below:

https://docs.google.com/spreadsheets/d/1BqRS88ys1TeGblcRoAvN1qtbEO6F4c4ZGHrbUHbeItw/edit?usp=sharing

The report is updated with the day's development activities, task status, and effort logged.

Please let me know if any additional information is required.

Regards,
Vigneshwaran S`,
    };

    const taskMailResponse = await transporter.sendMail(taskMailConfig);

    console.log("Delivered Mail Details : \n ", taskMailResponse);

    return new Response(
      JSON.stringify({
        message: "Mail Sent Successfully",
        taskMailResponse,
      }),
      { statusCode: 200 },
    );
  } catch (e) {
    console.log("Error Ocurred :", e.message);
    return new Response(
      JSON.stringify({ error: "Mail Failed To Send", message: e.message }),
      { statusCode: 500 },
    );
  }
};

export const config = {
  schedule: "30 13 * * 1-5",
};
