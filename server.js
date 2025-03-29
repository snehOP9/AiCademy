const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

let knowledgeBase = "";

function loadKnowledgeBase() {
  const files = [
    'frontend.html',
    'academics.html',
    'administration.html',
    'admission.html',
    'campus.html',
    'courses.html',
    'digitalLibrary.html',
    'gpacalculator.html',
    'hostel.html'
  ];

  knowledgeBase = "";

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(html);
      knowledgeBase += $('body').text().replace(/\s+/g, ' ') + '\n';
    }
  });

  console.log("✅ Knowledge base loaded.");
}

loadKnowledgeBase();

app.post('/api/chatbot', (req, res) => {
  const message = req.body.message?.toLowerCase() || "";
  let reply = "Sorry, I couldn't find anything about that. Try asking about admissions, hostel, GPA, or fees.";

  if (message.includes("admission") && message.includes("apply")) {
    reply = "To apply for admission, go to the Admissions page and fill out the online form.";
  } else if (message.includes("admission fees") || message.includes("application fees")) {
    reply = "Admission fees vary by program. Please refer to the Admission section for course-wise fees.";
  } else if (message.includes("tagore") || message.includes("patel")) {
    reply = "Tagore Hostel: ₹95,000/year (3-Seater AC), Patel Hostel: ₹70,000/year (4-Seater Non-AC).";
  } else if (message.includes("gpa") && message.includes("calculate")) {
    reply = "Go to the GPA Calculator page and enter your subject grades to calculate GPA.";
  } else if (message.includes("grading system")) {
    reply = "The grading system uses GPA out of 10. Refer to the GPA Calculator section.";
  } else if (message.includes("exam schedule")) {
    reply = "Exam schedules are listed in the Academics section under Examinations.";
  } else if (message.includes("library") || message.includes("ebooks") || message.includes("digital library")) {
    reply = "The Digital Library has PDFs and PPTs for all subjects.";
  } else if (message.includes("campus") && message.includes("map")) {
    reply = "You can view the campus on the embedded Google Map in the Campus section.";
  } else if (message.includes("placement")) {
    reply = "Placement support is provided by the Career Development Cell.";
  } else if (message.includes("courses") || message.includes("programs")) {
    reply = "AiCademy offers B.Tech, BBA, MBA, M.Tech and more. See the Courses page.";
  } else if (message.includes("contact admin") || message.includes("admin email") || message.includes("helpdesk")) {
    reply = "Email: admissions@cumail.in, Phone: 1800 257 1800. Office hours: Mon–Fri, 9 AM–5 PM.";
  } else if (message.includes("reset gpa")) {
    reply = "Click the 'Reset' button in the GPA Calculator page.";
  } else if (message.includes("research") || message.includes("labs")) {
    reply = "Research labs are covered under Academics > Resources.";
  } else if (message.includes("counselling")) {
    reply = "Counseling support is available in the Academics section.";
  } else if (message.includes("upload notes")) {
    reply = "You can upload PDFs in the Digital Library section.";
  } else if (message.includes("eligibility")) {
    reply = "Eligibility depends on your course. Check the Admission page.";
  } else if (message.includes("room types")) {
    reply = "Hostels offer 3-seater AC, 4-seater Non-AC, and twin sharing.";
  } else if (message.includes("duration") && message.includes("b.tech")) {
    reply = "B.Tech is a 4-year undergraduate program.";
  } else if (message.includes("fees") && message.includes("pay")) {
    reply = "Fees can be paid online via the portal or offline at the admin office.";
  } else if (message.includes("ai") && message.includes("bot")) {
    reply = "Hi! I’m AiCademy Bot — here to help with your campus questions 😊";
  }

  res.json({ reply });
});

app.post('/api/admission', (req, res) => {
  console.log("📥 New Admission Form Submission:", req.body);
  res.json({ message: "Application submitted successfully!" });
});

app.listen(PORT, () => {
  console.log(`🚀 AiCademy backend running at http://localhost:${PORT}`);
});
