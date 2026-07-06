import React from 'react';

// ============================================
// STATIC TEACHER DATA — just edit values below
// ============================================
const teacher = {
  picture: "https://media.istockphoto.com/id/1792831384/photo/portrait-of-indian-woman-as-a-teacher-in-sari-standing-isolated-over-white-background-stock.jpg?s=612x612&w=0&k=20&c=K7NQphDwtrasHdX1LHf-HRLmSSxaHYdJznKaQsTDIHs=",
  name: "Fatima Zahra",
  designation: "ICT Teacher",
  qualification: "M.Sc. in Computer Science, Kamil",
  joinDate: "July 10, 2016",
  schoolJoinDate: "February 1, 2018",
  teachingExperience: 10,
  bio: "Dedicated ICT teacher with 10 years of experience introducing students to computer science, programming fundamentals, and digital literacy. Passionate about blending technology with Islamic education to prepare students for the modern world.",
  contact: {
    phone: "+880 1712-345678",
    email: "fatima.zahra@example.com",
    presentAddress: "House 12, Road 5, Mirpur, Dhaka-1216",
    permanentAddress: "Village: Sonargaon, Upazila: Sonargaon, District: Narayanganj",
    bloodGroup: "B+",
    emergencyContact: {
      name: "Md. Yusuf Ali (Brother)",
      phone: "+880 1812-987654",
    },
    social: {
      facebook: "https://facebook.com/fatima.zahra",
      linkedin: "https://linkedin.com/in/fatima-zahra",
      instagram: "https://instagram.com/fatima.zahra",
      twitter: "https://x.com/fatima_zahra",
    },
  },
  education: [
    {
      id: "ssc",
      label: "SSC / Dakhil",
      institute: "Dhaka Aliya Madrasha",
      year: 2005,
      grade: "GPA 5.00",
      color: "blue",
    },
    {
      id: "hsc",
      label: "HSC / Alim",
      institute: "Dhaka Aliya Madrasha",
      year: 2007,
      grade: "GPA 5.00",
      color: "indigo",
    },
    {
      id: "honours",
      label: "Honours (B.Sc. in CSE)",
      institute: "Jahangirnagar University",
      year: 2011,
      grade: "First Class",
      color: "purple",
    },
    {
      id: "masters",
      label: "Masters (M.Sc. in CSE)",
      institute: "University of Dhaka",
      year: 2013,
      grade: "First Class",
      color: "pink",
    },
  ],
};

const colorMap = {
  blue: { border: "border-blue-500", badgeBg: "bg-blue-100", badgeText: "text-blue-800" },
  indigo: { border: "border-indigo-500", badgeBg: "bg-indigo-100", badgeText: "text-indigo-800" },
  purple: { border: "border-purple-500", badgeBg: "bg-purple-100", badgeText: "text-purple-800" },
  pink: { border: "border-pink-500", badgeBg: "bg-pink-100", badgeText: "text-pink-800" },
  green: { border: "border-green-500", badgeBg: "bg-green-100", badgeText: "text-green-800" },
};

const TeacherProfile = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={teacher.picture}
              alt={teacher.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>

          <div className="text-center md:text-left text-white flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{teacher.name}</h1>
            <p className="text-xl text-blue-100 mt-1">{teacher.designation}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                📅 Joined: {teacher.joinDate}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                🏫 School: {teacher.schoolJoinDate}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                ⭐ {teacher.qualification}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Bio */}
        {teacher.bio && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
          </div>
        )}

        {/* Contact Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-teal-600">📇</span> Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-800">{teacher.contact.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">{teacher.contact.email}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500">Present Address</p>
              <p className="text-base font-medium text-gray-800">{teacher.contact.presentAddress}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500">Permanent Address</p>
              <p className="text-base font-medium text-gray-800">{teacher.contact.permanentAddress}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="text-base font-medium text-red-700">🩸 {teacher.contact.bloodGroup}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="text-base font-medium text-gray-800">{teacher.contact.emergencyContact.name}</p>
              <p className="text-sm text-gray-600">{teacher.contact.emergencyContact.phone}</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-4">
            <a
              href={teacher.contact.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
              </svg>
            </a>
            <a
              href={teacher.contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
            <a
              href={teacher.contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.14c-.3.76-.5 1.63-.56 2.91C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.63.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </svg>
            </a>
            <a
              href={teacher.contact.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-6.9L4 22H1l8.1-9.3L1 2h7.3l5.1 6.4L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Professional Life */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">👨‍🏫</span> Professional Life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm text-gray-500">Started Teaching Career</p>
              <p className="text-lg font-semibold text-gray-800">{teacher.joinDate}</p>
              <p className="text-sm text-gray-600 mt-1">{teacher.teachingExperience}+ Years Experience</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <p className="text-sm text-gray-500">Joined This School</p>
              <p className="text-lg font-semibold text-gray-800">{teacher.schoolJoinDate}</p>
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-indigo-600">🎓</span> Education
          </h2>
          <div className="space-y-4">
            {teacher.education.map((edu) => {
              const c = colorMap[edu.color] || colorMap.blue;
              return (
                <div
                  key={edu.id}
                  className={`bg-gray-50 rounded-xl p-5 border-l-4 ${c.border} hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.label}</h3>
                      <p className="text-gray-600">{edu.institute}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block ${c.badgeBg} ${c.badgeText} px-3 py-1 rounded-full text-sm font-medium`}>
                        {edu.year}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Grade: {edu.grade}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{teacher.teachingExperience}+</p>
            <p className="text-xs text-gray-600">Years Experience</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">📚</p>
            <p className="text-xs text-gray-600">Qualified Teacher</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">🏆</p>
            <p className="text-xs text-gray-600">Expert Educator</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">⭐</p>
            <p className="text-xs text-gray-600">Dedicated Mentor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;