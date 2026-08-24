import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Badge, Button } from 'react-bootstrap'

const markerSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23111827" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="%23ffffff"/></svg>`

const studentIcon = L.icon({
  iconUrl: markerSvg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}

export default function StudentMap({ students, selectedLocation, onDeleteStudent, onSelectStudent }) {
  const defaultCenter = [14.5995, 120.9842]

  return (
    <div className="w-full h-full min-h-[440px] rounded-lg overflow-hidden border border-neutral-300 relative bg-neutral-100 shadow-sm">
      <MapContainer
        center={selectedLocation?.coords || (students.length > 0 ? [students[0].lat, students[0].lng] : defaultCenter)}
        zoom={selectedLocation?.zoom || 11}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[440px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedLocation?.coords && (
          <MapController center={selectedLocation.coords} zoom={selectedLocation.zoom} />
        )}

        {students.map((student) => (
          <Marker
            key={student.id}
            position={[student.lat, student.lng]}
            icon={studentIcon}
            eventHandlers={{
              click: () => onSelectStudent && onSelectStudent(student),
            }}
          >
            <Popup className="custom-typewriter-popup">
              <div className="p-1 min-w-[200px] text-neutral-800">
                <div className="font-bold text-sm tracking-tight border-b border-neutral-200 pb-1 mb-1">
                  {student.firstname} {student.lastname}
                </div>
                <div className="mb-2">
                  <Badge bg="dark" className="text-xs font-normal">
                    {student.course}
                  </Badge>
                </div>
                <div className="text-xs space-y-1 mb-2 text-neutral-600">
                  <div><strong>Email:</strong> {student.email}</div>
                  <div><strong>Address:</strong> {student.address}</div>
                  <div><strong>Coords:</strong> {student.lat.toFixed(4)}, {student.lng.toFixed(4)}</div>
                </div>
                <div className="pt-1 border-t border-neutral-200 flex justify-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="text-xs py-0 px-2"
                    onClick={() => onDeleteStudent(student.id)}
                  >
                    Delete Record
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
