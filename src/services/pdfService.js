import { API_KEYS, API_ENDPOINTS, canMakeRequest, logApiCall } from '../config/apiKeys';

/**
 * Generate PDF receipt from booking data
 * Uses PDFBolt API
 */
export const generateBookingReceipt = async (booking) => {
  if (!canMakeRequest('pdfBolt')) {
    return { error: 'Rate limit reached', fallback: true };
  }

  try {
    // Build HTML template for receipt
    const html = buildReceiptHTML(booking);

    let blob;
    if (String(import.meta.env.VITE_USE_PROXY).toLowerCase() === 'true') {
      // Proxy will handle Authorization and return the PDF bytes
      const resp = await fetch('/proxy/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });
      if (!resp.ok) throw new Error(`Proxy PDF error: ${resp.status}`);
      blob = await resp.blob();
    } else {
      const response = await fetch(`${API_ENDPOINTS.pdfBolt}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.pdfBolt}`,
        },
        body: JSON.stringify({
          html,
          options: {
            format: 'A4',
            margin: {
              top: '20mm',
              right: '15mm',
              bottom: '20mm',
              left: '15mm',
            },
            printBackground: true,
            preferCSSPageSize: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`PDFBolt API error: ${response.status}`);
      }

      blob = await response.blob();
    }
    logApiCall('pdfBolt', true, 'generateBookingReceipt');

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartWash-Receipt-${booking.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, message: 'Receipt downloaded!' };
  } catch (error) {
    console.error('PDF generation error:', error);
    logApiCall('pdfBolt', false, 'generateBookingReceipt');
    
    return {
      error: 'Failed to generate PDF',
      fallback: true,
      message: 'Unable to generate receipt at this time',
    };
  }
};

/**
 * Build HTML template for booking receipt
 */
const buildReceiptHTML = (booking) => {
  const services = {
    express: { name: 'Express Wash', price: 'KSh 1,500' },
    premium: { name: 'Premium Detail', price: 'KSh 3,500' },
    ultimate: { name: 'Ultimate Protection', price: 'KSh 6,000' },
    interior: { name: 'Interior Deep Clean', price: 'KSh 2,500' },
  };

  const service = services[booking.service] || services.express;
  const total = booking.totalPrice || parseInt(service.price.replace(/\D/g, ''), 10);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: #ffffff;
          padding: 40px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 2px solid #2C9BEF;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(44, 155, 239, 0.3);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2C9BEF;
          padding-bottom: 30px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #2C9BEF 0%, #60D5FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .tagline {
          color: #60D5FF;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .receipt-title {
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          margin: 30px 0 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .booking-id {
          background: rgba(44, 155, 239, 0.2);
          border: 1px solid #2C9BEF;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
        }
        .booking-id strong {
          color: #60D5FF;
          font-size: 18px;
        }
        .section {
          margin: 25px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 4px solid #2C9BEF;
        }
        .section-title {
          color: #60D5FF;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .section-content {
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .total-section {
          background: linear-gradient(135deg, rgba(44, 155, 239, 0.3) 0%, rgba(96, 213, 255, 0.3) 100%);
          border: 2px solid #2C9BEF;
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .total-label {
          color: #60D5FF;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .total-amount {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #2C9BEF 0%, #60D5FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid rgba(44, 155, 239, 0.3);
          color: #999;
          font-size: 14px;
        }
        .footer strong {
          color: #60D5FF;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SMART WASH</div>
          <div class="tagline">Nairobi Premium</div>
        </div>

        <div class="receipt-title">Booking Confirmation</div>
        
        <div class="booking-id">
          <strong>Booking ID: #${booking.id}</strong>
        </div>

        <div class="details-grid">
          <div class="section">
            <div class="section-title">Customer Name</div>
            <div class="section-content">${booking.name}</div>
          </div>
          <div class="section">
            <div class="section-title">Phone Number</div>
            <div class="section-content">${booking.phone}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Service</div>
          <div class="section-content">${service.name}</div>
        </div>

        ${booking.vehicle ? `
        <div class="section">
          <div class="section-title">Vehicle</div>
          <div class="section-content">${booking.vehicle.make} ${booking.vehicle.model} • ${booking.vehicle.plate}</div>
        </div>
        ` : ''}

        <div class="details-grid">
          <div class="section">
            <div class="section-title">Date</div>
            <div class="section-content">${booking.date || 'TBD'}</div>
          </div>
          <div class="section">
            <div class="section-title">Time</div>
            <div class="section-content">${booking.time || 'TBD'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Service Location</div>
          <div class="section-content">${booking.location}</div>
        </div>

        <div class="section">
          <div class="section-title">Status</div>
          <div class="section-content">
            <span class="status-badge">${booking.status || 'Pending'}</span>
          </div>
        </div>

        <div class="total-section">
          <div class="total-label">Total Amount</div>
          <div class="total-amount">KSh ${total.toLocaleString()}</div>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing SmartWash!</strong></p>
          <p>We'll contact you shortly to confirm your booking details.</p>
          <p style="margin-top: 20px;">Questions? Contact us at +254 700 000 000</p>
          <p style="margin-top: 10px; font-size: 12px;">Generated on ${new Date().toLocaleString('en-GB')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
