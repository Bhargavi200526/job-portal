import { Request, Response } from 'express';
import { Webhook } from 'svix';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const webhookHandler = async (req: Request, res: Response): Promise<void> => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    res.status(500).json({ message: "Webhook secret not configured" });
    return;
  }

  const svix = new Webhook(WEBHOOK_SECRET);
  const headers = {
    'svix-id': req.headers['svix-id'] as string,
    'svix-timestamp': req.headers['svix-timestamp'] as string,
    'svix-signature': req.headers['svix-signature'] as string,
  };

  let event: any;

  try {
    const payload = await svix.verify(JSON.stringify(req.body), headers);
    event = payload;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    res.status(400).json({ message: 'Invalid webhook signature' });
    return;
  }

  const eventType = event.type;
  const data = event.data;

  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url, public_metadata } = data;

        await User.create({
          id,
          email: email_addresses[0]?.email_address || '',
          name: `${first_name} ${last_name}`,
          image: image_url,
          resume: public_metadata?.resume || '',
        });

        res.status(201).json({ message: 'User created successfully' });
        return;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url } = data;

        await User.findOneAndUpdate(
          { id },
          {
            email: email_addresses[0]?.email_address || '',
            name: `${first_name} ${last_name}`,
            image: image_url,
          },
          { new: true }
        );

        res.status(200).json({ message: 'User updated successfully' });
        return;
      }

      case 'user.deleted': {
        const { id } = data;

        await User.findOneAndDelete({ id });

        res.status(200).json({ message: 'User deleted successfully' });
        return;
      }

      default:
        res.status(200).json({ message: 'Unhandled event type' });
        return;
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export default webhookHandler;
