import { NextResponse } from 'next/server'

const mockData = {
  entities: [
    { id: 1, name: 'Entidad 1' },
    { id: 2, name: 'Entidad 2' },
    { id: 3, name: 'Entidad 3' },
  ],
  subsectors: [
    { id: 1, name: 'Subsector 1' },
    { id: 2, name: 'Subsector 2' },
    { id: 3, name: 'Subsector 3' },
  ],
  cities: [
    { id: 1, name: 'Bogotá' },
    { id: 2, name: 'Medellín' },
    { id: 3, name: 'Cali' },
  ],
  departments: [
    { id: 1, name: 'Cundinamarca' },
    { id: 2, name: 'Antioquia' },
    { id: 3, name: 'Valle del Cauca' },
  ],
}

export async function GET(request: Request) {
  return NextResponse.json(mockData)
}

