import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import fs from "fs";

const openai = new OpenAI();

const Class = z.object({
  className: z.string(),
  classStartTime: z.string(),
  classEndTime: z.string(),
  Building: z.string(),
  professorName: z.string(),
});

const ClassSchedule = z.object({
  name: z.string(),
  classes: z.array(Class),
});


export async function imgToJSON(imagePath: string) {

const base64Image = fs.readFileSync(imagePath, "base64");

    const response = await openai.responses.parse({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    { type: "input_text", text: "what's in this image?" },
                    {
                        type: "input_image",
                        image_url: `data:image/jpeg;base64,${base64Image}`,
                        detail: "high"
                    },
                ],
            },
        ],
        text: {
            format: zodTextFormat(ClassSchedule, "classSchedule"),
          },
    });
  
    return response.output_parsed;
}