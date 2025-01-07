import { supabase } from '@/utils/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { table, data } = req.body
    try {
      const { error } = await supabase.from(table).insert(data)
      if (error) throw error
      res.status(200).json({ message: 'Datos guardados con éxito' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Método ${req.method} no permitido`)
  }
}
