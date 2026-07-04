import sys
sys.path.insert(0, '.')
from inference.hotspot import HotspotPredictor
predictor = HotspotPredictor()
samples = [
    {'zone_id':'Z01','AQI':200,'PM2.5':56.14,'PM10':85.24,'temperature':38.35,'humidity':28,'hour':13,'day_of_week':5,'population_density':28000,'elderly_pct':0.12},
    {'zone_id':'Z04','AQI':200,'PM2.5':56.14,'PM10':85.24,'temperature':38.35,'humidity':28,'hour':13,'day_of_week':5,'population_density':15000,'elderly_pct':0.18},
    {'zone_id':'Z12','AQI':200,'PM2.5':56.14,'PM10':85.24,'temperature':38.35,'humidity':28,'hour':13,'day_of_week':5,'population_density':14000,'elderly_pct':0.20},
]
for d in samples:
    df = predictor.preprocess(d)
    raw = predictor.model.predict(df[["hour_sin","hour_cos","dow_sin","dow_cos","PM2.5","PM10","AQI","temperature","humidity","population_density","elderly_pct","rolling_calls_7","lag_24h"]])
    print(d['zone_id'], raw[0], round(raw[0]), predictor._get_history(d))
