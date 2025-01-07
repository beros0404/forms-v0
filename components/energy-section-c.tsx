'use client'

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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import { useFormData } from './DataProvider';

const formSchema = z.object({
  periodoBase: z.string().optional(),
  energyTypes: z.object({
    electrical: z.boolean().optional().default(false),
    naturalGas: z.boolean().optional().default(false),
    diesel: z.boolean().optional().default(false),
    other: z.boolean().optional().default(false),
  }).optional(),
  modeloTipos: z.object({
    valorAbsoluto: z.boolean().optional().default(false),
    cocienteValores: z.boolean().optional().default(false),
    modeloEstadistico: z.boolean().optional().default(false),
  }).optional(),
  valorAbsolutoData: z.object({
    energiaElectrica: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    gasNatural: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    diesel: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    otroEnergetico: z.object({
      especificacion: z.string().optional(),
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
  }).optional(),
  cocienteValoresData: z.object({
    energiaElectrica: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variableCociente: z.string().optional(),
      otraEspecificacion: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    gasNatural: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variableCociente: z.string().optional(),
      otraEspecificacion: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    diesel: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variableCociente: z.string().optional(),
      otraEspecificacion: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
    otroEnergetico: z.object({
      especificacion: z.string().optional(),
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variableCociente: z.string().optional(),
      otraEspecificacion: z.string().optional(),
      desviacionEstandar: z.string().optional(),
    }).optional(),
  }).optional(),
  modeloEstadisticoData: z.object({
    energiaElectrica: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variablesModelo: z.string().optional(),
      otrasVariables: z.string().optional(),
      valorMaximo: z.string().optional(),
      valorMinimo: z.string().optional(),
      valorPromedio: z.string().optional(),
      desviacionEstandar: z.string().optional(),
      pValue: z.string().optional(),
      r2Modelo: z.string().optional(),
    }).optional(),
    gasNatural: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variablesModelo: z.string().optional(),
      otrasVariables: z.string().optional(),
      valorMaximo: z.string().optional(),
      valorMinimo: z.string().optional(),
      valorPromedio: z.string().optional(),
      desviacionEstandar: z.string().optional(),
      pValue: z.string().optional(),
      r2Modelo: z.string().optional(),
    }).optional(),
    diesel: z.object({
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variablesModelo: z.string().optional(),
      otrasVariables: z.string().optional(),
      valorMaximo: z.string().optional(),
      valorMinimo: z.string().optional(),
      valorPromedio: z.string().optional(),
      desviacionEstandar: z.string().optional(),
      pValue: z.string().optional(),
      r2Modelo: z.string().optional(),
    }).optional(),
    otroEnergetico: z.object({
      especificacion: z.string().optional(),
      consumoMensual: z.string().optional(),
      unidadMedida: z.string().optional(),
      variablesModelo: z.string().optional(),
      otrasVariables: z.string().optional(),
      valorMaximo: z.string().optional(),
      valorMinimo: z.string().optional(),
      valorPromedio: z.string().optional(),
      desviacionEstandar: z.string().optional(),
      pValue: z.string().optional(),
      r2Modelo: z.string().optional(),
    }).optional(),
  }).optional(),
  indicadores: z.object({
    energiaTotal: z.object({
      superficie: z.string().optional(),
      superficieUnidad: z.string().optional(),
      trabajador: z.string().optional(),
      trabajadorUnidad: z.string().optional(),
    }).optional(),
    energiaElectrica: z.object({
      superficie: z.string().optional(),
      superficieUnidad: z.string().optional(),
      trabajador: z.string().optional(),
      trabajadorUnidad: z.string().optional(),
    }).optional(),
    hidrocarburos: z.object({
      superficie: z.string().optional(),
      superficieUnidad: z.string().optional(),
      trabajador: z.string().optional(),
      trabajadorUnidad: z.string().optional(),
    }).optional(),
    renovables: z.object({
      superficie: z.string().optional(),
      superficieUnidad: z.string().optional(),
      trabajador: z.string().optional(),
      trabajadorUnidad: z.string().optional(),
    }).optional(),
    otros: z.array(
      z.object({
        nombre: z.string().optional(),
        valor: z.string().optional(),
        unidad: z.string().optional(),
      })
    ).optional(),
  }).optional(),
}).optional();



