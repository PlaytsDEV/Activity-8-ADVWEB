import { useState } from 'react'
import { Card, Table, Badge, Button, Form } from 'react-bootstrap'

export default function StudentTable({ students, onDeleteStudent, onSelectStudent, activeStudentId }) {
  const [filterCourse, setFilterCourse] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const courses = Array.from(new Set(students.map((s) => s.course)))

  const filteredStudents = students.filter((student) => {
    const matchesCourse = filterCourse === 'ALL' || student.course === filterCourse
    const fullName = `${student.firstname} ${student.lastname}`.toLowerCase()
    const address = student.address.toLowerCase()
    const email = student.email.toLowerCase()
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !query ||
      fullName.includes(query) ||
      address.includes(query) ||
      email.includes(query)
    return matchesCourse && matchesSearch
  })

  const getCourseBadgeColor = (course) => {
    if (course.includes('Computer Science')) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    if (course.includes('Information Tech')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (course.includes('Engineering')) return 'bg-amber-50 text-amber-700 border-amber-200'
    if (course.includes('Information Sys')) return 'bg-teal-50 text-teal-700 border-teal-200'
    if (course.includes('Data Science')) return 'bg-purple-50 text-purple-700 border-purple-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <Card className="border border-slate-200/90 rounded-2xl shadow-xs bg-white overflow-hidden">
      <Card.Header className="bg-white border-b border-slate-100 py-3.5 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="font-bold text-sm text-slate-900 heading-font">
              Registered Students
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {students.length} Total
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs w-44 sm:w-52 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-3.5 h-9 bg-slate-50/50 text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
            {courses.length > 0 && (
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="text-xs w-36 sm:w-44 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-3 h-9 bg-slate-50/50 text-slate-700 outline-none transition-all cursor-pointer"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card.Header>

      <div className="overflow-x-auto">
        <table className="w-full mb-0 text-xs text-left">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase font-semibold text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-semibold w-12 text-center">#</th>
              <th className="py-3.5 px-4 font-semibold">Student Name</th>
              <th className="py-3.5 px-4 font-semibold">Course</th>
              <th className="py-3.5 px-4 font-semibold">Email</th>
              <th className="py-3.5 px-4 font-semibold">Address</th>
              <th className="py-3.5 px-4 font-semibold">Coordinates</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-xs">
                      {students.length === 0
                        ? 'No student records yet. Fill out the form above to add a student.'
                        : 'No matching records found for your search.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const isActive = activeStudentId === student.id
                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isActive ? 'bg-indigo-50/70 font-medium' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-400 text-center font-medium text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0">
                          {student.firstname[0]}{student.lastname[0]}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {student.firstname} {student.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md border ${getCourseBadgeColor(student.course)}`}>
                        {student.course}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-normal">{student.email}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate" title={student.address}>
                      {student.address}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {student.lat.toFixed(4)}, {student.lng.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="text-xs font-medium py-1.5 px-3 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 flex items-center gap-1.5 transition-all cursor-pointer"
                          onClick={() => onSelectStudent(student)}
                          title="Locate on map"
                        >
                          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Locate
                        </button>
                        <button
                          type="button"
                          className="text-xs font-medium py-1.5 px-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 flex items-center gap-1.5 transition-all cursor-pointer"
                          onClick={() => onDeleteStudent(student.id)}
                          title="Delete student record"
                        >
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
