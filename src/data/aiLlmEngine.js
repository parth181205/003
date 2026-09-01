import { generateDynamicNeuralResponse } from './aiNeuralGenerator';

export const generateUniversalAIResponse = (userQuery, patientData) => {
  return generateDynamicNeuralResponse(userQuery, patientData);
};

export const generateConversationalLLMResponse = (userQuery, patientData) => {
  return generateDynamicNeuralResponse(userQuery, patientData);
};
