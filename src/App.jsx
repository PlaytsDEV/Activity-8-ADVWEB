import { useState } from 'react'
import { Container, Row, Col, Badge, Card, Button } from 'react-bootstrap'
import StudentForm from './components/StudentForm'
import StudentMap from './components/StudentMap'
import StudentTable from './components/StudentTable'

const initialStudents = [
  {
    id: '1',
    firstname: 'Maria',
    lastname: 'Santos',
    course: 'BS Computer Science',
    email: 'maria.santos@student.edu',
    address: 'Sampaloc, Manila, Philippines',
    lat: 14.6062,
    lng: 120.9922,
    registeredAt: 'Aug 20, 2026',
  },
  {
    id: '2',
    firstname: 'Carlos',
    lastname: 'Reyes',
    course: 'BS Information Technology',
    email: 'carlos.reyes@student.edu',
    address: 'Diliman, Quezon City, Philippines',
    lat: 14.6549,
    lng: 121.0645,
    registeredAt: 'Aug 22, 2026',
  },
  {
    id: '3',
    firstname: 'Andrea',
    lastname: 'Cruz',
    course: 'BS Computer Engineering',
    email: 'andrea.cruz@student.edu',
    address: 'Cebu City, Philippines',
    lat: 10.3157,
    lng: 123.8854,
    registeredAt: 'Aug 24, 2026',
  },
]

export default function App() {
  const [students, setStudents] = useState(initialStudents)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [activeStudentId, setActiveStudentId] = useState(null)
  const [notification, setNotification] = useState(null)

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev])
    setSelectedLocation({
      coords: [newStudent.lat, newStudent.lng],
      zoom: 14,
    })
    setActiveStudentId(newStudent.id)
    setNotification({
      type: 'success',
      text: `Added ${newStudent.firstname} ${newStudent.lastname} to records.`,
    })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDeleteStudent = (studentId) => {
    const studentToDelete = students.find((s) => s.id === studentId)
    setStudents((prev) => prev.filter((s) => s.id !== studentId))
    if (activeStudentId === studentId) {
      setActiveStudentId(null)
    }
    setNotification({
      type: 'dark',
      text: studentToDelete
        ? `Deleted record for ${studentToDelete.firstname} ${studentToDelete.lastname}.`
        : 'Student record removed.',
    })
    setTimeout(() => setNotification(null), 3500)
  }

  const handleSelectStudent = (student) => {
    setSelectedLocation({
      coords: [student.lat, student.lng],
      zoom: 14,
    })
    setActiveStudentId(student.id)
  }

  const handleResetView = () => {
    if (students.length > 0) {
      setSelectedLocation({
        coords: [students[0].lat, students[0].lng],
        zoom: 11,
      })
    } else {
      setSelectedLocation({
        coords: [14.5995, 120.9842],
        zoom: 11,
      })
    }
    setActiveStudentId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-6 px-3 sm:px-6 lg:px-10">
      <Container fluid="xl" className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <header className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 heading-font mb-0">
                    Student Location Portal
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-0">
                  Interactive geographic student registry &amp; mapping directory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Registered:</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {students.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetView}
                className="text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs rounded-xl px-3.5 py-2 flex items-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Map
              </button>
            </div>
          </div>

          {notification && (
            <div className="mt-4 text-xs py-2.5 px-4 rounded-xl border border-indigo-100 bg-indigo-50/90 text-indigo-900 flex items-center justify-between shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{notification.text}</span>
              </div>
              <button
                className="text-indigo-400 hover:text-indigo-700 p-1 cursor-pointer font-bold"
                onClick={() => setNotification(null)}
              >
                ✕
              </button>
            </div>
          )}
        </header>

        {/* Form and Map Grid - Equal Height */}
        <Row className="g-4 align-items-stretch">
          <Col lg={5} className="d-flex flex-column">
            <StudentForm onAddStudent={handleAddStudent} />
          </Col>

          <Col lg={7} className="d-flex flex-column">
            <Card className="border border-slate-200/90 rounded-2xl shadow-xs bg-white overflow-hidden equal-height-card">
              <Card.Header className="bg-white border-b border-slate-100 py-3.5 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="font-bold text-sm text-slate-900 heading-font">
                    Interactive Map View
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {students.length} Pinned {students.length === 1 ? 'Location' : 'Locations'}
                </span>
              </Card.Header>
              <Card.Body className="p-3 flex-1 flex flex-col">
                <StudentMap
                  students={students}
                  selectedLocation={selectedLocation}
                  onDeleteStudent={handleDeleteStudent}
                  onSelectStudent={handleSelectStudent}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Directory Table */}
        <Row>
          <Col xs={12}>
            <StudentTable
              students={students}
              onDeleteStudent={handleDeleteStudent}
              onSelectStudent={handleSelectStudent}
              activeStudentId={activeStudentId}
            />
          </Col>
        </Row>
      </Container>

      <footer className="mt-10 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        <p className="mb-0 font-medium">
          Student Location &amp; Geo-Indexing Portal &bull; Clean Modern UI &bull; React + Leaflet
        </p>
      </footer>
    </div>
  )
}
