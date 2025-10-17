const PDFDocument = require('pdfkit');

function generatePdfBuffer(idea) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('Startup Idea Validator - Report', { align: 'center' });
      doc.moveDown();

      // Meta
      doc.fontSize(12).text(`Idea ID: ${idea._id}`);
      doc.text(`Submitted By: ${idea.user?.name || idea.user?.email || 'N/A'}`);
      doc.text(`Submitted On: ${idea.createdAt.toISOString().split('T')[0]}`);
      doc.moveDown();

      // Content
      doc.fontSize(14).text('Title:');
      doc.fontSize(12).text(idea.title || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Problem:');
      doc.fontSize(12).text(idea.problem || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Solution:');
      doc.fontSize(12).text(idea.solution || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Market:');
      doc.fontSize(12).text(idea.market || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Revenue Model:');
      doc.fontSize(12).text(idea.revenueModel || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Team:');
      doc.fontSize(12).text(idea.team || '-', { indent: 10 });
      doc.moveDown();

      doc.fontSize(14).text('Score & Classification:');
      doc.fontSize(12).text(`Score: ${idea.score} / 100`);
      doc.text(`Classification: ${idea.classification}`);
      doc.moveDown();

      if (idea.feedback) {
        doc.fontSize(14).text('Admin Feedback:');
        doc.fontSize(12).text(idea.feedback, { indent: 10 });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePdfBuffer };
