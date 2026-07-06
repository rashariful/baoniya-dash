import React, { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Award,
  MessageSquare,
  Settings,
  Download,
  Search,
  Filter,
  Star,
  Target,
  Bell,
  BookMarked,
  Video,
  FileText,
  Users,
  BarChart3,
  GraduationCap,
  AlertCircle,
  ChevronDown,
  ThumbsUp,
  Calendar as CalendarIcon,
  Home,
  FolderOpen,
  User
} from 'lucide-react'

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Mock Student Data
  const studentData = {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    joinDate: "January 2024",
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 47,
    overallProgress: 68,
    averageGrade: 87,
    rank: "Top 15%",
    streak: 12
  }

  // Enrolled Courses
  const enrolledCourses = [
    {
      id: 1,
      name: "Web Development Bootcamp",
      instructor: "Dr. Sarah Johnson",
      progress: 72,
      nextLesson: "Responsive Design",
      nextLessonTime: "Today, 10:00 AM",
      totalLessons: 24,
      completedLessons: 17,
      image: "🌐",
      grade: "A-",
      lastAccessed: "2 hours ago"
    },
    {
      id: 2,
      name: "Advanced React Development",
      instructor: "Prof. Michael Brown",
      progress: 45,
      nextLesson: "Hooks Deep Dive",
      nextLessonTime: "Tomorrow, 2:00 PM",
      totalLessons: 18,
      completedLessons: 8,
      image: "⚛️",
      grade: "B+",
      lastAccessed: "Yesterday"
    },
    {
      id: 3,
      name: "Data Structures & Algorithms",
      instructor: "Dr. Emily Wilson",
      progress: 38,
      nextLesson: "Binary Trees",
      nextLessonTime: "Wed, 9:00 AM",
      totalLessons: 32,
      completedLessons: 12,
      image: "📊",
      grade: "B",
      lastAccessed: "3 days ago"
    }
  ]

  // Upcoming Events
  const upcomingEvents = [
    { id: 1, title: "Live Session: React Hooks", course: "Advanced React", time: "Today, 2:00 PM", duration: "90 min", type: "live" },
    { id: 2, title: "Assignment Due: CSS Project", course: "Web Development", time: "Tomorrow, 11:59 PM", duration: "Pending", type: "assignment" },
    { id: 3, title: "Quiz: JavaScript Fundamentals", course: "Web Development", time: "Friday, 3:00 PM", duration: "30 min", type: "quiz" }
  ]

  // Recent Activities
  const recentActivities = [
    { id: 1, action: "Completed lesson", item: "CSS Styling Basics", course: "Web Development", time: "2 hours ago", points: 50 },
    { id: 2, action: "Submitted assignment", item: "HTML Project", course: "Web Development", time: "Yesterday", points: 100 },
    { id: 3, action: "Watched video", item: "React Components", course: "Advanced React", time: "2 days ago", points: 25 }
  ]

  // Achievements
  const achievements = [
    { id: 1, title: "Quick Learner", description: "Completed 5 lessons in one day", icon: "⚡", earned: true },
    { id: 2, title: "Perfect Score", description: "Got 100% on a quiz", icon: "🎯", earned: true },
    { id: 3, title: "7 Day Streak", description: "Active for 7 days straight", icon: "🔥", earned: true },
    { id: 4, title: "Assignment Master", description: "Submit 10 assignments", icon: "📝", earned: false, progress: 7 }
  ]

  // Course Modules
  const courseModules = {
    1: [
      { id: 1, title: "HTML & CSS Fundamentals", completed: true, lessons: 3, completedLessons: 3 },
      { id: 2, title: "JavaScript Essentials", completed: true, lessons: 5, completedLessons: 5 },
      { id: 3, title: "Responsive Design", completed: false, lessons: 4, completedLessons: 2 },
      { id: 4, title: "React Basics", completed: false, lessons: 6, completedLessons: 0 }
    ]
  }

  const getEventIcon = (type) => {
    switch(type) {
      case 'live': return <Video className="w-4 h-4 text-red-500" />;
      case 'assignment': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'quiz': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Calendar className="w-4 h-4 text-blue-500" />;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
    

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">My Courses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{studentData.totalCourses}</p>
                  <p className="text-green-600 text-xs mt-1">{studentData.completedCourses} completed</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Learning Hours</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{studentData.totalHours}</p>
                  <p className="text-gray-600 text-xs mt-1">This month</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{studentData.overallProgress}%</p>
                  <p className="text-green-600 text-xs mt-1">+12% this week</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{studentData.streak} days</p>
                  <p className="text-orange-600 text-xs mt-1">Keep going! 🔥</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-6">
              {['overview', 'my courses', 'learning', 'achievements', 'calendar'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Continue Learning Section */}
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Continue Learning</h2>
                <div className="grid grid-cols-1 gap-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{course.image}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{course.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{course.instructor}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium text-gray-600">Grade: {course.grade}</span>
                            <p className="text-xs text-gray-400 mt-0.5">{course.lastAccessed}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Course Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 rounded-full h-2"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-600">
                            <PlayCircle className="w-4 h-4 mr-1 text-blue-600" />
                            <span>Next: {course.nextLesson}</span>
                          </div>
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900">Upcoming Events</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-0.5">{getEventIcon(event.type)}</div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{event.course}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{event.time}</span>
                                  <span className="mx-1">•</span>
                                  <span>{event.duration}</span>
                                </div>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-xs">
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Streak */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-gray-900">
                                <span className="font-medium">{activity.action}</span>
                                <span className="text-gray-600">: {activity.item}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{activity.course}</p>
                              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-medium text-green-600">+{activity.points} pts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-4">
                    <div className="text-white">
                      <p className="text-xs opacity-90">Weekly Goal</p>
                      <p className="text-2xl font-bold mt-1">8/12 hours</p>
                      <div className="mt-2">
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-1.5">
                          <div className="bg-white rounded-full h-1.5" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      <p className="text-xs mt-2 opacity-90">4 more hours to reach goal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'my courses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{course.image}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{course.name}</h3>
                            <p className="text-xs text-gray-500">{course.instructor}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {course.progress}%
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span>{course.grade}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 rounded-full h-1.5"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                          Continue
                        </button>
                        <button className="px-3 py-1.5 border border-gray-300 text-xs rounded-lg hover:bg-gray-50">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === 'learning' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">Web Development Bootcamp</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {courseModules[1].map((module) => (
                    <div key={module.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <h4 className="font-medium text-gray-900 text-sm">{module.title}</h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {module.completedLessons}/{module.lessons} lessons
                        </span>
                      </div>
                      <div className="ml-7">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 rounded-full h-1.5"
                            style={{ width: `${(module.completedLessons / module.lessons) * 100}%` }}
                          ></div>
                        </div>
                        {!module.completed && (
                          <button className="mt-2 text-blue-600 hover:text-blue-700 text-xs flex items-center">
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Continue Learning
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Resources</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">JavaScript DOM Manipulation</span>
                    </div>
                    <span className="text-xs text-gray-500">15 min</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">CSS Grid Cheatsheet</span>
                    </div>
                    <span className="text-xs text-gray-500">PDF</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-sm p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <Award className="w-12 h-12 mb-2" />
                    <h2 className="text-2xl font-bold">Student of the Month</h2>
                    <p className="text-sm opacity-90 mt-1">Outstanding performance in Web Development</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{studentData.averageGrade}%</div>
                    <p className="text-sm opacity-90">Average Grade</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`bg-white rounded-lg shadow-sm p-4 ${!achievement.earned ? 'opacity-60' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
                        {achievement.progress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 rounded-full h-1.5"
                                style={{ width: `${(achievement.progress / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {achievement.earned && (
                          <div className="mt-2 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                            <span className="text-xs text-green-600">Earned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">March 2024</h2>
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className="border rounded-lg p-2 min-h-[80px] hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-600">{day}</span>
                      {day === 12 && (
                        <div className="mt-1">
                          <div className="bg-blue-100 text-blue-700 text-xs rounded px-1 py-0.5 truncate">
                            Live Session
                          </div>
                        </div>
                      )}
                      {day === 15 && (
                        <div className="mt-1">
                          <div className="bg-orange-100 text-orange-700 text-xs rounded px-1 py-0.5 truncate">
                            Assignment Due
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard