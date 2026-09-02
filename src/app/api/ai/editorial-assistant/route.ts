import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { text, context } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'El texto es requerido para el refinamiento editorial.' },
        { status: 400 }
      );
    }

    const ai = getAiClient();
    
    // Fallback if no GEMINI_API_KEY is configured in development
    if (!ai) {
      const fallbackOutput = {
        refinedText: `En el territorio de la memoria y la acción colectiva: "${text.slice(0, 150)}..." Aprendimos que cada proceso regenerativo requiere escuchar el pulso de la comunidad antes de trazar cualquier ruta técnica.`,
        keyMessages: [
          '¿Cómo dialoga esta iniciativa con los ritmos vivos del ecosistema?',
          '¿Qué tensiones invisibles estamos pasando por alto al ejecutar la estrategia?',
          '¿De qué manera esta narrativa moviliza la inteligencia colectiva?'
        ],
        regenerativeInsight: 'La verdadera regeneración no reside en la métrica alcanzada, sino en la calidad de los vínculos y la honestidad con la que habitamos nuestras preguntas.'
      };
      return NextResponse.json(fallbackOutput);
    }

    const prompt = `Eres Ángela María Gómez Duque, periodista experta en narrativas regenerativas y construcción de alianzas para el ecosistema MEDULAR.
Tu misión es transformar un borrador o idea técnica en una CRÓNICA PERIODÍSTICA que habite la verdad y la sensibilidad humana.

REGLAS DE TONO Y ESTRUCTURA (CRÍTICO):
1. NO ES UN CV NI UN REPORTE: Elimina palabras como "lideré", "logré", "exitoso". Usa "aprendimos", "nos cuestionamos", "vimos en el territorio".
2. EL INICIO: Debe ser una imagen poderosa o una escena vívida (ej: "El ruido de las máquinas en el muelle no dejaba escuchar la meta de descarbonización...").
3. EL NUDO: Enfócate en la fricción. ¿Qué salió mal? ¿Qué duda técnica o humana surgió? La vulnerabilidad es tu mayor autoridad.
4. LENGUAJE: Traduce términos como ESG u ODS a historias humanas. Si hablas de logística, habla de personas, raíces y tierra.
5. CIERRE: No resumas. Lanza un insight regenerativo que obligue a repensar la operación.

TEXTO BASE A TRANSFORMAR:
${text}

CONTEXTO/CANAL:
${context || 'Bitácora editorial MEDULAR'}

Devuelve un objeto JSON con:
- refinedText: La crónica periodística final con imagen inicial y nudo de aprendizaje.
- keyMessages: Un arreglo de exactamente 3 preguntas incómodas o reflexivas para el lector.
- regenerativeInsight: Un cierre de bitácora radical y poético que conecte con la verdad organizacional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedText: {
              type: Type.STRING,
              description: 'La crónica periodística final con imagen inicial y nudo de aprendizaje.',
            },
            keyMessages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 preguntas incómodas o reflexivas para el lector.',
            },
            regenerativeInsight: {
              type: Type.STRING,
              description: 'Un cierre de bitácora radical que conecte con la verdad organizacional.',
            },
          },
          required: ['refinedText', 'keyMessages', 'regenerativeInsight'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Respuesta vacía de la IA');
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in editorial-assistant API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar el texto con la IA' },
      { status: 500 }
    );
  }
}