type FormData = z.infer<typeof formSchema>

const unitsOptions = [
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
const variabilityUsed = [
  'Cantidad usuarios/mes',
'Cantidad trabajadores/mes',
'Cantidad estudiantes/mes',
'Grados día de temperatura',
'm2 ocupados',
'Otra'
]
export function EnergySectionC() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      energyTypes: {
        electrical: false,
        naturalGas: false,
        diesel: false,
        other: false,
      },
      modeloTipos: {
        valorAbsoluto: false,
        cocienteValores: false,
        modeloEstadistico: false,
      },
    },
  });

  const { setFormData } = useFormData();

  const onSubmit = async (values: FormData) => {
    try {
      // Log the form values
      console.log('Section C Form Values:', values);

      // Prepare the data for Supabase
      const dataToSubmit = {
        periodo_base: values.periodoBase,
        energy_types: values.energyTypes,
        modelo_tipos: values.modeloTipos,
        valor_absoluto_data: values.valorAbsolutoData,
        cociente_valores_data: values.cocienteValoresData,
        modelo_estadistico_data: values.modeloEstadisticoData,
        indicadores: values.indicadores
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('sectionC')
        .insert([dataToSubmit]);

      if (error) {
        console.error('Error submitting to Supabase:', error);
        throw error;
      }

      console.log('Successfully submitted to Supabase:', data);
      
      // Update form context and navigate
      setFormData(prevData => ({ ...prevData, sectionC: values }));
      router.push('/section-d');
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
          Sección C. Línea base e indicadores de desempeño energético
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="periodoBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodo base</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Energy Types Checkboxes */}
              <div className="space-y-4">
                <h3 className="font-medium">Tipos de energía</h3>
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
                  </div>
                </div>
              </div>
            {/* Model Types Checkboxes */}
            <div className="space-y-4">
                <h3 className="font-medium">Modelo de estimación</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="valorAbsoluto"
                      checked={form.watch('modeloTipos.valorAbsoluto')}
                      onCheckedChange={(checked) =>
                        form.setValue('modeloTipos.valorAbsoluto', checked as boolean)
                      }
                    />
                    <Label htmlFor="valorAbsoluto">Valor absoluto de energía</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cocienteValores"
                      checked={form.watch('modeloTipos.cocienteValores')}
                      onCheckedChange={(checked) =>
                        form.setValue('modeloTipos.cocienteValores', checked as boolean)
                      }
                    />
                    <Label htmlFor="cocienteValores">Cociente de los valores medidos o relación simple</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modeloEstadistico"
                      checked={form.watch('modeloTipos.modeloEstadistico')}
                      onCheckedChange={(checked) =>
                        form.setValue('modeloTipos.modeloEstadistico', checked as boolean)
                      }
                    />
                    <Label htmlFor="modeloEstadistico">Modelo estadístico</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Sections based on both Energy Type and Model Type */}
            {form.watch('modeloTipos.valorAbsoluto') && (
              <div className="space-y-6 border p-4 rounded-lg">
                <h3 className="font-medium bg-green-100 p-2">
                  Valor absoluto de energía
                </h3>

                {form.watch('energyTypes.electrical') && (
                  <div className="space-y-4">
                  
                    {/* Energía eléctrica */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Energía eléctrica</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                  </div>
                )}

                {form.watch('energyTypes.naturalGas') && (
                  <div className="space-y-4">
                    {/* Gas natural */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Gas natural</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.gasNatural.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.gasNatural.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                  </div>
                )}

                {form.watch('energyTypes.diesel') && (
                  <div className="space-y-4">
                    {/* Diésel */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Diésel</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.diesel.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                  control={form.control}
                  name="valorAbsolutoData.energiaElectrica.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.diesel.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                  </div>
                )}

                {form.watch('energyTypes.other') && (
                  <div className="space-y-4">
                    {/* Otro energético */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Otro energético</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.otroEnergetico.especificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especificar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.otroEnergetico.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.otroEnergetico.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
                )}
              </div>
            )}

            {form.watch('modeloTipos.cocienteValores') && (
              <div className="space-y-6 border p-4 rounded-lg">
                <h3 className="font-medium bg-green-100 p-2">
                  Cociente de los valores medidos o relación simple
                </h3>

                {form.watch('energyTypes.electrical') && (
                  <div className="space-y-4">
                    {/* Energía eléctrica */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Energía eléctrica</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.energiaElectrica.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
  control={form.control}
  name="cocienteValoresData.energiaElectrica.variableCociente"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Variable utilizada para determinar el cociente</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la variable" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {variabilityUsed.map((variable) => (
            <SelectItem key={variable} value={variable}>
              {variable}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.energiaElectrica.otraEspecificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si otra, especifique:</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.energiaElectrica.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                  </div>
                )}

                {form.watch('energyTypes.naturalGas') && (
                  <div className="space-y-4">
                    {/* Gas natural */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Gas natural</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.gasNatural.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
  control={form.control}
  name="cocienteValoresData.gasNatural.variableCociente"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Variable utilizada para determinar el cociente</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la variable" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {variabilityUsed.map((variable) => (
            <SelectItem key={variable} value={variable}>
              {variable}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.gasNatural.otraEspecificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si otra, especifique:</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.gasNatural.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                  </div>
                )}

                {form.watch('energyTypes.diesel') && (
                  <div className="space-y-4">
                    {/* Diésel */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Diésel</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.diesel.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="valorAbsolutoData.energiaElectrica.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
  control={form.control}
  name="cocienteValoresData.diesel.variableCociente"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Variable utilizada para determinar el cociente</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la variable" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {variabilityUsed.map((variable) => (
            <SelectItem key={variable} value={variable}>
              {variable}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.diesel.otraEspecificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si otra, especifique:</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.diesel.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                  </div>
                )}

                {form.watch('energyTypes.other') && (
                  <div className="space-y-4">
                    {/* Otro energético */}
                <div className="space-y-4">
                  <h4 className="font-medium bg-blue-100 p-2">Otro energético</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.otroEnergetico.especificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especificar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.otroEnergetico.consumoMensual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      )}
                    />

                    <FormField
  control={form.control}
  name="cocienteValoresData.otroEnergetico.variableCociente"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Variable utilizada para determinar el cociente</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la variable" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {variabilityUsed.map((variable) => (
            <SelectItem key={variable} value={variable}>
              {variable}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.otroEnergetico.otraEspecificacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si otra, especifique:</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cocienteValoresData.otroEnergetico.desviacionEstandar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor de la desviación estándar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                  </div>
                )}
              </div>
            )}

            {form.watch('modeloTipos.modeloEstadistico') && (
              <div className="space-y-6 border p-4 rounded-lg">
                <h3 className="font-medium bg-green-100 p-2">
                  Modelo estadístico
                </h3>

                {form.watch('energyTypes.electrical') && (
                  <div className="space-y-4">
                    <h4 className="font-medium bg-blue-100 p-2">Energía eléctrica</h4>
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.energiaElectrica.consumoMensual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indicar unidad de medida</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una unidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {unitsOptions.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.energiaElectrica.variablesModelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variables utilizadas en el modelo estadístico</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.energiaElectrica.otrasVariables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Si otras, especifique:</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h5 className="font-medium">Valores de los datos utilizados y el modelo</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.energiaElectrica.valorMaximo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Máximo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.energiaElectrica.valorMinimo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Mínimo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.energiaElectrica.valorPromedio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Promedio</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.energiaElectrica.desviacionEstandar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desviación Estándar</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="modeloEstadisticoData.energiaElectrica.r2Modelo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>R² del modelo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.naturalGas') && (
                  <div className="space-y-4">
                    <h4 className="font-medium bg-blue-100 p-2">Gas natural</h4>
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.gasNatural.consumoMensual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indicar unidad de medida</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una unidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {unitsOptions.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.gasNatural.variablesModelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variables utilizadas en el modelo estadístico</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.gasNatural.otrasVariables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Si otras, especifique:</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h5 className="font-medium">Valores de los datos utilizados y el modelo</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.gasNatural.valorMaximo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Máximo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.gasNatural.valorMinimo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Mínimo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.gasNatural.valorPromedio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Promedio</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.gasNatural.desviacionEstandar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desviación Estándar</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="modeloEstadisticoData.gasNatural.r2Modelo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>R² del modelo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.diesel') && (
                  <div className="space-y-4">
                    <h4 className="font-medium bg-blue-100 p-2">Diésel</h4>
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.diesel.consumoMensual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indicar unidad de medida</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una unidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {unitsOptions.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.diesel.variablesModelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variables utilizadas en el modelo estadístico</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.diesel.otrasVariables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Si otras, especifique:</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h5 className="font-medium">Valores de los datos utilizados y el modelo</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.diesel.valorMaximo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Máximo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.diesel.valorMinimo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Mínimo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.diesel.valorPromedio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Promedio</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.diesel.desviacionEstandar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desviación Estándar</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="modeloEstadisticoData.diesel.r2Modelo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>R² del modelo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.watch('energyTypes.other') && (
                  <div className="space-y-4">
                    <h4 className="font-medium bg-blue-100 p-2">Otro energético</h4>
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.otroEnergetico.especificacion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especificar</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.otroEnergetico.consumoMensual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor del consumo mensual de energía de la LBEn en el periodo base</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                      control={form.control}
                      name="valorAbsolutoData.energiaElectrica.unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indicar unidad de medida</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una unidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {unitsOptions.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.otroEnergetico.variablesModelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variables utilizadas en el modelo estadístico</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="modeloEstadisticoData.otroEnergetico.otrasVariables"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Si otras, especifique:</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h5 className="font-medium">Valores de los datos utilizados y el modelo</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.otroEnergetico.valorMaximo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Máximo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.otroEnergetico.valorMinimo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Mínimo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.otroEnergetico.valorPromedio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Promedio</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="modeloEstadisticoData.otroEnergetico.desviacionEstandar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desviación Estándar</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="modeloEstadisticoData.otroEnergetico.r2Modelo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>R² del modelo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


              

            {/* Indicadores de desempeño energético */}
            <div className="space-y-6 border p-4 rounded-lg">
              <h3 className="font-medium bg-orange-100 p-2">Indicadores de desempeño energético</h3>
              
              <div className="grid gap-6">
                {/* Energía total */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.energiaTotal.superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de energía total/superficie</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.energiaTotal.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.energiaTotal.trabajador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de energía total/trabajador</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.energiaTotalTrabajador.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  </div>
                </div>

              </div>
              <div className="grid gap-6">
                {/* Energía total */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.energiaElectrica.superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de energía Electrica/superficie</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.energiaElectrica.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.energiaElectrica.trabajador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de energía Electrica/trabajador</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.energiaElectricaTrabajador.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  </div>
                </div>

              </div>
              <div className="grid gap-6">
                {/* Energía total */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.Hidrocarburos.superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de Hidrocarburos/superficie</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.Hidrocarburos.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.Hidrocarburos.trabajador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de Hidrocarburos/trabajador</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.HidrocarburosTrabajador.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  </div>
                </div>

              </div>
              <div className="grid gap-6">
                {/* Energía total */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.Renovables.superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de Renovables/superficie</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.Renovables.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="indicadores.Renovables.trabajador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo anual de Renovables/trabajador</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="valorAbsolutoData.RenovablesTrabajador.unidadMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicar unidad de medida</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitsOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  </div>
                </div>

              </div>


              {/* Otros indicadores */}
              <div className="space-y-4">
                <h4 className="font-medium">Otros identificadores de desempeño energético</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`indicadores.otros.${index}.nombre`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Nombre del indicador" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`indicadores.otros.${index}.valor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Valor" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                    control={form.control}
                    name="valorAbsolutoData.otros.unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicar unidad de medida</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue="">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitsOptions.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Enviar formulario
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

