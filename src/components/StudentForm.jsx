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
    <Card className="border border-slate-200/90 rounded-2xl shadow-xs bg-white overflow-hidden equal-height-card">
      <Card.Header className="bg-white border-b border-slate-100 py-3.5 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="font-bold text-sm text-slate-900 heading-font">
            Register Student
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Geocoding enabled
        </span>
      </Card.Header>

      <Card.Body className="p-5 flex flex-col justify-between flex-1">
        <div>
          {error && (
            <Alert variant="danger" className="text-xs py-2.5 px-3.5 mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="text-xs py-2.5 px-3.5 mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{success}</span>
            </Alert>
          )}

          <Form id="student-entry-form" onSubmit={handleSubmit} className="space-y-4">
            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="firstname">
                  <Form.Label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    First Name <span className="text-rose-500">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    placeholder="e.g. Maria"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs py-2 px-3 shadow-2xs h-10"
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="lastname">
                  <Form.Label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    Last Name <span className="text-rose-500">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    placeholder="e.g. Santos"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs py-2 px-3 shadow-2xs h-10"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="course">
                  <Form.Label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    Course <span className="text-rose-500">*</span>
                  </Form.Label>
                  <Form.Select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs py-2 px-3 shadow-2xs text-slate-700 h-10"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="email">
                  <Form.Label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    Email Address <span className="text-rose-500">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="e.g. maria@student.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs py-2 px-3 shadow-2xs h-10"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="address">
              <Form.Label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                Address / City <span className="text-rose-500">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="e.g. Sampaloc, Manila or Cebu City"
                value={formData.address}
                onChange={handleChange}
                className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs py-2 px-3 shadow-2xs h-10"
              />
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Automatically pinpoints latitude &amp; longitude on OpenStreetMap</span>
              </div>
            </Form.Group>
          </Form>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
          <button
            type="button"
            className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2.5 transition-all cursor-pointer border-0"
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
            Clear Form
          </button>
          <button
            type="submit"
            form="student-entry-form"
            className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all cursor-pointer border-0 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                Plotting Location...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Save &amp; Pin Student
              </>
            )}
          </button>
        </div>
      </Card.Body>
    </Card>
  )
}
