import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ConsumptionTableProps {
  title: string;
  consumptionKey: string;
  form: UseFormReturn<any>;
  unitOptions: string[];
}

export function ConsumptionTable({ title, consumptionKey, form, unitOptions }: ConsumptionTableProps) {
  const [rowAverages, setRowAverages] = useState<string[]>(Array(12).fill('0.00'))
  const [yearAverages, setYearAverages] = useState({
    year1: '0.00',
    year2: '0.00',
    year3: '0.00'
  })

  const calculateRowAverage = (year1: string, year2: string, year3: string) => {
    const values = [year1, year2, year3]
      .map(v => parseFloat(v || '0'))
      .filter(v => !isNaN(v))
    
    if (values.length === 0) return '0.00'
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
  }

  const calculateYearAverage = (yearData: string[]) => {
    const values = yearData
      .map(v => parseFloat(v || '0'))
      .filter(v => !isNaN(v))
    
    if (values.length === 0) return '0.00'
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
  }

  useEffect(() => {
    const updateAverages = () => {
      const monthlyData = form.getValues(`${consumptionKey}.monthly`)
      
      const newRowAverages = monthlyData.map(item => 
        calculateRowAverage(item.year1 || '0', item.year2 || '0', item.year3 || '0')
      )
      setRowAverages(newRowAverages)

      const year1Data = monthlyData.map(item => item.year1 || '0')
      const year2Data = monthlyData.map(item => item.year2 || '0')
      const year3Data = monthlyData.map(item => item.year3 || '0')

      setYearAverages({
        year1: calculateYearAverage(year1Data),
        year2: calculateYearAverage(year2Data),
        year3: calculateYearAverage(year3Data)
      })
    }

    updateAverages()
    const subscription = form.watch((value, { name, type }) => {
      if (name?.startsWith(consumptionKey)) {
        updateAverages()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, consumptionKey])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label>{title}</Label>
        <FormField
          control={form.control}
          name={`${consumptionKey}.unit`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mes</TableHead>
              <TableHead>Año 1</TableHead>
              <TableHead>Año 2</TableHead>
              <TableHead>Año 3</TableHead>
              <TableHead>Promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.getValues(`${consumptionKey}.monthly`).map((item, index) => (
              <TableRow key={item.month}>
                <TableCell>{item.month}</TableCell>
                {['year1', 'year2', 'year3'].map((year) => (
                  <TableCell key={year}>
                    <FormField
                      control={form.control}
                      name={`${consumptionKey}.monthly.${index}.${year}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.trigger(`${consumptionKey}.monthly`)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Input value={rowAverages[index]} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Promedio Anual</div>
        <Input value={yearAverages.year1} disabled />
        <Input value={yearAverages.year2} disabled />
        <Input value={yearAverages.year3} disabled />
      </div>
    </div>
  )
}

