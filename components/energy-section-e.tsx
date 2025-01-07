'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { useFormData } from './DataProvider'

const savingOpportunitySchema = z.object({
  measureType: z.string().optional(),
  otherSpecification: z.string().optional(),
  measureDescription: z.string().optional(),
  estimatedSavings: z.object({
    value: z.string().optional(),
    unit: z.string().optional(),
    percentage: z.string().optional(),
  }),
  costAndFinancing: z.object({
    implementationCost: z.string().optional(),
    hasFinancingMechanism: z.enum(['yes', 'no']).optional(),
    financingMechanism: z.string().optional(),
  }),
  file: z.instanceof(File).optional(),
  fileBucketUrl: z.string().optional(),
})

const formSchema = z.object({
  opportunities: z.array(savingOpportunitySchema).optional()
})

const measureTypes = [
  'Buenas prácticas operativas',
  'Medidas pasivas',
  'Reconversión tecnológica',
  'Sustitución de combustibles',
  'Implementación fuentes renovables de energía',
  'Otra'
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

const financingTypes = [
  'Recursos propios',
  'Operaciones de crédito público (leasing y crédito proveedor)',
  'Contratos por servicios (renting, arrendamiento).',
  'Alianzas público-privadas (APP)',
  'Contrato por desempeño energético',
  'Otra'
]

type FormData = z.infer<typeof formSchema>

export function EnergySectionE() {
  const [opportunities, setOpportunities] = useState([0])
  const [thankYouMessage, setThankYouMessage] = useState(false)
  const { setFormData } = useFormData()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunities: [
        {
          measureType: '',
          otherSpecification: '',
          measureDescription: '',
          estimatedSavings: {
            value: '',
            unit: '',
            percentage: '',
          },
          costAndFinancing: {
            implementationCost: '',
            hasFinancingMechanism: 'no',
            financingMechanism: '',
          },
          fileBucketUrl: '',
        },
      ],
    },
  })

  const addOpportunity = () => {
    setOpportunities([...opportunities, opportunities.length])
    form.setValue(`opportunities.${opportunities.length}`, {
      measureType: '',
      otherSpecification: '',
      measureDescription: '',
      estimatedSavings: {
        value: '',
        unit: '',
        percentage: '',
      },
      costAndFinancing: {
        implementationCost: '',
        hasFinancingMechanism: 'no',
        financingMechanism: '',
      },
      fileBucketUrl: '',
    })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Log the form values
      console.log('Section E Form Values:', values);

      // Map the opportunities to match the database structure
      const dataToSubmit = values.opportunities?.map(opp => ({
        measureType: opp.measureType,
        otherSpecification: opp.otherSpecification,
        measureDescription: opp.measureDescription,
        file: opp.fileBucketUrl,
        estimatedSavings: opp.estimatedSavings,
        costAndFinancing: opp.costAndFinancing,
        opportunities: opp
      })) || [];

      // Submit to Supabase
      const { data, error } = await supabase
        .from('sectionE')
        .insert(dataToSubmit);

      if (error) {
        console.error('Error submitting to Supabase:', error);
        throw error;
      }

      console.log('Successfully submitted to Supabase:', data);
      
      // Show success message
      setThankYouMessage(true);

      // Reset form
      form.reset();

      // Hide message after 3 seconds
      setTimeout(() => {
        setThankYouMessage(false);
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error al guardar los datos. Por favor intente nuevamente.');
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Reporte de las medidas implementadas, derivadas de las auditorias energéticas
        </CardTitle>
        <div className="text-center text-lg font-semibold">
          Sección E. Oportunidades de ahorro energético implementadas
        </div>
      </CardHeader>
      <CardContent>
        {thankYouMessage && (
          <div className="text-center text-green-500 font-semibold mt-4">
            ¡Gracias por responder!
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <p>Para cada oportunidad de ahorro implementada, desde el último periodo de reporte de la información, detalle lo siguiente:</p>

              {opportunities.map((index) => (
                <div key={index} className="border p-6 rounded-lg space-y-6">
                  <h3 className="font-medium text-lg">Oportunidad de ahorro No. {index + 1}</h3>

                  <FormField
                    control={form.control}
                    name={`opportunities.${index}.measureType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de medida</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tipo de medida" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {measureTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch(`opportunities.${index}.measureType`) === 'Otra' && (
                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.otherSpecification`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si otra, especificar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name={`opportunities.${index}.measureDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción de la medida identificada</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Ahorro mensual de energía estimado, producto de la implementación de la oportunidad de ahorro
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`opportunities.${index}.estimatedSavings.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`opportunities.${index}.estimatedSavings.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Indicar unidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una unidad" />
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

                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.estimatedSavings.percentage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentaje (%) de ahorro</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Costo y financiamiento</h4>
                    
                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.costAndFinancing.implementationCost`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo estimado de la implementación de la medida (COP$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.file`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adjuntar archivo PDF</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`opportunities.${index}.costAndFinancing.hasFinancingMechanism`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>¿Cuenta con mecanismo de financiamiento?</FormLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="flex items-center space-x-4">
                              <RadioGroupItem value="yes" id={`hasFinancingMechanismYes${index}`} />
                              <label htmlFor={`hasFinancingMechanismYes${index}`}>Sí</label>
                              <RadioGroupItem value="no" id={`hasFinancingMechanismNo${index}`} />
                              <label htmlFor={`hasFinancingMechanismNo${index}`}>No</label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`opportunities.${index}.costAndFinancing.hasFinancingMechanism`) === 'yes' && (
                      <FormField
                        control={form.control}
                        name={`opportunities.${index}.costAndFinancing.financingMechanism`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especificar el mecanismo de financiamiento</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={addOpportunity}>
                Añadir otra oportunidad
              </Button>
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

