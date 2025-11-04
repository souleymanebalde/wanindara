# optimizer.py
from math import radians, sin, cos, sqrt, atan2
from itertools import permutations

def distance(p1, p2):
    R = 6371  # rayon terrestre km
    lat1, lon1 = radians(p1['latitude']), radians(p1['longitude'])
    lat2, lon2 = radians(p2['latitude']), radians(p2['longitude'])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def tsp(points, start_index=0):
    start = points[start_index]
    others = [p for i, p in enumerate(points) if i != start_index]
    
    best_route = None
    best_dist = float('inf')
    
    for perm in permutations(others):
        route = [start] + list(perm)
        total_dist = sum(distance(route[i], route[i+1]) for i in range(len(route)-1))
        if total_dist < best_dist:
            best_dist = total_dist
            best_route = route
    return best_route, best_dist
