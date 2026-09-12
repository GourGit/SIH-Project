from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ClimateData(db.Model):
    __tablename__ = 'climate_data'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    temperature_max = db.Column(db.Float)
    temperature_min = db.Column(db.Float)
    temperature_avg = db.Column(db.Float)
    humidity = db.Column(db.Float)
    rainfall = db.Column(db.Float)
    wind_speed = db.Column(db.Float)
    aqi = db.Column(db.Float)
    aqi_category = db.Column(db.String(50))
    pressure = db.Column(db.Float)
    cloud_cover = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'city': self.city,
            'state': self.state,
            'temperature_max': self.temperature_max,
            'temperature_min': self.temperature_min,
            'temperature_avg': self.temperature_avg,
            'humidity': self.humidity,
            'rainfall': self.rainfall,
            'wind_speed': self.wind_speed,
            'aqi': self.aqi,
            'aqi_category': self.aqi_category,
            'pressure': self.pressure,
            'cloud_cover': self.cloud_cover
        }
