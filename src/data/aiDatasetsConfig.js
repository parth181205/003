export const AI_MODEL_SPECS = {
  modelName: "Smriti-IndicDementiaNet v2.4 (Hybrid RL-Transformer)",
  architecture: "On-Device Lightweight Quantized Transformer + Reinforcement Learning (Multi-Armed Bandit) + IndicWhisper / IndicBERT STT",
  framework: "PyTorch Mobile / ONNX Runtime Web (On-Device Local Inference)",
  voiceSynthesizer: "IndicTTS Speech Synthesis Engine (MeitY Bhashini Framework)",
  
  // Datasets used for Training & Benchmarking
  trainingDatasets: [
    {
      name: "ADNI (Alzheimer's Disease Neuroimaging Initiative)",
      domain: "Clinical Cognitive Progression",
      samples: "12,500+ longitudinal dementia patient sessions",
      purpose: "Calibrating real-time Cognitive Stability Index (CSS), reaction time decay, and hesitation spike thresholds."
    },
    {
      name: "OASIS-3 (Open Access Series of Imaging Studies)",
      domain: "Mild Cognitive Impairment (MCI) & Clinical Dementia Rating (CDR)",
      samples: "1,098 participants / 2,168 scans",
      purpose: "Mapping daily game performance (grid accuracy, spatial recall) to standardized MoCA/MMSE clinical scores."
    },
    {
      name: "AI4Bharat IndicVoices & IndicVoices-R",
      domain: "Multilingual Regional Speech Corpus",
      samples: "16,000+ hours of speech across 22 Indic languages (Assamese, Manipuri, Khasi, Bodo, Bengali, Hindi, English)",
      purpose: "Fine-tuning voice recognition for elderly accents, speech dysarthria, and regional dialects across North East India."
    },
    {
      name: "Samvaad & IndicNLP Multilingual Conversational Corpus",
      domain: "Hindi-English & Regional Conversational Dialogue",
      samples: "1.2 Million conversational turns",
      purpose: "Training the Aai Voice Companion for soothing, dementia-empathetic natural dialogues, morning greetings, and reminiscence prompts."
    },
    {
      name: "NER Cultural & Heritage Audio-Visual Asset Dataset (MDoNER Archive)",
      domain: "Regional Visual & Acoustic Stimuli",
      samples: "450+ curated high-definition NER heritage assets & 432Hz/528Hz acoustic soundscapes",
      purpose: "Powering culturally familiar memory matching cards and reminiscence sound therapy (Bihu Pepa, Manipuri Pung, Kaziranga fauna)."
    }
  ],

  conversationalDatasetDetails: {
    languagesSupported: [
      "Hindi", 
      "English (Indian Accents)", 
      "Assamese", 
      "Manipuri / Meiteilon", 
      "Bengali", 
      "Khasi", 
      "Garo", 
      "Mizo", 
      "Nagamese", 
      "Bodo"
    ],
    conversationalStyle: "Empathetic, Slow-Paced, Reminiscence-Focused, High-Clarity Voice Cues",
    safetyFilters: "Agitation detection, emergency distress detection, voice pitch tremor analysis"
  }
};
