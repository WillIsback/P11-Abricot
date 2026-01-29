import { Document, Settings, VectorStoreIndex } from "llamaindex";
import { MistralAI, MistralAIEmbedding } from "@llamaindex/mistral";
import { sanitizeUserPrompt } from "@/lib/utils";
import { Task as TaskSchema } from "@/schemas/backend.schemas";
import { withTimeout, checkRateLimit } from "@/lib/server.lib";
import * as z from "zod";




const MISTRAL_API_KEY = process.env["MISTRAL_API_KEY"] ?? "";


Settings.llm = new MistralAI({
  model: "mistral-tiny",
  apiKey: MISTRAL_API_KEY,
});


Settings.embedModel = new MistralAIEmbedding({
  apiKey: MISTRAL_API_KEY,
});

type Task = z.infer<typeof TaskSchema>;

const CreateTasksZodSchema = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.iso.date()
  })),
});




type ServiceResult<T> = {
  ok: boolean;
  status: number;
  message: string;
  data: T;
};

type ServiceError = {
  ok: false;
  status: number;
  message: string;
  data: null;
};

type ServiceResponse<T> = ServiceResult<T> | ServiceError;

const createError = (status: number, message: string): ServiceError => ({
  ok: false,
  status,
  message,
  data: null,
});

export const MistralService = {
  async generateTasks(
    existingTasks: Task[],
    query: string,
    token: string
  ): Promise<ServiceResponse<z.infer<typeof CreateTasksZodSchema>>> {

    if (!checkRateLimit(token, 500, 1)) {
      console.error("Rate Limit reached");
      return createError(429, "Rate Limit reached");
    }
    
    try {
      const cleanedQuery = sanitizeUserPrompt(query);

      const documents = existingTasks.map(
        (task) =>
          new Document({
            text: JSON.stringify(task),
            id_: task.id,
            metadata: {
              title: task.title,
              status: task.status,
              projectId: task.projectId,
              type: "task",
            },
          })
      );

      const index = await VectorStoreIndex.fromDocuments(documents);

      const retriever = index.asRetriever();
      const queryEngine = index.asQueryEngine({ retriever });
      const prompt = generatePrompt(cleanedQuery);
      const queryResponse = await withTimeout(
        queryEngine.query({ query: prompt }),
        100000
      );
 
      // Extract JSON from the response (LLM might include extra text)
      const responseText = queryResponse.toString()
      
      
      console.log("Raw queryResponse :",responseText)
      const responseObject = JSON.parse(responseText)
      console.log("responseObject :",responseText)
      const parsed = CreateTasksZodSchema.safeParse(responseObject);

      if (!parsed.success) {
        console.error("Invalid AI output:", parsed.error);
        return createError(422, "Invalid AI response format");
      }

      return {
        ok: true,
        status: 200,
        message: "Tasks generated successfully",
        data: parsed.data,
      };
    } catch (error) {
      console.error("Error generating tasks:", error);
      return createError(500, "Failed to generate tasks");
    }
  },
};


const generatePrompt = (query: string) => `
You are a helpful AI assistant specialized in project management task generation.

Context information is below:
---------------------
{context}
---------------------

Given the context information and similar tasks, generate new relevant tasks for the project in JSON format.

User query: ${query}

IMPORTANT: 
1. Analyze the existing tasks to understand the project context
2. Generate 3-5 new relevant tasks based on the user query
3. Return your response in JSON format:

response assistant: {
  tasks: [{
    title: 'task1',
    description: 'description',
    dueDate: '2026-03-25',
  },
  {
    title: 'task2',
    description: 'description de la task2',
    dueDate: '2026-06-30'
  }
  
  ]
}


`;