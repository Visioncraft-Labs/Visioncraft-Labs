import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface ContactEmailParams {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface ImageUploadEmailParams {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  fileName: string;
  originalName: string;
}

export async function sendContactEmail(params: ContactEmailParams): Promise<boolean> {
  try {
    const msg = {
      to: 'visioncraftlabs@gmail.com',
      from: 'visioncraftlabs@gmail.com', // Must be verified sender
      subject: `New Contact Form Submission from ${params.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #007bff;">Contact Details</h3>
            <p><strong>Name:</strong> ${params.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${params.email}">${params.email}</a></p>
            ${params.phone ? `<p><strong>Phone:</strong> <a href="tel:${params.phone}">${params.phone}</a></p>` : ''}
          </div>
          
          <div style="background: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${params.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the VisionCraft Labs website contact form.</p>
            <p>Received at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid contact email error:', error);
    return false;
  }
}

export async function sendImageUploadNotification(params: ImageUploadEmailParams): Promise<boolean> {
  try {
    const msg = {
      to: 'visioncraftlabs@gmail.com',
      from: 'visioncraftlabs@gmail.com', // Must be verified sender
      subject: `New Image Upload - ${params.originalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
            New Image Upload for Preview
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28a745;">Upload Details</h3>
            <p><strong>Original File Name:</strong> ${params.originalName}</p>
            <p><strong>Server File Name:</strong> ${params.fileName}</p>
            <p><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${params.clientName || params.clientEmail || params.clientPhone ? `
          <div style="background: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Client Information</h3>
            ${params.clientName ? `<p><strong>Name:</strong> ${params.clientName}</p>` : ''}
            ${params.clientEmail ? `<p><strong>Email:</strong> <a href="mailto:${params.clientEmail}">${params.clientEmail}</a></p>` : ''}
            ${params.clientPhone ? `<p><strong>Phone:</strong> <a href="tel:${params.clientPhone}">${params.clientPhone}</a></p>` : ''}
          </div>
          ` : `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Note:</strong> No client contact information was provided with this upload.</p>
          </div>
          `}
          
          <div style="background: #d1ecf1; border: 1px solid #b8daff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;"><strong>Next Steps:</strong> Log into the admin panel to view the uploaded image and prepare the preview transformation.</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the VisionCraft Labs image upload system.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid image upload email error:', error);
    return false;
  }
}