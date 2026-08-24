import { useState } from 'react'
import { Card, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'

export default function StudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    email: '',
    address: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const courses = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Information Systems',
    'BS Computer Engineering',
    'BS Software Engineering',
    'BS Data Science',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.firstname.trim()) {
      setError('First name is required.')
      return
    }
    if (!formData.lastname.trim()) {
      setError('Last name is required.')
      return
    }
    if (!formData.course) {
      setError('Please select a course.')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required.')
      return
    }
    if (!validateEmail(formData.email.trim())) {
      setError('Please provide a valid email address.')
      return
    }
    if (!formData.address.trim()) {
      setError('Address is required for map plotting.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.address.trim()
        )}`
      )
      const data = await response.json()

      if (!data || data.length === 0) {
        setError('Could not locate the provided address. Please enter a more specific location.')
        setLoading(false)
        return
      }

      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)

      const newStudent = {
        id: Date.now().toString(),
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        course: formData.course,
        email: formData.email.trim(),
        address: formData.address.trim(),
        lat,
        lng,
        displayName: data[0].display_name,
        registeredAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }

      onAddStudent(newStudent)
      setSuccess(`Student ${newStudent.firstname} ${newStudent.lastname} registered and mapped!`)
      setFormData({
        firstname: '',
        lastname: '',
        course: '',
        email: '',
        address: '',
      })
    } catch (err) {
      setError('Failed to geocode address. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-neutral-300 rounded-lg shadow-sm bg-white">
      <Card.Header className="bg-neutral-100 border-b border-neutral-200 py-3 px-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm uppercase tracking-wider text-neutral-800">
            [01] Register Student
          </span>
          <span className="text-xs text-neutral-500 font-mono">FORM_ENTRY</span>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="text-xs py-2 px-3 mb-3 border border-red-200">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="text-xs py-2 px-3 mb-3 border border-emerald-200">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6} className="mb-2 mb-md-0">
              <Form.Group controlId="firstname">
                <Form.Label className="text-xs uppercase font-bold text-neutral-700">
                  Firstname *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  placeholder="e.g. Juan"
                  value={formData.firstname}
                  onChange={handleChange}
                  size="sm"
                  className="rounded-md border-neutral-300 focus:border-neutral-800 text-xs"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastname">
                <Form.Label className="text-xs uppercase font-bold text-neutral-700">
                  Lastname *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  placeholder="e.g. Dela Cruz"
                  value={formData.lastname}
                  onChange={handleChange}
                  size="sm"
                  className="rounded-md border-neutral-300 focus:border-neutral-800 text-xs"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6} className="mb-2 mb-md-0">
              <Form.Group controlId="course">
                <Form.Label className="text-xs uppercase font-bold text-neutral-700">
                  Course *
                </Form.Label>
                <Form.Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  size="sm"
                  className="rounded-md border-neutral-300 focus:border-neutral-800 text-xs"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label className="text-xs uppercase font-bold text-neutral-700">
                  Email *
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="e.g. juan@student.edu"
                  value={formData.email}
                  onChange={handleChange}
                  size="sm"
                  className="rounded-md border-neutral-300 focus:border-neutral-800 text-xs"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="address" className="mb-4">
            <Form.Label className="text-xs uppercase font-bold text-neutral-700">
              Address / Location *
            </Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="e.g. Sampaloc, Manila or Cebu City"
              value={formData.address}
              onChange={handleChange}
              size="sm"
              className="rounded-md border-neutral-300 focus:border-neutral-800 text-xs"
            />
            <Form.Text className="text-[11px] text-neutral-500">
              Will be geocoded automatically via Leaflet & OpenStreetMap.
            </Form.Text>
          </Form.Group>

          <div className="flex gap-2 justify-end pt-2 border-t border-neutral-200">
            <Button
              variant="outline-secondary"
              size="sm"
              type="button"
              className="text-xs px-3"
              disabled={loading}
              onClick={() => {
                setFormData({
                  firstname: '',
                  lastname: '',
                  course: '',
                  email: '',
                  address: '',
                })
                setError('')
                setSuccess('')
              }}
            >
              Clear
            </Button>
            <Button
              variant="dark"
              size="sm"
              type="submit"
              className="text-xs px-4 bg-neutral-900 hover:bg-neutral-800 border-neutral-900"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                  Locating...
                </>
              ) : (
                '+ Submit & Locate'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}
