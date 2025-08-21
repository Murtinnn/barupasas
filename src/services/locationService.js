import * as Location from 'expo-location';

class LocationService {
  constructor() {
    this.hasPermission = false;
    this.currentLocation = null;
    this.permissionPromise = null;
  }

  async requestPermission() {
    // If already requesting, return the same promise
    if (this.permissionPromise) {
      return this.permissionPromise;
    }

    // If already has permission, return immediately
    if (this.hasPermission) {
      return { granted: true };
    }

    // Request permission only once
    this.permissionPromise = Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        this.hasPermission = status === 'granted';
        this.permissionPromise = null; // Reset promise
        return { granted: this.hasPermission };
      })
      .catch((error) => {
        this.permissionPromise = null; // Reset promise on error
        console.error('Location permission error:', error);
        return { granted: false, error };
      });

    return this.permissionPromise;
  }

  async getCurrentLocation() {
    try {
      const permission = await this.requestPermission();
      if (!permission.granted) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.Balanced 
      });
      
      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Get location error:', error);
      return null;
    }
  }

  getLastKnownLocation() {
    return this.currentLocation;
  }
}

// Export singleton instance
export default new LocationService();
