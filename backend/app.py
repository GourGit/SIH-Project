from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, ClimateData
from sqlalchemy import text
from ml_validator import verify_data

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "Backend is running!"})
        
    @app.route('/api/db-test', methods=['GET'])
    def db_test():
        try:
            db.session.execute(text('SELECT 1'))
            return jsonify({"status": "success", "message": "Database connection successful!"})
        except Exception as e:
            return jsonify({"status": "error", "message": f"Database connection failed: {str(e)}"}), 500

    @app.route('/api/climate', methods=['GET'])
    def get_climate_data():
        try:
            limit = request.args.get('limit', 50, type=int)
            data = ClimateData.query.limit(limit).all()
            result = [item.to_dict() for item in data]
            return jsonify({"status": "success", "count": len(result), "data": result})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500


    @app.route('/api/verify-data', methods=['GET'])
    def verify_data_endpoint():
        try:
            report = verify_data()
            return jsonify(report)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5005)
