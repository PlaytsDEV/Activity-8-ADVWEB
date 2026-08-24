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

  return (
    <Card className="border border-neutral-300 rounded-lg shadow-sm bg-white">
      <Card.Header className="bg-neutral-100 border-b border-neutral-200 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm uppercase tracking-wider text-neutral-800">
              [03] Registered Students
            </span>
            <Badge bg="dark" className="font-mono text-xs">
              {students.length} Total
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Form.Control
              type="text"
              placeholder="Search..."
              size="sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs w-36 sm:w-44 border-neutral-300 rounded-md"
            />
            {courses.length > 0 && (
              <Form.Select
                size="sm"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="text-xs w-36 sm:w-44 border-neutral-300 rounded-md"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>
        </div>
      </Card.Header>

      <div className="overflow-x-auto">
        <Table hover responsive className="mb-0 text-xs align-middle">
          <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">#</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">Name</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">Course</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">Email</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">Address</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px]">Coordinates</th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[11px] text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-neutral-400 font-mono">
                  {students.length === 0
                    ? 'No student records yet. Use the form above to add a student.'
                    : 'No matching records found.'}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const isActive = activeStudentId === student.id
                return (
                  <tr
                    key={student.id}
                    className={`border-b border-neutral-100 transition-colors ${
                      isActive ? 'bg-neutral-100/90 font-medium' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-neutral-400 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-neutral-900">
                      {student.firstname} {student.lastname}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge bg="secondary" className="font-normal text-[11px] bg-neutral-700">
                        {student.course}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 font-mono">{student.email}</td>
                    <td className="py-2.5 px-3 text-neutral-700 max-w-[200px] truncate" title={student.address}>
                      {student.address}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 font-mono text-[11px]">
                      {student.lat.toFixed(4)}, {student.lng.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="text-[11px] py-1 px-2.5 rounded border-neutral-400 hover:bg-neutral-900 hover:text-white"
                          onClick={() => onSelectStudent(student)}
                          title="Locate on map"
                        >
                          Locate
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="text-[11px] py-1 px-2.5 rounded"
                          onClick={() => onDeleteStudent(student.id)}
                          title="Delete student record"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}
