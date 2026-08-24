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
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-mono flex flex-col justify-between py-6 px-3 sm:px-6 lg:px-10">
      <Container fluid="xl" className="space-y-6">
        <header className="border-b border-neutral-300 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  STUDENT GEO-INDEXING SYSTEM
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                STUDENT LOCATION SYSTEM
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="border border-neutral-300 rounded px-3 py-1.5 bg-white shadow-xs text-xs flex items-center gap-2">
                <span className="text-neutral-500">Active Records:</span>
                <span className="font-bold text-neutral-900">{students.length}</span>
              </div>
              <Button
                variant="outline-dark"
                size="sm"
                className="text-xs border-neutral-400"
                onClick={handleResetView}
              >
                Reset Map
              </Button>
            </div>
          </div>

          {notification && (
            <div className="mt-3 text-xs py-1.5 px-3 rounded border border-neutral-300 bg-neutral-900 text-neutral-100 flex items-center justify-between animate-fade-in">
              <span>{notification.text}</span>
              <button
                className="text-neutral-400 hover:text-white"
                onClick={() => setNotification(null)}
              >
                ✕
              </button>
            </div>
          )}
        </header>

        <Row className="g-4">
          <Col lg={5} className="space-y-4">
            <StudentForm onAddStudent={handleAddStudent} />
          </Col>

          <Col lg={7}>
            <Card className="border border-neutral-300 rounded-lg shadow-sm bg-white h-full flex flex-col">
              <Card.Header className="bg-neutral-100 border-b border-neutral-200 py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-neutral-800">
                    [02] Geographic Location Map
                  </span>
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  Markers: {students.length}
                </div>
              </Card.Header>
              <Card.Body className="p-2 flex-1 flex flex-col">
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

      <footer className="mt-8 pt-4 border-t border-neutral-300 text-center text-xs text-neutral-500 font-mono">
        <p className="mb-0">
          Student Location System &bull; React + Leaflet + React-Bootstrap + Tailwind CSS
        </p>
      </footer>
    </div>
  )
}
