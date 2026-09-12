import pandas as pd
from sklearn.ensemble import IsolationForest
from models import ClimateData, db

def verify_data():
    records = ClimateData.query.all()
    if not records:
        return {"status": "success", "message": "No data found", "duplicates": [], "anomalies": []}

    data_list = [r.to_dict() for r in records]
    df = pd.DataFrame(data_list)

    if 'date' in df.columns and 'city' in df.columns and 'state' in df.columns:
        duplicates_mask = df.duplicated(subset=['date', 'city', 'state'], keep=False)
        duplicate_ids = df[duplicates_mask]['id'].tolist()
    else:
        duplicate_ids = []

    anomaly_ids = []
    features = ['temperature_avg', 'humidity', 'rainfall', 'wind_speed']
    available_features = [f for f in features if f in df.columns]
    
    if len(available_features) > 0 and len(df) > 10:
        ml_df = df.dropna(subset=available_features).copy()
        if len(ml_df) > 10:
            model = IsolationForest(contamination=0.05, random_state=42)
            ml_df['anomaly_score'] = model.fit_predict(ml_df[available_features])
            anomalies = ml_df[ml_df['anomaly_score'] == -1]
            anomaly_ids = anomalies['id'].tolist()

    return {
        "status": "success",
        "total_scanned": len(df),
        "duplicates": {
            "count": len(duplicate_ids),
            "ids": duplicate_ids
        },
        "anomalies": {
            "count": len(anomaly_ids),
            "ids": anomaly_ids
        }
    }
