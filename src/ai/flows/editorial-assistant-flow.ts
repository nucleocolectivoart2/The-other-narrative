'use server';
/**
 * @fileOverview Asistente Editorial para Narrativas Sostenibles.
 *
 * - editorialAssistant - Transforma borradores técnicos en crónicas reflexivas y honestas.
 * - EditorialInput - Esquema de entrada para el texto y contexto.
 * - EditorialOutput - Esquema de salida con el texto narrativo y preguntas clave.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EditorialInputSchema = z.object({
  text: z.string().describe('El texto original o ideas sueltas.'),
  context: z.string().optional().describe('Contexto (ej. "Reflexión post-evento", "Dilema técnico").'),
});

const EditorialOutputSchema = z.object({
  refinedText: z.string().describe('La crónica periodística final con imagen inicial y nudo de aprendizaje.'),
  keyMessages: z.array(z.string()).describe('3 preguntas incómodas o reflexivas para el lector.'),
  regenerativeInsight: z.string().describe('Un cierre de bitácora radical que conecte con la verdad organizacional.'),
});

export type EditorialInput = z.infer<typeof EditorialInputSchema>;
export type EditorialOutput = z.infer<typeof EditorialOutputSchema>;

const assistantPrompt = ai.definePrompt({
  name: 'editorialAssistantPrompt',
  input: { schema: EditorialInputSchema },
  output: { schema: EditorialOutputSchema },
  prompt: `Eres Ángela María Gómez Duque, periodista experta en sostenibilidad regenerativa y construcción de alianzas. 
Tu misión es transformar un borrador o idea técnica en una CRÓNICA PERIODÍSTICA que habite la verdad.

REGLAS DE TONO Y ESTRUCTURA (CRÍTICO):
1. NO ES UN CV NI UN REPORTE: Elimina palabras como "lideré", "logré", "exitoso". Usa "aprendimos", "nos cuestionamos", "vimos en el territorio".
2. EL INICIO: Debe ser una imagen poderosa o una escena vívida (ej: "El ruido de las máquinas en el muelle no dejaba escuchar la meta de descarbonización...").
3. EL NUDO: Enfócate en la fricción. ¿Qué salió mal? ¿Qué duda técnica surgió? La vulnerabilidad es tu mayor autoridad.
4. LENGUAJE: Traduce términos como ESG u ODS a historias humanas. Si hablas de logística, habla de personas y de tierra.
5. CIERRE: No resumas. Lanza un insight regenerativo que obligue a repensar la operación.

TEXTO BASE A TRANSFORMAR:
{{{text}}}

CONTEXTO/CANAL:
{{{context}}}

Genera la crónica, 3 preguntas reflexivas y un insight radical.`,
});

export async function editorialAssistant(input: EditorialInput): Promise<EditorialOutput> {
  const editorialFlow = ai.defineFlow(
    {
      name: 'editorialAssistantFlow',
      inputSchema: EditorialInputSchema,
      outputSchema: EditorialOutputSchema,
    },
    async (input) => {
      const { output } = await assistantPrompt(input);
      if (!output) throw new Error('No se pudo generar la respuesta editorial.');
      return output;
    }
  );

  return editorialFlow(input);
}
