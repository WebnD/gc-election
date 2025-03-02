import { Log, Vote } from '@/lib/actions';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { selectedCandidate, email } = await req.json();
    console.log("Logging user")
    const response = await Log();
    
    if (selectedCandidate.$id !== "abstain" && selectedCandidate.$id !== "nota" && response) {
      await Vote(selectedCandidate);
      await sendVoteConfirmationEmail(email, selectedCandidate);
    }

    return NextResponse.json({ success: true, message: "Vote Added & Email Sent" });
  } catch (error: any) {
    console.error("Failed to confirm booking", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

// Function to send confirmation email
async function sendVoteConfirmationEmail(email: string, candidate: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Election System" <election.gc@iitbbs.ac.in>`,
    to: email,
    bcc: "gsecsnt.sg@gmail.com",
    subject: "✅ Your Vote Has Been Successfully Recorded!",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #333; margin: 0;">🗳️ Vote Confirmation</h2>
          <p style="color: #555; font-size: 14px;">Thank you for participating in the election!</p>
        </div>

         <!-- Table for Candidate Details -->
  <table role="presentation" style="width: 100%; background: #f8f9fa; padding: 15px; border-radius: 8px; border-spacing: 0; text-align: center;">
    <tr>
      <td style="padding-bottom: 10px;">
        <img src="${candidate.photo}" alt="${candidate.name}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #007bff; margin-bottom: 10px;" />
      </td>
    </tr>
    <tr>
      <td>
        <h3 style="margin: 0; color: #333;">${candidate.name}</h3>
        <p style="margin: 4px 0; color: #666;"><strong>Roll Number:</strong> ${candidate.rollNumber}</p>
      </td>
    </tr>
  </table>

        <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-left: 4px solid #007bff; border-radius: 5px;">
          <p style="margin: 0; color: #333; font-size: 14px;"><strong>📜 Team:</strong> ${candidate.team}</p>
        </div>

        <p style="margin-top: 20px; color: #444; font-size: 14px; text-align: center;">
          If you did not cast this vote, please contact the election committee immediately.
        </p>

        <div style="margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #777;">For any queries, contact:</p>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">vpresident.sg@iitbbs.ac.in</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Web and Design Society IIT Bhubaneswar</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
