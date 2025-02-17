import { request, RequestParam } from "obsidian";
import { pythonifyKeys } from "src/util";

export enum CohereModelType {
  Small = "small",
  Medium = "medium",
  Large = "large",
  XLarge = "xlarge",
}

export interface CohereSettings {
  modelType: CohereModelType;
  maxTokens: number;
  temperature: number;
  p: number;
  k: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stopSequences: string[];
}

export const defaultCohereSettings: CohereSettings = {
  modelType: CohereModelType.XLarge,
  maxTokens: 16,
  temperature: 1.0,
  p: 1.0,
  k: 0,
  presencePenalty: 0,
  frequencyPenalty: 0,
  stopSequences: [],
};

export const getCohereCompletion = async (
  apiKey: string,
  prompt: string,
  settings: CohereSettings
): Promise<string> => {
  const apiUrl = `https://api.cohere.ai/generate`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Cohere-Version": "2021-11-08",
  };
  const { modelType, ...params } = settings;
  let body = {
    prompt,
    model: modelType,
    ...pythonifyKeys(params),
    stop_sequences:
      settings.stopSequences.length > 0 ? settings.stopSequences : undefined,
  };
  const requestParam: RequestParam = {
    url: apiUrl,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
    headers,
  };
  const res: any = await request(requestParam)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((err) => {
      console.error(err);
    });
  return res?.generations?.[0]?.text ?? null;
};
