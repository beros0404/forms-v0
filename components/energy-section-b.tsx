'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ConsumptionTable } from './consumption-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useFormData } from './DataProvider'
import { supabase } from '@/lib/supabase';


const formSchema = z.object({
  energyTypes: z.object({
    electrical: z.boolean().default(false),
    naturalGas: z.boolean().default(false),
    diesel: z.boolean().default(false),
    other: z.boolean().default(false),
  }),
  otherSpecification: z.string().optional(),
  electricalCosts: z.object({
    year1: z.string().optional(),
    year2: z.string().optional(),
    year3: z.string().optional(),
  }).optional(),
  naturalGasCosts: z.object({
    year1: z.string().optional(),
    year2: z.string().optional(),
    year3: z.string().optional(),
  }).optional(),
  dieselCosts: z.object({
    year1: z.string().optional(),
    year2: z.string().optional(),
    year3: z.string().optional(),
  }).optional(),
  otherCosts: z.object({
    year1: z.string().optional(),
    year2: z.string().optional(),
    year3: z.string().optional(),
  }).optional(),
  electricalConsumption: z.object({
    unit: z.string().optional(),
    monthly: z.array(z.object({
      month: z.string(),
      year1: z.string().optional(),
      year2: z.string().optional(),
      year3: z.string().optional(),
    })).optional(),
  }).optional(),
  gasConsumption: z.object({
    unit: z.string().optional(),
    monthly: z.array(z.object({
      month: z.string(),
      year1: z.string().optional(),
      year2: z.string().optional(),
      year3: z.string().optional(),
    })).optional(),
  }).optional(),
  dieselConsumption: z.object({
    unit: z.string().optional(),
    monthly: z.array(z.object({
      month: z.string(),
      year1: z.string().optional(),
      year2: z.string().optional(),
      year3: z.string().optional(),
    })).optional(),
  }).optional(),
  otherConsumption: z.object({
    unit: z.string().optional(),
    monthly: z.array(z.object({
      month: z.string(),
      year1: z.string().optional(),
      year2: z.string().optional(),
      year3: z.string().optional(),
    })).optional(),
  }).optional(),
})

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const unitOptions = [
  'kWh/mes',
  'm3/mes',
  'J/mes',
  'kcal/mes',
  'kg/mes',
  'lb/mes',
  'toneladas/mes',
  'galón/mes',
  'litro/mes'
]

export function EnergySectionB() {
  const router = useRouter()
  const { setFormData } = useFormData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      energyTypes: {
        electrical: false,
        naturalGas: false,
        diesel: false,
        other: false,
      },
      electricalConsumption: {
        unit: '',
        monthly: months.map(month => ({
          month,
          year1: '0',
          year2: '0',
          year3: '0',
        })),
      },
      gasConsumption: {
        unit: '',
        monthly: months.map(month => ({
          month,
          year1: '0',
          year2: '0',
          year3: '0',
        })),
      },
      dieselConsumption: {
        unit: '',
        monthly: months.map(month => ({
          month,
          year1: '0',
          year2: '0',
          year3: '0',
        })),
      },
      otherConsumption: {
        unit: '',
        monthly: months.map(month => ({
          month,
          year1: '0',
          year2: '0',
          year3: '0',
        })),
      },
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Log the form values
      console.log('Section B Form Values:', values);

      // Prepare the data for Supabase
      const dataToSubmit = {
        energy_types: values.energyTypes,
        electrical_costs: values.electricalCosts,
        natural_gas_costs: values.naturalGasCosts,
        diesel_costs: values.dieselCosts,
        other_costs: values.otherCosts,
        electrical_consumption: values.electricalConsumption,
        gas_consumption: values.gasConsumption,
        diesel_consumption: values.dieselConsumption,
        other_consumption: values.otherConsumption
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('sectionB')
        .insert([dataToSubmit]);

      if (error) {
        console.error('Error submitting to Supabase:', error);
        throw error;
      }

      console.log('Successfully submitted to Supabase:', data);
      
      // Update form context and navigate
      setFormData(prevData => ({ ...prevData, sectionB: values }));
      router.push('/section-c');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error al guardar los datos. Por favor intente nuevamente.');
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Sección B. Caracterización del uso de la energía
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-medium">Energéticos utilizados dentro de la edificación</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="electrical"
                      checked={form.watch('energyTypes.electrical')}
                      onCheckedChange={(checked) =>
                        form.setValue('energyTypes.electrical', checked as boolean)
                      }
                    />
                    <Label htmlFor="electrical">Energía eléctrica</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="naturalGas"
                      checked={form.watch('energyTypes.naturalGas')}
                      onCheckedChange={(checked) =>
                        form.setValue('energyTypes.naturalGas', checked as boolean)
                      }
                    />
                    <Label htmlFor="naturalGas">Gas natural</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diesel"
                      checked={form.watch('energyTypes.diesel')}
                      onCheckedChange={(checked) =>
                        form.setValue('energyTypes.diesel', checked as boolean)
                      }
                    />
                    <Label htmlFor="diesel">Diésel</Label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={form.watch('energyTypes.other')}
                        onCheckedChange={(checked) =>
                          form.setValue('energyTypes.other', checked as boolean)
                        }
                      />
                      <Label htmlFor="other">Otro</Label>
                    </div>
                    {form.watch('energyTypes.other') && (
                      <FormField
                        control={form.control}
                        name="otherSpecification"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Especifique" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Costos asociados al consumo energético anual (COP$)</h3>
              <p className="text-sm text-muted-foreground italic">
                En las etiquetas de Año 1, Año 2 y Año 3, indicar el año al cual corresponde la información
              </p>

              <div className="space-y-6">
                {form.watch('energyTypes.electrical') && (
                  <div className="space-y-2">
                    <Label>Energía eléctrica</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="electricalCosts.year1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="electricalCosts.year2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="electricalCosts.year3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.naturalGas') && (
                  <div className="space-y-2">
                    <Label>Gas natural</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="naturalGasCosts.year1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="naturalGasCosts.year2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="naturalGasCosts.year3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.diesel') && (
                  <div className="space-y-2">
                    <Label>Diésel</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="dieselCosts.year1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dieselCosts.year2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dieselCosts.year3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.other') && (
                  <div className="space-y-2">
                    <Label>Otro</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="otherCosts.year1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherCosts.year2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 2" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherCosts.year3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Año 3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Consumo histórico mensual por fuente de energía</h3>
              <p className="text-sm text-muted-foreground italic">
                En las etiquetas de Año 1, Año 2 y Año 3, indicar el año al cual corresponde la información
              </p>

              <div className="space-y-6">
                {form.watch('energyTypes.electrical') && (
                  <ConsumptionTable
                    title="Energía eléctrica"
                    consumptionKey="electricalConsumption"
                    form={form}
                    unitOptions={unitOptions}
                  />
                )}

                {form.watch('energyTypes.naturalGas') && (
                  <ConsumptionTable
                    title="Gas natural"
                    consumptionKey="gasConsumption"
                    form={form}
                    unitOptions={unitOptions}
                  />
                )}

                {form.watch('energyTypes.diesel') && (
                  <ConsumptionTable
                    title="Diésel"
                    consumptionKey="dieselConsumption"
                    form={form}
                    unitOptions={unitOptions}
                  />
                )}

                {form.watch('energyTypes.other') && (
                  <ConsumptionTable
                    title="Otro"
                    consumptionKey="otherConsumption"
                    form={form}
                    unitOptions={unitOptions}
                  />
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Siguiente sección
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

