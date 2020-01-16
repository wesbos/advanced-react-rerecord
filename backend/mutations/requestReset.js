import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { transport, makeANiceEmail } from '../src/mail';

export async function requestReset(parent, args, ctx, info, { query }) {
  // 1. Check if this is a real user
  const response = await query(
    `query {
      allUsers(where: { email: "${args.email}" }) {
        email
        id
      }
    }`
  );

  const [user] = response.data.allUsers;
  if (!user) {
    throw new Error(`No such user found for email ${args.email}`);
  }
  // 2. Set a reset token and expiry on that user
  const resetToken = (await promisify(randomBytes)(20)).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
  const updateResponse = await query(`mutation {
    updateUser(
      id: "${user.id}",
      data: { resetToken: "${resetToken}", resetTokenExpiry: "${resetTokenExpiry}" },
    ) {
      email
      resetToken
      resetTokenExpiry
    }
  }`);

  // 3. Email them that reset token
  const mailRes = await transport.sendMail({
    from: 'wes@wesbos.com',
    to: user.email,
    subject: 'Your Password Reset Token',
    html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
  });

  // 4. Return the message
  return { message: 'Check your email son!' };
}
