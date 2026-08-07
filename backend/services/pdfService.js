import PDFDocument from 'pdfkit';

export const PDFService = {
  /**
   * Generates a PDF binary Buffer from resume metadata
   */
  async generateResumePDF(resumeData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40 });
        const buffers = [];

        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        const personal = resumeData.personalInfo || {};

        // Header
        doc.fontSize(22).fillColor('#1e293b').text(personal.fullName || 'Candidate Name', { align: 'center' });
        doc.fontSize(10).fillColor('#64748b').text(`${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''}`, { align: 'center' });
        if (personal.linkedIn || personal.github) {
          doc.fontSize(9).fillColor('#2563eb').text(`${personal.linkedIn || ''} ${personal.github || ''}`, { align: 'center' });
        }
        doc.moveDown();

        // Professional Summary
        if (resumeData.summary) {
          doc.fontSize(14).fillColor('#0f172a').text('PROFESSIONAL SUMMARY', { underline: true });
          doc.fontSize(10).fillColor('#334155').text(resumeData.summary);
          doc.moveDown();
        }

        // Skills
        if (resumeData.skills && resumeData.skills.length > 0) {
          doc.fontSize(14).fillColor('#0f172a').text('TECHNICAL SKILLS', { underline: true });
          const skillStr = Array.isArray(resumeData.skills)
            ? resumeData.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')
            : resumeData.skills;
          doc.fontSize(10).fillColor('#334155').text(skillStr);
          doc.moveDown();
        }

        // Experience
        if (resumeData.experience && resumeData.experience.length > 0) {
          doc.fontSize(14).fillColor('#0f172a').text('EXPERIENCE', { underline: true });
          resumeData.experience.forEach(exp => {
            doc.fontSize(11).fillColor('#1e293b').text(`${exp.title || 'Role'} - ${exp.company || 'Company'} (${exp.duration || ''})`);
            doc.fontSize(9.5).fillColor('#475569').text(exp.description || exp.bullets?.join('\n') || '');
            doc.moveDown(0.5);
          });
          doc.moveDown();
        }

        // Education
        if (resumeData.education && resumeData.education.length > 0) {
          doc.fontSize(14).fillColor('#0f172a').text('EDUCATION', { underline: true });
          resumeData.education.forEach(edu => {
            doc.fontSize(11).fillColor('#1e293b').text(`${edu.degree || 'Degree'} - ${edu.institution || 'University'} (${edu.year || ''})`);
            if (edu.gpa) doc.fontSize(9.5).fillColor('#475569').text(`GPA/Score: ${edu.gpa}`);
            doc.moveDown(0.5);
          });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
};
