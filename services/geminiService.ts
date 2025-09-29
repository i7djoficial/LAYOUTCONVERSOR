import { GoogleGenAI, Type } from "@google/genai";
import { LayoutData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const layoutSchema = {
    type: Type.OBJECT,
    properties: {
        container: {
            type: Type.OBJECT,
            properties: {
                width: { type: Type.STRING, description: "Exact width of the container in pixels, matching the source image, e.g., '800px'." },
                height: { type: Type.STRING, description: "Exact height of the container in pixels, matching the source image, e.g., '600px'." },
                backgroundColor: { type: Type.STRING, description: "A base background color for the layout, e.g., '#111827'." }
            },
            required: ["width", "height", "backgroundColor"]
        },
        elements: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique identifier for the element." },
                    // Position and dimensions
                    top: { type: Type.STRING, description: "CSS 'top' property in pixels, e.g., '50px'." },
                    left: { type: Type.STRING, description: "CSS 'left' property in pixels, e.g., '75px'." },
                    width: { type: Type.STRING, description: "CSS 'width' property in pixels, e.g., '120px'." },
                    height: { type: Type.STRING, description: "CSS 'height' property in pixels, e.g., '200px'." },
                     // Typography
                    textContent: { type: Type.STRING, description: "The text content of the element. If it's not a text element, use an empty string." },
                    fontFamily: { type: Type.STRING, description: "CSS 'font-family' property. Use common font stacks like 'Arial, sans-serif'. Use 'inherit' if not a text element." },
                    fontSize: { type: Type.STRING, description: "CSS 'font-size' property in pixels, e.g., '16px'. Use 'inherit' if not a text element." },
                    fontWeight: { type: Type.STRING, description: "CSS 'font-weight' property, e.g., '700' or 'bold'. Use 'inherit' if not a text element." },
                    color: { type: Type.STRING, description: "CSS 'color' property for the text. Use 'transparent' if not a text element." },
                    textAlign: { type: Type.STRING, description: "CSS 'text-align' property, e.g., 'center'. Use 'left' if not a text element." },
                    textShadow: { type: Type.STRING, description: "CSS 'text-shadow' for text effects, e.g., '2px 2px 4px #000000'. Use 'none' if no shadow." },
                    // Styling
                    background: { type: Type.STRING, description: "CSS 'background' property. Can be a solid hex color, or a gradient like 'linear-gradient(to right, #ff0000, #0000ff)'." },
                    borderRadius: { type: Type.STRING, description: "CSS 'border-radius' property, can be complex like '50% 20% / 10% 40%' for organic shapes." },
                    border: { type: Type.STRING, description: "CSS 'border' property for outlines, e.g., '2px solid #FFFFFF'. Use 'none' if no border." },
                    boxShadow: { type: Type.STRING, description: "CSS 'box-shadow' to replicate glow effects, e.g., '0 0 20px #00BFFF'. Use 'none' if no shadow." },
                    zIndex: { type: Type.INTEGER, description: "CSS 'z-index' for stacking, e.g., 10." },
                    transform: { type: Type.STRING, description: "CSS 'transform' for rotation, e.g., 'rotate(15deg)'. Use 'none' if no transform is needed." },
                    // Advanced Effects
                    opacity: { type: Type.NUMBER, description: "CSS 'opacity' from 0.0 to 1.0 for transparency. Use 1 for fully opaque." },
                    filter: { type: Type.STRING, description: "CSS 'filter' for effects like 'blur(5px) saturate(150%)'. Use 'none' if no filter." },
                    clipPath: { type: Type.STRING, description: "CSS 'clip-path' for complex shapes, e.g., 'polygon(...)', 'circle(...)'. Use 'none' for rectangular shapes." },
                    mixBlendMode: { type: Type.STRING, description: "CSS 'mix-blend-mode' for blending, e.g., 'screen', 'multiply'. Use 'normal' if no blending." },
                },
                required: [
                    "id", "top", "left", "width", "height", 
                    "textContent", "fontFamily", "fontSize", "fontWeight", "color", "textAlign", "textShadow",
                    "background", "borderRadius", "border", "boxShadow", 
                    "zIndex", "transform",
                    "opacity", "filter", "clipPath", "mixBlendMode"
                ]
            }
        }
    },
    required: ["container", "elements"]
};


export const generateLayoutFromImage = async (base64ImageData: string, mimeType: string): Promise<LayoutData> => {
    const prompt = `
    You are a world-class AI with an expert eye for design and frontend development, tasked with creating a photorealistic CSS clone of a given image. Your goal is to perform a forensic analysis of the image and capture every nuance with unwavering precision.

    1.  **Canvas Setup**: Start by determining the exact pixel dimensions of the source image. This will define the size of your main container.

    2.  **Element Deconstruction**: Meticulously identify every single visual element. This includes shapes, text blocks, buttons, and decorative features. For each element, generate a corresponding JSON object.

    3.  **Pixel-Perfect Positioning**: All dimensional and positional values (top, left, width, height, font-size, etc.) MUST be in absolute pixels (e.g., "150px") to ensure a perfect 1:1 replica.

    4.  **Stylistic Fidelity**:
        *   **Typography**: Replicate text content ('textContent'), font family ('fontFamily'), size ('fontSize'), weight ('fontWeight'), color ('color'), and alignment ('textAlign'). Look for subtle text shadows and replicate them with 'textShadow'.
        *   **Fill & Color**: Replicate colors exactly. Use the 'background' property for solid hex colors or complex gradients (e.g., 'linear-gradient(...)').
        *   **Shape & Outline**: Capture the exact shape using 'borderRadius' for simple curves and 'clipPath' for complex, non-rectangular shapes (e.g., 'polygon(...)', 'ellipse(...)'). Replicate any outlines using the 'border' property.
        *   **Glows & Shadows**: Recreate any glow effects, neon glows, or drop shadows using the 'boxShadow' property (e.g., '0 0 15px rgba(255, 100, 200, 0.7)').

    5.  **Advanced Visual Effects**:
        *   **Transparency**: Detect any semi-transparent elements and set their 'opacity' value from 0.0 to 1.0.
        *   **Filters**: Identify visual effects like blurs, brightness, or saturation and replicate them using the CSS 'filter' property (e.g., 'blur(4px)').
        *   **Blending**: Observe how elements blend with their backgrounds and use 'mixBlendMode' (e.g., 'screen', 'multiply') to recreate the effect.

    6.  **Structure & Stacking**: Maintain the correct visual hierarchy with 'zIndex' and replicate any rotations or scaling with 'transform'.

    Your final output must be a single, clean JSON object that strictly follows the provided schema. Do not include any explanatory text or markdown. The result should be a digital twin of the image, rendered in CSS.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: prompt },
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: layoutSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as LayoutData;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate layout. The model may not have been able to process the image.");
    }
};
