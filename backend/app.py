from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import BertTokenizer, BertForSequenceClassification
import torch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
model_path = "bert_sentiment_model"

tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def predict_sentiment(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    outputs = model(**inputs)

    prediction = torch.argmax(outputs.logits, dim=1).item()

    if prediction == 1:
        return "Positive"
    else:
        return "Negative"


@app.get("/predict")
def predict(text: str):
    sentiment = predict_sentiment(text)
    return {"sentiment": sentiment}