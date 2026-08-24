import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Badge, Button } from 'react-bootstrap'

const markerSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="%234f46e5" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="%23ffffff"/></svg>`

const studentIcon = L.icon({
  iconUrl: markerSvg,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -36],
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
    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200/60 shadow-2xs flex-1 flex flex-col">
      <MapContainer
        center={selectedLocation?.coords || (students.length > 0 ? [students[0].lat, students[0].lng] : defaultCenter)}
        zoom={selectedLocation?.zoom || 11}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[420px] flex-1"
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
            <Popup className="custom-modern-popup">
              <div className="p-2.5 min-w-[220px] text-slate-800">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {student.firstname[0]}{student.lastname[0]}
                  </div>
                  <div>
                    <h6 className="font-bold text-sm text-slate-900 mb-0 heading-font">
                      {student.firstname} {student.lastname}
                    </h6>
                    <span className="inline-block text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mt-0.5">
                      {student.course}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 my-2.5 border-t border-b border-slate-100 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Email:</span>
                    <span className="text-slate-700 truncate max-w-[150px]">{student.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium">Address:</span>
                    <span className="text-slate-700 leading-tight">{student.address}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className="text-[11px] font-medium py-1 px-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                    onClick={() => onDeleteStudent(student.id)}
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
