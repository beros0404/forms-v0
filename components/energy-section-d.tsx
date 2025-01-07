'use client'

import { useState } from 'react'
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
import { useFormData } from './DataProvider';
import { useRouter } from 'next/navigation';

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

export function EnergySectionD() {
  const [opportunities, setOpportunities] = useState([0])
  const { setFormData } = useFormData();
  const router = useRouter();

  const form = useForm<FormData>({
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
    })
  }

  const onSubmit = (values: FormData) => {
    setFormData(prevData => ({ ...prevData, sectionD: values }));
    router.push('/section-e');
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Reporte de las medidas implementadas, derivadas de las auditorias energéticas
        </CardTitle>
        <div className="text-center text-lg font-semibold">
          Sección D. Oportunidades de ahorro energético identificadas
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <p>Para cada oportunidad de ahorro identificada, detalle la siguiente información:</p>

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
                      name={`opportunities.${index}.costAndFinancing.hasFinancingMechanism`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            ¿Ha identificado mecanismo(s) de financiamiento para implementar esta oportunidad?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Sí
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
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
                            <FormLabel>Tipo de mecanismos identificado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione el tipo de mecanismo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {financingTypes.map((type) => (
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
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addOpportunity}
                className="w-full"
              >
                Agregar oportunidad de ahorro
              </Button>
              <Button type="submit" className="w-full">
                Siguiente sección
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

