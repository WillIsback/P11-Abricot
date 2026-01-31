import { MistralAI, MistralAIEmbedding } from "@llamaindex/mistral";
import { format, addWeeks } from "date-fns";
import { Document, Settings, VectorStoreIndex } from "llamaindex";
import * as z from "zod";
import { checkRateLimit, withTimeout } from "@/lib/server.lib";
import { sanitizeUserPrompt } from "@/lib/utils";
import type { Task as TaskSchema } from "@/schemas/backend.schemas";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ?? "";

// Flag pour éviter la double initialisation
let isInitialized = false;

const initializeLlamaIndex = () => {
	if (isInitialized) return;
	
	Settings.llm = new MistralAI({
		model: "mistral-small-latest",
		apiKey: MISTRAL_API_KEY,
	});

	Settings.embedModel = new MistralAIEmbedding({
		apiKey: MISTRAL_API_KEY,
	});
	
	isInitialized = true;
};

type Task = z.infer<typeof TaskSchema>;

const CreateTasksZodSchema = z.object({
	tasks: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			dueDate: z.iso.date(),
		}),
	),
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
		token: string,
	): Promise<ServiceResponse<z.infer<typeof CreateTasksZodSchema>>> {
		// Initialiser LlamaIndex au premier appel
		initializeLlamaIndex();
		
		if (!checkRateLimit(token, 500, 1)) {
			console.error("Rate Limit reached");
			return createError(429, "Rate Limit reached");
		}

		try {
			const cleanedQuery = sanitizeUserPrompt(query);
			let responseText: string;

			// Si pas de tâches existantes, utiliser le LLM directement (pas de RAG)
			if (existingTasks.length === 0) {
				console.log("No existing tasks - using LLM directly without RAG");
				
				const llm = Settings.llm;
				const directPrompt = generateDirectPrompt(cleanedQuery);
				
				const llmResponse = await withTimeout(
					llm.complete({ prompt: directPrompt }),
					100000,
				);
				
				responseText = llmResponse.text || "";
				console.log("Direct LLM response:", responseText);
			} else {
				// Avec des tâches existantes, utiliser RAG
				const documents = existingTasks.map(
					(task) =>
						new Document({
							text: `Task: ${task.title}\nDescription: ${task.description}\nStatus: ${task.status}\nPriority: ${task.priority}`,
							id_: task.id,
							metadata: {
								title: task.title,
								status: task.status,
								projectId: task.projectId,
								type: "task",
							},
						}),
				);

				console.log("Documents created:", documents.length);

				const index = await VectorStoreIndex.fromDocuments(documents);
				const queryEngine = index.asQueryEngine();
				const prompt = generatePrompt(cleanedQuery);
				
				console.log("RAG Prompt:", prompt);
				
				const queryResponse = await withTimeout(
					queryEngine.query({ query: prompt }),
					100000,
				);

				responseText = queryResponse.toString() || "";
				console.log("RAG response:", responseText);
			}
			
			if (!responseText || responseText === "Empty Response") {
				return createError(500, "Le modèle n'a pas généré de réponse.");
			}

			// Extraire le JSON de la réponse (le LLM peut ajouter du texte autour)
			const jsonMatch = responseText.match(/\{[\s\S]*"tasks"[\s\S]*\}/);
			if (!jsonMatch) {
				console.error("No JSON found in response:", responseText);
				return createError(422, "Le modèle n'a pas retourné un format JSON valide.");
			}
	
			const responseObject = JSON.parse(jsonMatch[0]);
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

const generatePrompt = (query: string) => {
	const today = format(new Date(), "yyyy-MM-dd");
	const inOneMonth = format(addWeeks(new Date(), 4), "yyyy-MM-dd");
	
	return `
You are a helpful AI assistant specialized in project management task generation.

Today's date is: ${today}

Context information is below:
---------------------
{context}
---------------------

Given the context information and similar tasks, generate new relevant tasks for the project in JSON format.

User query: ${query}

IMPORTANT: 
1. Analyze the existing tasks to understand the project context
2. Generate 3-5 new relevant tasks based on the user query
3. All due dates must be in the future, between ${today} and ${inOneMonth}
4. Return ONLY valid JSON, no other text

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description",
      "dueDate": "yyyy-MM-dd"
    }
  ]
}
`;
};

const generateDirectPrompt = (query: string) => {
	const today = format(new Date(), "yyyy-MM-dd");
	const inOneMonth = format(addWeeks(new Date(), 4), "yyyy-MM-dd");
	
	return `
You are a helpful AI assistant specialized in project management task generation.

Today's date is: ${today}

The user wants to start a new project with the following description:
"${query}"

Generate 3-5 initial tasks to help them get started.

IMPORTANT:
1. All due dates must be in the future, between ${today} and ${inOneMonth}
2. Return ONLY valid JSON, no other text

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed task description",
      "dueDate": "yyyy-MM-dd"
    }
  ]
}
`;
};
